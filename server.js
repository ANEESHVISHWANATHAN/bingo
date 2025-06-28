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
app.get('/tambola', (req, res) => res.sendFile(path.join(__dirname, 'tambola.html')));
app.get('/tambolastandings', (req, res) => res.sendFile(path.join(__dirname, 'tambolastandings.html')));
app.get('/monopoly', (req, res) => res.sendFile(path.join(__dirname, 'monopoly.html')));

const lobbies = {};
const pendingDisconnects = new Map();

function generateUniqueRoomId() {
  let id;
  do id = Math.random().toString(36).substring(2, 7);
  while (lobbies[id]);
  return id;
}

function generateUniqueWsCode() {
  let code;
  do {
    code = Math.random().toString(36).substring(2, 10);
  } while (Object.values(lobbies).some(lobby => lobby.players.some(p => p.wscode === code)));
  return code;
}
function findPlayerById(plyrid) {
  plyrid = Number(plyrid);
  for (const lobby of Object.values(lobbies)) {
    for (const player of lobby.players) {
      if (player.plyrid === plyrid) return player;
    }
  }
  return null;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function generateTicket() {
  let numbers = [];
  while (numbers.length < 15) {
    const num = Math.floor(Math.random() * 100);
    if (!numbers.includes(num)) numbers.push(num);
  }
  return numbers;
}

function hasMoreThan3Common(arr1, arr2) {
  return arr1.filter(n => arr2.includes(n)).length > 3;
}

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established.');

  ws.on('message', (message) => {
    let msg;
    try {
      msg = JSON.parse(message);
    } catch {
      return;
    }

    if (msg.type === 'createlobby') {
      const roomid = generateUniqueRoomId();
      const wscode = generateUniqueWsCode();
      lobbies[roomid] = {
        hostws: ws,
        players: [{
          plyrid: 0, username: msg.username, icon: msg.icon,
          ws, wscode, wsindex: 0, host: true, game: msg.game, rounds: msg.round
        }]
      };
      ws.send(JSON.stringify({ type: 'lobbycreated', plyrid: 0, roomid, wscode }));
      ws.send(JSON.stringify({ type: 'userjoin', users: [{ plyrid: 0, username: msg.username, icon: msg.icon }] }));
    }

    else if (msg.type === 'voiceenable') {
      const lobby = lobbies[msg.roomid];
      if (!lobby) return;
      for (const player of lobby.players) player.voice = true;
    }

    else if (msg.type === 'voicedisable') {
      const lobby = lobbies[msg.roomid];
      if (!lobby) return;
      for (const player of lobby.players) delete player.voice;
    }

    else if (msg.type === 'voiceaccess') {
      const { roomid, plyrid, allow } = msg;
      const lobby = lobbies[roomid];
      if (!lobby) return;
      if (!lobby.voiceaccessResponses) lobby.voiceaccessResponses = {};
      lobby.voiceaccessResponses[plyrid] = allow;

      const totalPlayers = lobby.players.length;
      const responded = Object.keys(lobby.voiceaccessResponses).length;

      if (responded === totalPlayers) {
        const allowedPlyrids = Object.entries(lobby.voiceaccessResponses)
          .filter(([_, val]) => val)
          .map(([pid]) => Number(pid));
        lobby.voiceAllowedArray = allowedPlyrids;

        for (const p of lobby.players) {
          if (p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(JSON.stringify({ type: 'voiceaccessready', allowed: allowedPlyrids }));
          }
        }
      }
    }

    else if (msg.type === 'voiceaccessjoin') {
      const { roomid, plyrid } = msg;
      const lobby = lobbies[roomid];
      if (!lobby || !lobby.voiceAllowedArray) return;
      if (!lobby.voiceAllowedArray.includes(plyrid)) {
        lobby.voiceAllowedArray.push(plyrid);
        for (const p of lobby.players) {
          if (p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(JSON.stringify({ type: 'voiceaccessjoin', plyrid }));
          }
        }
      }
    }

    else if (msg.type === 'page_entered') {
      const { roomid, plyrid, wscode, game, wsindex } = msg;
      const lobby = lobbies[roomid];
      if (!lobby) return ws.send(JSON.stringify({ type: 'roomerr' }));
      const pid = Number(plyrid);
      const player = lobby.players.find(p => p.plyrid === pid);
      if (!player || player.wscode !== wscode) return ws.send(JSON.stringify({ type: 'wserror' }));

      clearTimeout(player._disconnectTimeout);
      delete player._disconnectTimeout;

      player.ws = ws;
      player.wsindex++;
      if (player.plyrid === 0) lobby.hostws = ws;

      ws.send(JSON.stringify({ type: 'wssuccess' }));
      for (const p of lobby.players) {
        if (p.plyrid !== player.plyrid && p.ws.readyState === WebSocket.OPEN) {
          p.ws.send(JSON.stringify({ type: 'someuserjoin', username: player.username, icon: player.icon, plyrid: player.plyrid }));
        }
      }

      ws.send(JSON.stringify({
        type: 'userjoin',
        users: lobby.players.map(p => ({ plyrid: p.plyrid, username: p.username, icon: p.icon }))
      }));

      const currentIndex = player.wsindex;
      const allSameIndex = lobby.players.every(p => p.wsindex === currentIndex);

      if (allSameIndex && game === 'monopoly') {
        if (!lobby.topbarSentFor || lobby.topbarSentFor !== currentIndex) {
          lobby.topbarSentFor = currentIndex;
          const colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6'];
          const reserves = [...colors];
          shuffleArray(reserves);
          const voicearray = lobby.players.map((p, i) => ({
            username: p.username, icon: p.icon, plyrid: p.plyrid, color: reserves[i], voice: p.voice || false
          }));
          shuffleArray(voicearray);
          if (voicearray.length > 0) voicearray[0].start = true;

          for (const p of lobby.players) {
            if (p.ws.readyState === WebSocket.OPEN) {
              p.ws.send(JSON.stringify({ type: 'topbar', data: voicearray }));
            }
          }
        }
      }
    }

    else if (msg.type === 'joinlobby') {
      const { username, icon, roomid, game } = msg;
      const lobby = lobbies[roomid];
      if (!lobby || lobby.players[0].game !== game || lobby.players.length >= 8) return;
      const allSameIndex = lobby.players.every(p => p.wsindex === lobby.players[0].wsindex);
      if (!allSameIndex) return;

      const plyrid = lobby.players.length;
      const wscode = generateUniqueWsCode();
      const newPlayer = { plyrid, username, icon, ws, wscode, wsindex: 0, host: false, game, rounds: lobby.players[0].rounds };
      if (lobby.players[0].voice) newPlayer.voice = true;
      lobby.players.push(newPlayer);
      ws.send(JSON.stringify({ type: 'lobbyjoined', plyrid, wscode, round: newPlayer.rounds }));
    }

    else if (msg.type === 'startgame') {
      for (const player of Object.values(lobbies).flatMap(l => l.players)) {
        if (player.host && player.ws === ws && player.ws.readyState === WebSocket.OPEN) {
          const roomid = Object.keys(lobbies).find(k => lobbies[k].hostws === ws);
          if (roomid) {
            const lobby = lobbies[roomid];
            for (const p of lobby.players) {
              p.ws.send(JSON.stringify({ type: 'gamestarts' }));
            }
          }
        }
      }
    }

    else if (['offer', 'answer', 'icecandidate'].includes(msg.type)) {
      const { roomid, target, plyrid } = msg;
      const lobby = lobbies[roomid];
      if (!lobby || !lobby.voiceAllowedArray) return;
      if (!lobby.voiceAllowedArray.includes(plyrid) || !lobby.voiceAllowedArray.includes(target)) return;
      const targetPlayer = findPlayerById(target);
      if (targetPlayer?.ws) {
        targetPlayer.ws.send(JSON.stringify({
          type: msg.type,
          plyrid,
          [msg.type === 'icecandidate' ? 'candidate' : msg.type]: msg[msg.type]
        }));
      }
    }

    else if (msg.type === 'exitgame') {
      const { roomid, plyrid } = msg;
      const lobby = lobbies[roomid];
      if (!lobby) return;
      lobby.players = lobby.players.filter(p => p.plyrid !== plyrid);
      if (lobby.players.length === 0) delete lobbies[roomid];
    }
  });

  ws.on('close', () => {
    for (const [roomid, lobby] of Object.entries(lobbies)) {
      for (const player of lobby.players) {
        if (player.ws === ws) {
          const plyrid = player.plyrid;
          player._disconnectTimeout = setTimeout(() => {
            lobby.players.splice(plyrid, 1);
            for (let i = plyrid; i < lobby.players.length; i++) {
              lobby.players[i].plyrid--;
            }
            for (const p of lobby.players) {
              if (p.ws.readyState === WebSocket.OPEN) {
                p.ws.send(JSON.stringify({ type: 'someuserleft', plyrid }));
              }
            }
            if (lobby.players.length === 0) delete lobbies[roomid];
          }, 10000);
          break;
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});