// The access token should now be available in localStorage
let access_token = localStorage.getItem('spotifyAccessToken');

if (!access_token) {
  // If there's no access token, redirect the user to the login page
  window.location.href = 'website.html';  // Adjust to the correct path for the auth page
} else {
  // Fetch and display user data once the page loads
  fetchUserData();
  fetchUserPlaylists();
  fetchUserTopArtists();
}

// 1. Fetch user data from Spotify (user profile)
function fetchUserData() {
  fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('User Profile:', data);
    const userName = data.display_name;
    const userEmail = data.email;
    const userImage = data.images[0]?.url;

    // Update HTML with user data
    document.getElementById('user-name').innerText = `Name: ${userName}`;
    document.getElementById('user-email').innerText = `Email: ${userEmail}`;
    document.getElementById('user-image').src = userImage;

    // Store user data in localStorage
    localStorage.setItem('spotifyUserName', userName);
    localStorage.setItem('spotifyUserEmail', userEmail);
    localStorage.setItem('spotifyUserImage', userImage);
  })
  .catch(error => console.error('Error fetching user profile:', error));
}

// 2. Fetch user's playlists
function fetchUserPlaylists() {
  fetch('https://api.spotify.com/v1/me/playlists', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('User Playlists:', data);

    // Display playlists on the webpage
    const playlistsContainer = document.getElementById('playlists');
    data.items.forEach(playlist => {
      const playlistElement = document.createElement('div');
      playlistElement.classList.add('playlist');
      playlistElement.innerHTML = `<p>${playlist.name}</p>`;
      playlistsContainer.appendChild(playlistElement);
    });

    // Store playlists in localStorage
    localStorage.setItem('spotifyPlaylists', JSON.stringify(data.items));
  })
  .catch(error => console.error('Error fetching playlists:', error));
}

// 3. Fetch user's top artists
function fetchUserTopArtists() {
  fetch('https://api.spotify.com/v1/me/top/artists', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('User Top Artists:', data);

    // Display top artists on the webpage
    const artistsContainer = document.getElementById('top-artists');
    data.items.forEach(artist => {
      const artistElement = document.createElement('div');
      artistElement.classList.add('artist');
      artistElement.innerHTML = `<p>${artist.name}</p>`;
      artistsContainer.appendChild(artistElement);
    });

    // Store top artists in localStorage
    localStorage.setItem('spotifyTopArtists', JSON.stringify(data.items));
  })
  .catch(error => console.error('Error fetching top artists:', error));
}
