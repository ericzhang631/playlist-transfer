import React from "react";
import SpotifyPlaylists from "./SpotifyPlaylists";

function SpotifyLogin() 
{
    function generateRandomString(length)
    {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length)
        {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    function handleLogin()
    {
        var url = "https://accounts.spotify.com/authorize";
        const clientID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const redirectURI = "https://playlist-transfer.netlify.app/";
        const scope = "playlist-read-private";
        const state = generateRandomString(16);
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(clientID);
        url += '&scope=' + encodeURIComponent(scope);
        url += '&redirect_uri=' + encodeURIComponent(redirectURI);
        url += '&state=' + encodeURIComponent(state);
        window.location = url;
        getToken(window.location.hash);
    }

    function getReturnedParamsFromSpotifyAuth(hash)
    {
        const stringAfterHashtag = hash.substring(1);
        const paramsInUrl = stringAfterHashtag.split("&");
        const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
          const [key, value] = currentValue.split("=");
          accumulater[key] = value;
          return accumulater;
        }, {});
      
        return paramsSplitUp;
    }

    function getToken(hash)
    {
      const { access_token, expires_in, token_type } = getReturnedParamsFromSpotifyAuth(hash);
      void(expires_in);
      void(token_type);

      localStorage.clear();
      localStorage.setItem("token", access_token);
    }

    return (
    <div className="spotifyLogin">
      {getToken(window.location.hash)}
      <button onClick={handleLogin}>Login to Spotify</button>
      <SpotifyPlaylists />
    </div>
  );
}

export default SpotifyLogin;
