# CatCall WebRTC React

CatCall WebRTC React is a lightweight proof of concept (POC) for video calls using WebRTC, built with ReactJS. This project demonstrates the basic functionalities required to establish a video call between two peers using WebRTC technology.

## Features

- Video and audio calls
- Real-time communication (for handshake) using WebSockets
- Firebase integration for analytics
- Responsive UI with TailwindCSS

## Limitations

This project does not use a TURN server, which may cause issues in establishing a proper connection in some cases. TURN servers are used to relay traffic if a direct peer-to-peer connection cannot be established, typically due to network restrictions such as NATs and firewalls. Without a TURN server, users behind restrictive networks may experience connectivity issues.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager

### Installation

1. Clone the repository:

```sh
git clone https://github.com/yourusername/catcall-webrtc-react.git
cd catcall-webrtc-react
```

2. Install dependencies:

```sh
yarn install
```

3. Create a `.env` file in the root directory and add the following environment variables:

```sh
VITE_REACT_APP_WS_URL=ws://your-websocket-url
```

### Running the Application

To start the development server:

```sh
yarn dev
```

To  start the development server with local expose:

```sh
yarn dev:host
```

### Building the Application

To build the application for production:

```sh
yarn build
```

## Linting

To run ESLint:

```sh
yarn lint
```
