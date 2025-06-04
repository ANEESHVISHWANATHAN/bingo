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
  ws.on('message', (message) => {
    let msg;
    try {
      msg = JSON.parse(message);
    } catch (e) {
      return;
    }

    if (msg.type === 'createlobby') {
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
      ws.send(JSON.stringify({
        type: 'lobbycreated',
        plyrid: 0,
        roomid,
        wscode
      }));

    } else if (msg.type === 'page_entered') {
      const { roomid, plyrid, wscode } = msg;
      if (!lobbies[roomid]) return ws.send(JSON.stringify({ type: 'roomerr' }));

      const player = lobbies[roomid].players.find(p => p.plyrid === plyrid);
      if (!player) return ws.send(JSON.stringify({ type: 'plyrerror' }));
      if (player.wscode !== wscode) return ws.send(JSON.stringify({ type: 'wserror' }));

      player.ws = ws;
      player.wsindex++;

      ws.send(JSON.stringify({ type: 'wssuccess' }));

    } else if (msg.type === 'joinlobby') {
      const { username, icon, roomid, game } = msg;
      if (!lobbies[roomid]) return ws.send(JSON.stringify({ type: 'roomnot' }));
      const lobby = lobbies[roomid];

      if (lobby.hostws.readyState !== WebSocket.OPEN) return ws.send(JSON.stringify({ type: 'nohostin' }));
      if (lobby.players[0].game !== game) return ws.send(JSON.stringify({ type: 'gameniotsamew' }));
      if (lobby.players.length >= 8) return ws.send(JSON.stringify({ type: 'gamefull' }));

      const allWsIndexEqual = lobby.players.every(p => p.wsindex === lobby.players[0].wsindex);
      if (!allWsIndexEqual) return;

      const plyrid = lobby.players.length;
      const wscode = generateUniqueWsCode();
      const wsindex = lobby.players[0].wsindex;
      const newPlayer = { plyrid, username, icon, ws, wscode, wsindex, host: false, game, rounds: lobby.players[0].rounds };
      lobby.players.push(newPlayer);

      // Notify existing players
      for (const p of lobby.players) {
        if (p.plyrid < plyrid && p.ws.readyState === WebSocket.OPEN) {
          p.ws.send(JSON.stringify({
            type: 'someuserjoin',
            username,
            icon,
            wsindex
          }));
        }
      }

      // Notify the new player about existing players
      for (const p of lobby.players) {
        if (p.plyrid < plyrid && p.wsindex === wsindex) {
          ws.send(JSON.stringify({
            type: 'userjoin',
            username: p.username,
            icon: p.icon,
            wsindex: p.wsindex
          }));
        }
      }

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
