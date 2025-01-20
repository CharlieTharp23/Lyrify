const CLIENT_ID = '6861c588b03f40d88960829ec26210f5'; // Replace with your Spotify Client ID
const CLIENT_SECRET = 'bd56844b4cb8465e83ed84d204a52259'; // Replace with your Spotify Client Secret
const REDIRECT_URI = 'http://localhost:8000/callback'; // Replace with your redirect URI

let access_token = ''; // Store the access token

// 1. Redirect to Spotify Authorization URL
function redirectToSpotifyAuth() {
  const authURL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user-read-private%20user-read-email%20playlist-read-private%20user-library-read`;
  window.location.href = authURL;
}

// 2. Handle the redirect and extract access token from URL
function handleSpotifyRedirect() {
  const urlParams = new URLSearchParams(window.location.search);
  const authorizationCode = urlParams.get('code');
  
  // Log the authorization code for debugging
  console.log('Authorization Code:', authorizationCode);

  if (authorizationCode) {
    fetchAccessToken(authorizationCode);
  } else {
    console.error('No authorization code found in URL');
  }
}

// 3. Fetch access token using the authorization code
function fetchAccessToken(code) {
  const data = new URLSearchParams();
  data.append('code', code);
  data.append('redirect_uri', REDIRECT_URI);
  data.append('grant_type', 'authorization_code');

  // Log the request body for debugging
  console.log('Request Body:', data.toString());
  
  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: data
  })
  .then(response => response.json())
  .then(data => {
    if (data.access_token) {
      access_token = data.access_token;
      console.log('Access Token:', access_token);
      // Store the access token in localStorage
      localStorage.setItem('spotifyAccessToken', access_token);

      // Redirect to the main page after successful login
      window.location.href = 'main.html';  // Adjust to the correct redirect location
    } else {
      console.error('Failed to retrieve access token:', data);
    }
  })
  .catch(error => console.error('Error fetching access token:', error));
}

// Call this function to start the authentication process when the page loads
window.onload = () => {
  if (window.location.search.includes('code')) {
    handleSpotifyRedirect();
  } else {
    console.log('No authorization code found in URL');
  }
};
