const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index', {
        title: 'IPTV Live Player',
        streamUrl: process.env.STREAM_URL || 'https://001.fclplayer.net/live/csstream2/playlist.m3u8?id=1002&pk=37c87b478743832a489c0827aec5db47c08866509704517a308ec563515646c7'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
