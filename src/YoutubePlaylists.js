import React, { useState } from "react";

function YoutubePlaylists(props)
{
    const [transferring, setTransferring] = useState("");
    const spotifyPlaylist = props.playlistItem;
    async function createPlaylist(){
        var authParams = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("youtubeToken"),
                'Accept': "application/json",
                'Content-Type': "application/json"
        },
            body: JSON.stringify({
                snippet:{
                    title: spotifyPlaylist.name,
                    description: spotifyPlaylist.description
                }
            })
          };
        const response = await fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet", authParams);
        const data = await response.json();
        const playlistID = data.id
        addVideosToPlaylist(playlistID);
    }

    async function addVideosToPlaylist(playlistID)
    {
        setTransferring("Transferring playlist...");
        const searchQueries = await JSON.parse(localStorage.getItem(spotifyPlaylist.name));
        // Youtube API only allows a limited amount of api calls. I am applying for more quota, but for now
        // I am limiting the maximum transfers to 100
        let limit = 100;
        if(props.total < limit)
        {
            limit = props.total;
        }
        for(let i = 0; i < limit; i++)
        {
            const videoID = await searchVideo(searchQueries[i]);
            // add searched video to created Youtube playlist
            var authParams = {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("youtubeToken"),
                    'Accept': "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    snippet:{
                        playlistId: playlistID,
                        resourceId: {
                            kind:"youtube#video",
                            videoId: videoID
                        }
                    }
                })
            };
        
            fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet", authParams);
        }
        setTransferring("Playlist has been Transferred!");
    }

    async function searchVideo(query)
    {
        var authParams = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("youtubeToken"),
                'Accept': "application/json",
                'Content-Type': "application/json"
            },
          };
        
        var apiCall = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=";
        apiCall += encodeURIComponent(query);
        const response = await fetch(apiCall, authParams);
        const data = await response.json();

        return data.items[0].id.videoId;
    }
    
    return (
        <div className="youtube">
            <button onClick={createPlaylist}>Transfer {spotifyPlaylist.name}</button>
            <div>{transferring}</div>
        </div>
    );
}

export default YoutubePlaylists;