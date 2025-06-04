const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files (images, CSS, JS, etc.)
app.use(express.static(__dirname));

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, 'profile.html')));
app.get('/prelobby', (req, res) => res.sendFile(path.join(__dirname, 'prelobby.html')));
app.get('/lobby', (req, res) => res.sendFile(path.join(__dirname, 'lobby.html')));

// WebSocket Lobbies Data
const lobbies = {};

function generateUniqueRoomId() {
  let id;
  do {
    id = Math.random().toString(36).substring(2, 7);
  } while (lobbies[id]);
  return id;
}

function generateUniqueWsCode() {
  let code;
  do {
    code = Math.random().toString(36).substring(2, 10);
  } while (Object.values(lobbies).some(lobby => lobby.players.some(p => p.wscode === code)));
  return code;
}

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established.');

  ws.on('message', (message) => {
    let msg;
    try {
      msg = JSON.parse(message);
    } catch (e) {
      console.log('Invalid JSON received');
      return;
    }

    if (msg.type === 'createlobby') {
      console.log(`Creating lobby for user: ${msg.username}, game: ${msg.game}`);
      const roomid = generateUniqueRoomId();
      const wscode = generateUniqueWsCode();

      lobbies[roomid] = {
        hostws: ws,
        players: [{
          plyrid: 0,
          username: msg.username,
          icon: msg.icon,
          ws: ws,
          wscode: wscode,
          wsindex: 0,
          host: true,
          game: msg.game,
          rounds: msg.round
        }]
      };

      console.log(`Lobby created: ${roomid}, Host: ${msg.username}`);
      ws.send(JSON.stringify({
        type: 'lobbycreated',
        plyrid: 0,
        roomid,
        wscode
      }));

    } else if (msg.type === 'page_entered') {
      console.log(`Page entered: roomid=${msg.roomid}, plyrid=${msg.plyrid}, wscode=${msg.wscode}`);
      const { roomid, plyrid, wscode } = msg;
      if (!lobbies[roomid]) {
        console.log(`Room error: ${roomid} does not exist`);
        return ws.send(JSON.stringify({ type: 'roomerr' }));
      }

      const player = lobbies[roomid].players.find(p => p.plyrid === plyrid);
      if (!player) {
        console.log(`Player error: plyrid=${plyrid} not found in room=${roomid}`);
        return ws.send(JSON.stringify({ type: 'plyrerror' }));
      }

      if (player.wscode !== wscode) {
        console.log(`WS code mismatch for player ${plyrid}`);
        return ws.send(JSON.stringify({ type: 'wserror' }));
      }

      player.ws = ws;
      player.wsindex++;
      console.log(`WS success: Player ${plyrid} in room ${roomid} reconnected.`);
      ws.send(JSON.stringify({ type: 'wssuccess' }));

    } else if (msg.type === 'joinlobby') {
      console.log(`Join lobby request: user=${msg.username}, room=${msg.roomid}, game=${msg.game}`);
      const { username, icon, roomid, game } = msg;
      if (!lobbies[roomid]) {
        console.log(`Room ${roomid} not found`);
        return ws.send(JSON.stringify({ type: 'roomnot' }));
      }

      const lobby = lobbies[roomid];
      if (lobby.hostws.readyState !== WebSocket.OPEN) {
        console.log(`Host not connected for room ${roomid}`);
        return ws.send(JSON.stringify({ type: 'nohostin' }));
      }

      if (lobby.players[0].game !== game) {
        console.log(`Game mismatch in room ${roomid}`);
        return ws.send(JSON.stringify({ type: 'gameniotsamew' }));
      }

      if (lobby.players.length >= 8) {
        console.log(`Room ${roomid} is full`);
        return ws.send(JSON.stringify({ type: 'gamefull' }));
      }

      const allWsIndexEqual = lobby.players.every(p => p.wsindex === lobby.players[0].wsindex);
      if (!allWsIndexEqual) {
        console.log(`WS index mismatch detected. Aborting join.`);
        return;
      }

      const plyrid = lobby.players.length;
      const wscode = generateUniqueWsCode();
      const wsindex = lobby.players[0].wsindex;
      const newPlayer = { plyrid, username, icon, ws, wscode, wsindex, host: false, game, rounds: lobby.players[0].rounds };

      lobby.players.push(newPlayer);
      console.log(`Player joined: ${username}, plyrid=${plyrid}, room=${roomid}`);

      for (const p of lobby.players) {
        if (p.plyrid < plyrid && p.ws.readyState === WebSocket.OPEN) {
          console.log(`Notifying existing player: ${p.username} about ${username}`);
          p.ws.send(JSON.stringify({
            type: 'someuserjoin',
            username,
            icon,
            wsindex
          }));
        }
      }

      for (const p of lobby.players) {
        if (p.plyrid < plyrid && p.wsindex === wsindex) {
          console.log(`Sending existing player info to ${username}: ${p.username}`);
          ws.send(JSON.stringify({
            type: 'userjoin',
            username: p.username,
            icon: p.icon,
            wsindex: p.wsindex
          }));
        }
      }

      console.log(`Sending lobbyjoined to ${username}, plyrid=${plyrid}`);
      ws.send(JSON.stringify({
        type: 'lobbyjoined',
        plyrid,
        wscode,
        round: newPlayer.rounds
      }));
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
