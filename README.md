# Cric - Live IPTV Player

A Node.js and Express.js web application using EJS templating engine and HLS.js for live video streaming.

## Features
- **Express.js** backend web server
- **EJS** view engine for dynamic templating
- **HLS.js** integration for live m3u8 stream playback
- Modular static assets (CSS styles & client-side player controls)

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- npm

### Installation
```bash
npm install
```

### Running the Application
```bash
# Start server
npm start

# Development mode (with nodemon auto-restart)
npm run dev
```

Once running, navigate to `http://localhost:3000` in your web browser.

### Configuration
You can optionally customize the port and live stream URL via environment variables:
```bash
PORT=3000 STREAM_URL="<your-stream-m3u8-url>" npm start
```
