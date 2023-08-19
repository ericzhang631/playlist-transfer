# Playlist Transfer Web App

This is a static React web app that allows users to seamlessly transfer their Spotify playlists to YouTube. The app provides an interface for logging in to Spotify and Google, fetching playlists, selecting playlists to transfer, and initiating the transfer process.

This project is currently in development mode, so it has some limitations like quota restrictions for YouTube, and only allows whitelisted users for Spotify

## Features

- **Spotify Login:** Users can log in to their Spotify account through the app. As of now, the app is in development mode, and only whitelisted users can access the Spotify login functionality.

- **Google Login:** Users can also log in to their Google account, which is necessary for accessing YouTube's API.

- **Fetch Playlists:** Once logged in, users can retrieve their Spotify playlists directly from their account.

- **Select Playlists:** Users can select specific Spotify playlists they wish to transfer to YouTube.

- **Transfer to YouTube:** The app initiates the transfer of selected Spotify playlists to YouTube. Please note that due to quota limitations, the app can currently only transfer up to 100 songs per playlist. This limitation will be removed once a quota increase is approved.
