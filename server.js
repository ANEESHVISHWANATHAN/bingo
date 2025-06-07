const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(__dirname));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, 'profile.html')));
app.get('/prelobby', (req, res) => res.sendFile(path.join(__dirname, 'prelobby.html')));
app.get('/lobby', (req, res) => res.sendFile(path.join(__dirname, 'lobby.html')));

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
    } catch {
      console.log('Invalid JSON received');
      return;
    }

    // HOST CREATES LOBBY
    if (msg.type === 'createlobby') {
      const roomid = generateUniqueRoomId();
      const wscode = generateUniqueWsCode();

      lobbies[roomid] = {
        hostws: ws,
        players: [{
          plyrid: 0,
          username: msg.username,
          icon: msg.icon,
          ws,
          wscode,
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

      // Send self info via userjoin to render own card
      ws.send(JSON.stringify({
        type: 'userjoin',
        users: [{
          plyrid: 0,
          username: msg.username,
          icon: msg.icon
        }]
      }));
    }

    // PLAYER ENTERS LOBBY PAGE
    else if (msg.type === 'page_entered') {
      const { roomid, plyrid, wscode } = msg;
      console.log(`page_entered: roomid=${roomid}, plyrid=${plyrid}, wscode=${wscode}`);

      if (!lobbies[roomid]) return ws.send(JSON.stringify({ type: 'roomerr' }));
      const player = lobbies[roomid].players.find(p => p.plyrid === plyrid);
      if (!player) return ws.send(JSON.stringify({ type: 'plyrerror' }));
      if (player.wscode !== wscode) return ws.send(JSON.stringify({ type: 'wserror' }));

      player.ws = ws;
      player.wsindex++;
      if (plyrid === 0) lobbies[roomid].hostws = ws;

      console.log(`✅ WS Updated: Player ${plyrid}, username=${player.username}, new wsindex=${player.wsindex}`);
      ws.send(JSON.stringify({ type: 'wssuccess' }));

      // Now that new player's ws is updated, notify others about them
      const others = lobbies[roomid].players.filter(p => p.plyrid !== plyrid && p.ws.readyState === WebSocket.OPEN);
      for (const p of others) {
        p.ws.send(JSON.stringify({
          type: 'someuserjoin',
          username: player.username,
          icon: player.icon,
          plyrid
        }));
      }

      // Send full list (including self) to this user
      const allUsers = lobbies[roomid].players.map(p => ({
        plyrid: p.plyrid,
        username: p.username,
        icon: p.icon
      }));

      ws.send(JSON.stringify({
        type: 'userjoin',
        users: allUsers
      }));
    }

    // PLAYER JOINS EXISTING LOBBY
    else if (msg.type === 'joinlobby') {
      const { username, icon, roomid, game } = msg;
      console.log(`joinlobby: user=${username}, room=${roomid}, game=${game}`);

      const lobby = lobbies[roomid];
      if (!lobby) return ws.send(JSON.stringify({ type: 'roomnot' }));
      if (lobby.hostws.readyState !== WebSocket.OPEN) return ws.send(JSON.stringify({ type: 'nohostin' }));
      if (lobby.players[0].game !== game) return ws.send(JSON.stringify({ type: 'gameniotsamew' }));
      if (lobby.players.length >= 8) return ws.send(JSON.stringify({ type: 'gamefull' }));

      const allSameIndex = lobby.players.every(p => p.wsindex === lobby.players[0].wsindex);
      if (!allSameIndex) {
        console.log(`WS index mismatch – waiting.`);
        return;
      }

      const plyrid = lobby.players.length;
      const wscode = generateUniqueWsCode();
      const wsindex = 0;

      const newPlayer = {
        plyrid,
        username,
        icon,
        ws,
        wscode,
        wsindex,
        host: false,
        game,
        rounds: lobby.players[0].rounds
      };

      lobby.players.push(newPlayer);
      console.log(`🎉 Player joined: ${username}, plyrid=${plyrid}, room=${roomid}`);

      // Send confirmation to new user
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
