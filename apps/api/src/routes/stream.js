const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

// GET /api/stream/info - Protected stream details
router.get('/info', requireAuth, (req, res) => {
    res.json({
        success: true,
        stream: {
            title: 'IPTV Live Player',
            status: 'LIVE',
            streamUrl: process.env.STREAM_URL || 'https://001.fclplayer.net/live/csstream2/playlist.m3u8?id=1002&pk=37c87b478743832a489c0827aec5db47c08866509704517a308ec563515646c7'
        }
    });
});

module.exports = router;
