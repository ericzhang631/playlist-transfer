from dotenv import load_dotenv
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from spotipy.oauth2 import SpotifyOAuth
import spotipy
import os
import sys
import io
import pickle

load_dotenv()

spotifyClientID = os.getenv("SPOTIFY_CLIENT_ID")
spotifyClientSecret = os.getenv("SPOTIFY_CLIENT_SECRET")

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def getSpotifyAuth():
    return spotipy.Spotify(
        auth_manager=SpotifyOAuth(
            client_id=spotifyClientID,
            client_secret=spotifyClientSecret,
            redirect_uri="http://localhost:5000/redirect",
            scope="playlist-read-private user-library-read"
        )
    )

def getSearchQueries():
    results = sp.playlist(playlist['id'], fields="tracks,next")
    tracks = results['tracks']
    addTracks(tracks)

    while tracks['next']:
        tracks = sp.next(tracks)
        addTracks(tracks)

def addTracks(results):
    for i, item in enumerate(results['items']):
        track = item['track']
        query = track['artists'][0]['name'] + " " + track['name']
        youtubeSearchQueries.append(query)

def getYoutubeAuth():
    credentials = None
    # token.pickle stores the user's credentials from previously successful logins
    if os.path.exists("token.pickle"):
        print("Loading Credentials From File...")
        with open("token.pickle", "rb") as token:
            credentials = pickle.load(token)
    # if there are no valid credentials available, then either refresh the token or log in
    if not credentials or not credentials.valid:
        if credentials and credentials.expired and credentials.refresh_token:
            print("Refreshing Access Token...")
            credentials.refresh(Request())
        else:
            print("Fetching New Tokens...")
            flow = InstalledAppFlow.from_client_secrets_file(
                "client_secret.json",
                scopes=["https://www.googleapis.com/auth/youtube.force-ssl"]
            )

            flow.run_local_server(
                port=8080, prompt="consent", authorization_prompt_message=""
            )
            credentials = flow.credentials

            #Save the credentials for the next run
            with open("token.pickle", "wb") as f:
                print("Saving Credentials for Future Use...")
                pickle.dump(credentials, f)
    return credentials

def createYoutubePlaylist(playlistTitle, playlistDescription):
    request = youtube.playlists().insert(
        part = "snippet",
        body = {
            "snippet":{
                "title": playlistTitle,
                "description": playlistDescription
            }
        }
    )
    return request.execute()

def addVideos(playlistID):
    for i in range(7):      # SHOULD BE:     for i in range(len(youtubeSearchQueries)):
        videoID = searchVideo(i)
        #put video in playlist
        request = youtube.playlistItems().insert(
            part = "snippet",
            body = {
                "snippet":{
                    "playlistId":playlistID,
                    "resourceId":{
                        "kind":"youtube#video",
                        "videoId":videoID
                    }
                }
            }
        )
        request.execute()
    
#search for youtube video
def searchVideo(index):
    request = youtube.search().list(
        part = "snippet",
        maxResults = 1,
        q = youtubeSearchQueries[index]
    )
    response = request.execute()
    videoID = response["items"][0]["id"]["videoId"]
    return videoID
# main program

# configure spotify
sp = getSpotifyAuth()
playlists = sp.current_user_playlists()

# configure youtube
youtubeToken = getYoutubeAuth()
youtube = build("youtube", "v3", credentials=youtubeToken)
youtubeSearchQueries = []

for playlist in playlists['items']:
    youtubeSearchQueries.clear()
    getSearchQueries()
    response = createYoutubePlaylist(playlist["name"], playlist["description"])
    playlistID = response["id"]
    addVideos(playlistID)