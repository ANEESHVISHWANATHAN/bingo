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
const baseTiles = [
  { index: '0t', name: 'Natural Reserves', value: 950, img: 'natural.png', shadow: '0 0 6px rgba(50,200,100,0.6)' },
  { index: '1t', name: 'Oil Reserves', value: 1000, img: 'oil.png', shadow: '0 0 6px rgba(255,170,60,0.6)' },
  { index: '2t', name: 'Gas Reserves', value: 900, img: 'gas.png', shadow: '0 0 6px rgba(255,255,255,0.4)' },
  { index: '3t', name: 'Road Reserves', value: 850, img: 'roadc.png', shadow: '0 0 6px rgba(150,150,150,0.6)' },
  { index: '4t', name: 'Rail Reserves', value: 850, img: 'railc.png', shadow: '0 0 6px rgba(150,150,255,0.6)' },
  { index: '5t', name: 'Air Reserves', value: 800, img: 'planec.png', shadow: '0 0 6px rgba(120,220,255,0.6)' },
  { index: '6t', name: 'Tax House', value: 950, img: 'tax.png', shadow: '0 0 6px rgba(255,80,80,0.6)' },

  { index: '0r', name: 'Natural Reserves', value: 550, img: 'hospital.png', shadow: '0 0 6px rgba(80,200,255,0.6)' },
  { index: '1r', name: 'School', value: 550, img: 'school.png', shadow: '0 0 6px rgba(255,200,0,0.6)' },
  { index: '2r', name: 'Factory', value: 600, img: 'factory.png', shadow: '0 0 6px rgba(180,180,180,0.6)' },
  { index: '3r', name: 'Mall', value: 600, img: 'mall.png', shadow: '0 0 6px rgba(255,120,255,0.6)' },
  { index: '4r', name: 'Stock House', value: 850, img: 'stock.png', shadow: '0 0 6px rgba(255,255,120,0.6)' },
  { index: '5r', name: 'Surprise', value: null, img: 'surprise.png', shadow: '0 0 6px rgba(255,80,255,0.6)' },
  { index: '6r', name: 'Air Ways', value: 600, img: 'planes.png', shadow: '0 0 6px rgba(100,220,255,0.6)' },

  { index: '6b', name: 'Ceil Homes', value: 500, img: 'house.png', shadow: '0 0 6px rgba(255,255,255,0.4)' },
  { index: '5b', name: 'Ceil Homes', value: 500, img: 'house.png', shadow: '0 0 6px rgba(255,255,255,0.4)' },
  { index: '4b', name: 'Ceil Homes', value: 500, img: 'house.png', shadow: '0 0 6px rgba(255,255,255,0.4)' },
  { index: '3b', name: 'Feik Homes', value: 550, img: 'house.png', shadow: '0 0 6px rgba(255,255,255,0.4)' },
  { index: '2b', name: 'Feik Homes', value: 550, img: 'house.png', shadow: '0 0 6px rgba(255,255,255,0.4)' },
  { index: '1b', name: 'Molg Homes', value: 600, img: 'house.png', shadow: '0 0 6px rgba(255,255,255,0.4)' },
  { index: '0b', name: 'Surprise', value: null, img: 'surprise.png', shadow: '0 0 6px rgba(255,80,255,0.6)' },

  { index: '6l', name: 'Rail Ways', value: 650, img: 'rails.png', shadow: '0 0 6px rgba(160,160,255,0.6)' },
  { index: '5l', name: 'Road Ways', value: 650, img: 'roads.png', shadow: '0 0 6px rgba(180,180,180,0.6)' },
  { index: '4l', name: 'Surprise', value: null, img: 'surprise.png', shadow: '0 0 6px rgba(255,80,255,0.6)' },
  { index: '3l', name: 'Hospital', value: 550, img: 'hospital.png', shadow: '0 0 6px rgba(80,200,255,0.6)' },
  { index: '2l', name: 'School', value: 550, img: 'school.png', shadow: '0 0 6px rgba(255,200,0,0.6)' },
  { index: '1l', name: 'Factory', value: 600, img: 'factory.png', shadow: '0 0 6px rgba(180,180,180,0.6)' },
  { index: '0l', name: 'Mall', value: 600, img: 'mall.png', shadow: '0 0 6px rgba(255,120,255,0.6)' }
];

const baseCorners = [
  { index: 'ct0', name: 'Start', img: 'house.png', shadow: '0 0 6px rgba(255,255,255,0.4)' },
  { index: 'ct1', name: 'Jail', img: 'house.png', shadow: '0 0 6px rgba(255,255,255,0.4)' },
  { index: 'ct2', name: 'Rail', img: 'house.png', shadow: '0 0 6px rgba(255,255,255,0.4)' },
  { index: 'ct3', name: 'Go', img: 'house.png', shadow: '0 0 6px rgba(255,255,255,0.4)' }
];

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
      for (const p of room.players) {
  if (p.ws !== ws && p.ws.readyState === WebSocket.OPEN) {
    p.ws.send(JSON.stringify({
      type: 'sendnplayer',
      plyrid: player.plyrid,
      username: player.username,
      color: player.color||"#ffffff"
    }));
  }
}
      console.log(`📣 Notified others about new player ${player.username}`);
      console.log(`[✓] page_entered for ${player.username} (plyrid=${plyrid}, wsindex=${player.wsindex})`);
      if (host) {
  room.shuffledTiles = baseTiles;        // Already complete
  room.shuffledCorners = baseCorners;    // Already complete
  console.log(`📦 Assigned base tile and corner arrays directly to room ${roomid}`);
}
      room.shuffledTiles?.forEach(tile => {
  ws.send(JSON.stringify({
    type: "sendtiles",
    index: tile.index,
    propname: tile.name,
    propvalue: tile.value,
    propimg: tile.img,
    propimgshadow: tile.shadow
  }));
   console.log(tile);
});

room.shuffledCorners?.forEach(corner => {
  ws.send(JSON.stringify({
    type: "sendctiles",
    index: corner.index,
    propname: corner.name,
    propimg: corner.img,
    propimgshadow: corner.shadow
  }));
});

room.players.forEach(p => {
  ws.send(JSON.stringify({
    type: "sendplayers",
    plyrid: p.plyrid,
    username: p.username,
    color: p.color || "#ffffff"
  }));
});

console.log(`✅ Sent tile, corner, and player info to ${player.username} (plyrid=${plyrid})`);
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

  [
    { dict: publicLobbies, isPublic: true },
    { dict: privateLobbies, isPublic: false }
  ].forEach(({ dict, isPublic }) => {
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

        break;
      }
    }
  });
});
}) ;
