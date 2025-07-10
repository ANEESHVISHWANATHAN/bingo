const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const http = require('http');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/monopoly', (req, res) => res.sendFile(path.join(__dirname, 'monopoly.html')));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// -- Lobby storage --
const publicLobbies = {};
const privateLobbies = {};
const activePlayers = new Set(); // for joinlabel list
let lobbyCounter = 0;

// -- Utility Functions --
function generateUniqueId(dict) {
  let id;
  do {
    id = Math.random().toString(36).substr(2, 5).toUpperCase();
  } while (dict[id]);
  return id;
}

function generateWscode() {
  return crypto.randomBytes(6).toString('hex');
}

function generateRoomName() {
  return 'Lobby' + (++lobbyCounter);
}

// -- WebSocket Handling --
wss.on('connection', (ws) => {
  console.log("New connection");

  ws.on('message', (msg) => {
    let data;
    try {
      data = JSON.parse(msg);
    } catch {
      return;
    }

    const { type } = data;

    if (type === 'activeplayer') {
      activePlayers.add(ws);
    }

    else if (type === 'createlobby') {
      const { username, public: isPublic } = data;

      const roomid = generateUniqueId(isPublic ? publicLobbies : privateLobbies);
      const wscode = generateWscode();

      const player = {
        plyrid: 0,
        username,
        color: null,
        ws,
        wsindex: 0,
        wscode,
        host: true
      };

      const roomData = {
        hostws: ws,
        players: [player],
        roomname: isPublic ? generateRoomName() : null,
        progress: isPublic ? 1 : null
      };

      if (isPublic) publicLobbies[roomid] = roomData;
      else privateLobbies[roomid] = roomData;

      ws.send(JSON.stringify({
        type: 'lobbycreated',
        host: true,
        wscode,
        public: isPublic,
        plyrid: 0,
        roomid
      }));
    }

    else if (type === 'page_entered') {
      const { host, public: isPublic, roomid, wscode, plyrid } = data;

      const dict = isPublic ? publicLobbies : privateLobbies;
      const room = dict[roomid];
      if (!room) return;

      const player = room.players.find(p => p.plyrid === plyrid && p.wscode === wscode);
      if (!player) return;

      player.ws = ws;
      player.wsindex = (player.wsindex || 0) + 1;

      if (host) {
        room.hostws = ws;
        if (isPublic && room.progress !== undefined) {
          room.progress++;

          // New row to all active players
          const lobbyid = 'lobby_' + roomid;
          const row = {
            type: 'rowadded',
            lobbyid,
            roomname: room.roomname,
            roomid,
            progress: room.progress
          };

          for (const client of activePlayers) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(row));
            }
          }
        }
      }
    }

    else if (type === 'joinlobby') {
      const { username, roomid, public: isPublic } = data;
      const dict = isPublic ? publicLobbies : privateLobbies;
      const room = dict[roomid];
      if (!room) return;

      const plyrid = room.players.length;
      const wscode = generateWscode();

      const player = {
        plyrid,
        username,
        color: null,
        ws,
        wsindex: 0,
        wscode,
        host: false
      };

      room.players.push(player);

      ws.send(JSON.stringify({
        type: 'lobbycreated',
        host: false,
        wscode,
        public: isPublic,
        plyrid,
        roomid
      }));
    }
  });

  ws.on('close', () => {
    activePlayers.delete(ws);
  });
});