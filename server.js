const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cookieSession = require('cookie-session');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for session management
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    keys: [process.env.COOKIE_KEY]
}));

app.set('view engine', 'ejs'); // Set the template engine to ejs
app.use(express.static('public')); // Serve static files from public directory

// Spotify API Credentials
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Home Route
app.get('/', (req, res) => {
    res.render('index');
});

// Login Route
// Login Route
app.get('/login', (req, res) => {
    const scopes = 'user-read-private user-read-email'; // Add any other scopes you need
    const authorizeURL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}`;
    res.redirect(authorizeURL);
});


// Callback Route
app.get('/callback', async (req, res) => {
    const code = req.query.code;

    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', null, {
        params: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    const accessToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token;

    // Store tokens in session
    req.session.accessToken = accessToken;
    req.session.refreshToken = refreshToken;

    // Redirect to the profile page or any other page after login
    res.redirect('/profile');
});

// Profile Route
app.get('/profile', async (req, res) => {
    if (!req.session.accessToken) {
        return res.redirect('/');
    }

    const userResponse = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: `Bearer ${req.session.accessToken}`
        }
    });

    res.render('profile', { user: userResponse.data });
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session = null; // Clear the session
    res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
