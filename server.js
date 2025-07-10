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

// --- Lobby Storage ---
const publicLobbies = {};
const privateLobbies = {};
const activePlayers = new Set();
let lobbyCounter = 0;

// --- Utils ---
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

// --- WebSocket Handling ---
wss.on('connection', (ws) => {
  console.log('[+] New WebSocket connection established.');

  ws.on('message', (msg) => {
    let data;
    try {
      data = JSON.parse(msg);
    } catch (err) {
      console.warn('[!] Invalid JSON received:', msg);
      return;
    }

    const { type } = data;
    console.log(`→ Received type: ${type}`, data);

    if (type === 'activeplayer') {
      activePlayers.add(ws);
      console.log('New active player connected');

      const baseLobbies = Object.entries(publicLobbies).map(([roomid, room]) => ({
        lobbyid: 'lobby_' + roomid,
        roomname: room.roomname,
        roomid,
        progress: room.progress || 1
      }));

      ws.send(JSON.stringify({
        type: 'basedata',
        lobbies: baseLobbies
      }));

      console.log("✅ Sent base data to entry client.");
    }

    else if (type === 'createlobby') {
      const { username, public: isPublic } = data;
      const roomid = generateUniqueId(isPublic ? publicLobbies : privateLobbies);
      const wscode = generateWscode();
      const roomname = isPublic ? generateRoomName() : null;

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
        roomname,
        progress: isPublic ? 0 : null
      };

      if (isPublic) publicLobbies[roomid] = roomData;
      else privateLobbies[roomid] = roomData;

      console.log(`[+] Lobby created: ${roomid} (${isPublic ? 'public' : 'private'}) by ${username}`);
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
      if (!room) return console.warn(`[!] Room ID ${roomid} not found for page_entered`);

      const player = room.players.find(p => p.plyrid === plyrid && p.wscode === wscode);
      if (!player) return console.warn(`[!] Player not found in room ${roomid} for page_entered`);

      player.ws = ws;
      player.wsindex = (player.wsindex || 0) + 1;
      console.log(`[✓] page_entered for ${player.username} (plyrid=${plyrid}, wsindex=${player.wsindex})`);

      if (!isPublic || room.progress == null) return;

      room.progress++;

      if (host) {
        const addRowMsg = {
          type: 'addrow',
          lobbyid: 'lobby_' + roomid,
          roomname: room.roomname,
          roomid,
          progress: room.progress
        };

        console.log(`[📢] Broadcasting addrow → ${room.roomname} (${roomid}) = ${room.progress}/8`);
        for (const client of activePlayers) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(addRowMsg));
          }
        }

      } else {
        const update = {
          type: 'updateprogress',
          roomid,
          newpb: room.progress
        };

        console.log(`[📊] Broadcasting updateprogress → ${roomid}: ${room.progress}/8`);
        for (const client of activePlayers) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(update));
          }
        }
      }
    }

    else if (type === 'joinlobby') {
      const { username, roomid, public: isPublic } = data;
      const dict = isPublic ? publicLobbies : privateLobbies;
      const room = dict[roomid];
      if (!room) return console.warn(`[!] Room ${roomid} not found for joinlobby`);

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
      console.log(`[+] Player ${username} joined room ${roomid} as plyrid ${plyrid}`);

      ws.send(JSON.stringify({
        type: 'lobbycreated',
        host: false,
        wscode,
        public: isPublic,
        plyrid,
        roomid
      }));
    }

    else {
      console.warn(`[!] Unknown message type: ${type}`);
    }
  });

  ws.on('close', () => {
    activePlayers.delete(ws);
    console.log('[x] WebSocket disconnected. Active players now:', activePlayers.size);

    // Check public and private lobbies
    [publicLobbies, privateLobbies].forEach((dict, isPublic) => {
      for (const [roomid, room] of Object.entries(dict)) {
        const idx = room.players.findIndex(p => p.ws === ws && p.wsindex === 1);
        if (idx !== -1) {
          const player = room.players[idx];
          const wasHost = player.host;
          room.players.splice(idx, 1);
          console.log(`[-] Removed ${player.username} from room ${roomid} (host=${wasHost})`);

          if (isPublic && room.progress != null) {
            room.progress--;

            const update = {
              type: 'updateprogress',
              roomid,
              newpb: room.progress
            };

            console.log(`[📉] Broadcasting updateprogress → ${roomid}: ${room.progress}/8`);
            for (const client of activePlayers) {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(update));
              }
            }
          }

          break; // stop checking once found
        }
      }
    });
  });