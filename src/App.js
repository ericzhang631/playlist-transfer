import './App.css';
import { useState, useEffect } from "react";
import SpotifyLogin from "./SpotifyLogin";
import jwt_decode from "jwt-decode";


function App() {
  const [tokenClient, setTokenClient] = useState({});
  function handleCredentialResponse(response) {
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
  }

  function getAccessToken()
  {
    tokenClient.requestAccessToken();
  }
  useEffect(() => {
    /* global google */

    window.onload = function () {

      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
      });

      google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "medium" }  // customization attributes
      );

      //token client
      setTokenClient(google.accounts.oauth2.initTokenClient({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/youtube.force-ssl",
        callback: (tokenResponse) => {
          console.log(tokenResponse.access_token);
          // now have access to live token for any google api
          localStorage.setItem("youtubeToken", tokenResponse.access_token);
        }
      }));
    }
  }, []);



  return (
    <div className="App">
      <h1>Transfer your Spotify Playlists to Youtube</h1>
      <h3>How it works:</h3>
      <ol>
        <li>Login to Spotify</li>
        <li>Login to Google</li>
        <li>Get the access token for API calls (use the same Google account as the previous step)</li>
        <li>Get your playlists from Spotify</li>
        <li>Select which Spotify playlist you want to transfer</li>
        <li>Click the "Transfer" button to begin the transfer process to Youtube (this may take a while if you have a lot of songs)</li>
        <li>When the "Playlist has been Transferred!" message appears, you're done! Your transferred playlist should now be available on your Youtube account</li>
        <li>If you want to transfer another playlist, go back to step 5 and select another playlist</li>
      </ol>
      <center id="buttonDiv"></center>
      <input type="submit" onClick={getAccessToken} value="Get Access Token" />
      <SpotifyLogin />
    </div>
  );
}

export default App;
