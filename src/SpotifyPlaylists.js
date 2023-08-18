import React, { useState } from "react";
import YoutubePlaylists from "./YoutubePlaylists";

function SpotifyPlaylists()
{
  const [data, setData] = useState({});
  const [current, setCurrent] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [clickedButton, setClickedButton] = useState(false);

  async function getPlaylists()
  {
    var authParams = {
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}
    }

    var playlists = await fetch("https://api.spotify.com/v1/me/playlists", authParams)
      .then(response => response.json())
      .then(jsonData => {return jsonData})
      
    setData(playlists);

    return playlists;
  }

  async function getTracks(playlistID, index)
  {
    var authParams = {
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")}
    }

    var url = "https://api.spotify.com/v1/playlists/"
    url += playlistID;
    url += "/tracks";
    url += "?offset=";
    url += index;
    
    var tracks = await fetch(url, authParams)
      .then(response => response.json())
      .then(jsonData => {return jsonData})

    return tracks;
  }

  async function generateSearchQueries(playlists)
  {

    for(let i = 0; i < playlists.total; i++)
    {
      const searchQueries = [];
      const playlistID = playlists.items[i].id
      let index = 0;
      let limit = 100;
      let tracks = await getTracks(playlistID, index)
      const total = tracks.total;

      while(index < total)
      {

        if((total - index) < limit)
        {
          limit = (total - index);

          for(let j = 0; j < limit; j++)
          {
            const artistName = tracks.items[j].track.artists[0].name;
            const trackName = tracks.items[j].track.name;
            searchQueries.push(artistName + " " + trackName);
          }

          break;
        }

        for(let j = 0; j < limit; j++)
        {
          const artistName = tracks.items[j].track.artists[0].name;
          const trackName = tracks.items[j].track.name;
          searchQueries.push(artistName + " " + trackName);
        }

        index += 100;
        tracks = await getTracks(playlistID, index)
      }

      localStorage.setItem(playlists.items[i].name, JSON.stringify(searchQueries));
    }
    setIsLoaded(true);
  }

  async function handlePlaylists()
  {
    
    var playlists = await getPlaylists();
    generateSearchQueries(playlists);
  }
  
  return (
    <div className="spotifyPlaylists">
      <button onClick={() => {handlePlaylists(); setClickedButton(true);}}>Get Spotify Playlists</button>
      {!isLoaded && clickedButton && <p>Loading Playlists...</p>}
      {isLoaded && data?.items ? data.items.map((item, index) =>
        <div key={index}>
          <h2>Playlist {index + 1}: </h2>
          <img src = {item.images[0].url} alt = "" height ="100" />
          <h5>Title: {item.name} </h5>
          <h5>Tracks: {item.tracks.total}</h5>
          <button id = {item.name} onClick={() => {setCurrent(item.name)}} >Select Playlist {index + 1} </button>
          {current === item.name && <YoutubePlaylists playlistItem = {item}/>}
        </div>) : null
      }

    </div>
  );
}

export default SpotifyPlaylists;