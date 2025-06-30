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
  } while (Object.values(lobbies).some(l => l.players.some(p => p.wscode === code)));
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
    console.log('Received message:', message);
    let msg;
    try { msg = JSON.parse(message); } catch {
      console.log('Invalid JSON format');
      return;
    }
    console.log('Parsed message:', msg);

    if (msg.type === 'createlobby') {
      console.log('Creating lobby...');
      const roomid = generateUniqueRoomId();
      const wscode = generateUniqueWsCode();
      lobbies[roomid] = {
        hostws: ws,
        players: [{ plyrid: 0, username: msg.username, icon: msg.icon, ws, wscode, wsindex: 0, host: true, game: msg.game, rounds: msg.round }]
      };
      console.log(`Lobby ${roomid} created by ${msg.username}`);
      ws.send(JSON.stringify({ type: 'lobbycreated', plyrid: 0, roomid, wscode }));
      ws.send(JSON.stringify({ type: 'userjoin', users: [{ plyrid: 0, username: msg.username, icon: msg.icon }] }));
      return;
    }

    if (msg.type === 'joinlobby') {
      console.log('Join lobby request:', msg);
      const { username, icon, roomid, game } = msg;
      const lobby = lobbies[roomid];
      if (!lobby) return ws.send(JSON.stringify({ type: 'roomnot' }));
      if (lobby.hostws.readyState !== WebSocket.OPEN) return ws.send(JSON.stringify({ type: 'nohostin' }));
      if (lobby.players[0].game !== game) return ws.send(JSON.stringify({ type: 'gameniotsamew' }));
      if (lobby.players.length >= 8) return ws.send(JSON.stringify({ type: 'gamefull' }));
      const firstIndex = lobby.players[0].wsindex;
      if (lobby.players.some(p => p.wsindex !== firstIndex)) return;
      const plyrid = lobby.players.length;
      const wscode = generateUniqueWsCode();
      const newPlayer = { plyrid, username, icon, ws, wscode, wsindex: 0, host: false, game, rounds: lobby.players[0].rounds };
      if (lobby.players[0].voice) newPlayer.voice = true;
      lobby.players.push(newPlayer);
      console.log(`Player ${username} joined lobby ${roomid}`);
      ws.send(JSON.stringify({ type: 'lobbyjoined', plyrid, wscode, round: newPlayer.rounds }));
      return;
    }

    if (msg.type === 'startgame') {
      console.log('Start game request');
      for (const roomid in lobbies) {
        const lobby = lobbies[roomid];
        if (lobby.hostws === ws) {
          console.log(`Game starting in room ${roomid}`);
          lobby.players.forEach(p => p.ws.send(JSON.stringify({ type: 'gamestarts' })));
        }
      }
      return;
    }

    if (msg.type === 'voiceenable') {
      console.log(`Voice enable requested in room ${msg.roomid}`);
      const lobby = lobbies[msg.roomid];
      if (!lobby) return;
      lobby.players.forEach(p => p.voice = true);
      return;
    }

    if (msg.type === 'voicedisable') {
      console.log(`Voice disable requested in room ${msg.roomid}`);
      const lobby = lobbies[msg.roomid];
      if (!lobby) return;
      lobby.players.forEach(p => delete p.voice);
      return;
    }

    if (msg.type === 'voiceaccess') {
      console.log('Voice access from', msg.plyrid);
      const lobby = lobbies[msg.roomid];
      if (!lobby) return;
      if (!lobby.voiceaccessResponses) lobby.voiceaccessResponses = {};
      lobby.voiceaccessResponses[msg.plyrid] = msg.allow;
      const total = lobby.players.length;
      const answered = Object.keys(lobby.voiceaccessResponses).length;
      console.log(`voiceaccess responses: ${answered}/${total}`);
      if (answered === total) {
        lobby.voiceAllowedArray = Object.entries(lobby.voiceaccessResponses)
          .filter(([_, v]) => v).map(([id]) => Number(id));
        console.log('All responded. Allowed:', lobby.voiceAllowedArray);
        const allowedPlayers = lobby.players.filter(p => lobby.voiceAllowedArray.includes(p.plyrid));
lobby.players.forEach(p => {
  if (p.ws.readyState === WebSocket.OPEN) {
    p.ws.send(JSON.stringify({
      type: 'voiceaccessready',
      allowed: allowedPlayers.map(ap => ({
        plyrid: ap.plyrid,
        username: ap.username,
        icon: ap.icon,
        color: ap.color || '#fff',
        voice: true
      }))
    }));
  }
});
      }
      return;
    }

    if (msg.type === 'voiceaccessjoin') {
      console.log('Late join voice allow:', msg.plyrid);
      const lobby = lobbies[msg.roomid];
      if (!lobby || !lobby.voiceAllowedArray) return;
      if (!lobby.voiceAllowedArray.includes(msg.plyrid)) {
        lobby.voiceAllowedArray.push(msg.plyrid);
        lobby.players.forEach(p => {
          if (p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(JSON.stringify({ type: 'voiceaccessjoin', plyrid: msg.plyrid }));
          }
        });
      }
      return;
    }

    if (msg.type === 'page_entered') {
      console.log('Page entered:', msg);
      const { roomid, plyrid, wscode, game } = msg;
      const lobby = lobbies[roomid];
      if (!lobby) return ws.send(JSON.stringify({ type: 'roomerr' }));
      const player = lobby.players.find(p => p.plyrid === Number(plyrid));
      if (!player) return ws.send(JSON.stringify({ type: 'plyrerror' }));
      if (player.wscode !== wscode) return ws.send(JSON.stringify({ type: 'wserror' }));
      console.log(`Player ${player.username} validated`);
      clearTimeout(player._disconnectTimeout);
      delete player._disconnectTimeout;
      player.ws = ws;
      player.wsindex++;
      if (player.plyrid === 0) lobby.hostws = ws;
      ws.send(JSON.stringify({ type: 'wssuccess' }));
      lobby.players.forEach(p => {
        if (p.plyrid !== player.plyrid && p.ws.readyState === WebSocket.OPEN) {
          p.ws.send(JSON.stringify({ type: 'someuserjoin', username: player.username, icon: player.icon, plyrid: player.plyrid }));
        }
      });
      ws.send(JSON.stringify({ type: 'userjoin', users: lobby.players.map(p => ({ plyrid: p.plyrid, username: p.username, icon: p.icon })) }));

      const currentIndex = player.wsindex;
      const allSame = lobby.players.every(p => p.wsindex === currentIndex);
      if (allSame && game === 'monopoly') {
        if (!lobby.topbarSentFor || lobby.topbarSentFor !== currentIndex) {
          lobby.topbarSentFor = currentIndex;
          console.log(`All players at wsindex ${currentIndex}, sending topbar...`);
          const colors = ['#e6194b','#3cb44b','#ffe119','#4363d8','#f58231','#911eb4','#46f0f0','#f032e6'];
          const reserves = [...colors];
          shuffleArray(reserves);
          const voicearray = lobby.players.map((p,i) => ({
            username: p.username, icon: p.icon, plyrid: p.plyrid,
            color: reserves[i], voice: p.voice || false
          }));
          shuffleArray(voicearray);
          if (voicearray.length) voicearray[0].start = true;
          console.log('Sending topbar voice array:', voicearray);
          lobby.players.forEach(p => {
            if (p.ws.readyState === WebSocket.OPEN) {
              p.ws.send(JSON.stringify({ type: 'topbar', data: voicearray }));
            }
          });
        }
      }

      const allAtTambola = lobby.players.every(p => p.wsindex === 2);
      if (allAtTambola && !lobby.shuffrang) {
        console.log('All players at tambola. Starting number generation and ticket dispatch.');
        lobby.shuffrang = Array.from({ length: 100 }, (_, i) => i);
        shuffleArray(lobby.shuffrang);
        lobby.numberIndex = 0;
        const tickets = [];
        while (tickets.length < lobby.players.length) {
          const t = generateTicket();
          if (tickets.every(old => !hasMoreThan3Common(old, t))) tickets.push(t);
        }
        lobby.tickets = {};
        tickets.forEach((tk, idx) => {
          lobby.tickets[idx] = tk;
          const p = lobby.players[idx];
          if (p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(JSON.stringify({ type: 'ticketsend', ticket: tk }));
          }
        });
        lobby.ffarr = []; lobby.fsarr = []; lobby.frarr = [];
        lobby.srarr = []; lobby.trarr = []; lobby.fgarr = [];
        lobby.numberInterval = setInterval(() => {
          if (lobby.numberIndex < lobby.shuffrang.length) {
            const number = lobby.shuffrang[lobby.numberIndex++];
            console.log('Calling number:', number);
            lobby.players.forEach(p => {
              if (p.ws.readyState === WebSocket.OPEN) {
                p.ws.send(JSON.stringify({ type: 'numbercalled', number }));
              }
            });
          } else {
            clearInterval(lobby.numberInterval);
          }
        }, 5000);
      }

      const allAtStandings = lobby.players.every(p => p.wsindex === 3);
      if (allAtStandings && lobby.totalpoints) {
        console.log('All players at standings page. Sending standings.');
        lobby.players.forEach(p => {
          if (p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(JSON.stringify({ type: 'standingdone', standings: lobby.totalpoints }));
          }
        });
      }
      return;
    }

    if (['offer','answer','icecandidate'].includes(msg.type)) {
      const lobby = lobbies[msg.roomid];
      if (!lobby || !lobby.voiceAllowedArray) return;
      if (
        lobby.voiceAllowedArray.includes(msg.plyrid) &&
        lobby.voiceAllowedArray.includes(msg.target)
      ) {
        const dest = findPlayerById(msg.target);
        if (dest && dest.ws.readyState === WebSocket.OPEN) {
          const out = { type: msg.type, plyrid: msg.plyrid };
          if (msg.type === 'offer') out.offer = msg.offer;
          if (msg.type === 'answer') out.answer = msg.answer;
          if (msg.type === 'icecandidate') out.candidate = msg.candidate;
          dest.ws.send(JSON.stringify(out));
        }
      } else {
        console.log('Blocked webrtc msg', msg.type, msg.plyrid, msg.target);
      }
      return;
    }

    if (msg.type === 'exitgame') {
      console.log('Exit game request:', msg);
      const lobby = lobbies[msg.roomid];
      if (!lobby) return;
      lobby.players = lobby.players.filter(p => p.plyrid !== msg.plyrid);
      if (!lobby.players.length) delete lobbies[msg.roomid];
    }

    // NEW: CHAT MESSAGE HANDLER
    if (msg.type === 'sendmess') {
      console.log(`Chat message from ${msg.plyrid} in room ${msg.roomid}:`, msg.textmessage);
      const lobby = lobbies[msg.roomid];
      if (!lobby) {
        console.log('Invalid room for chat');
        return;
      }
      const player = lobby.players.find(p => p.plyrid === msg.plyrid);
      if (!player) {
        console.log('Invalid player for chat');
        return;
      }

      lobby.players.forEach(p => {
        if (p.plyrid !== msg.plyrid && p.ws.readyState === WebSocket.OPEN) {
          p.ws.send(JSON.stringify({
            type: 'messreceive',
            plyrid: msg.plyrid,
            username: msg.username,
            icon: msg.icon,
            textmessage: msg.textmessage
          }));
        }
      });
    }
    
  });

  ws.on('close', () => {
    console.log('WebSocket closed');
    for (const roomid in lobbies) {
      const lobby = lobbies[roomid];
      const idx = lobby.players.findIndex(p => p.ws === ws);
      if (idx >= 0) {
        const pname = lobby.players[idx].username;
        console.log(`Player ${pname} disconnected`);
        lobby.players[idx]._disconnectTimeout = setTimeout(() => {
          console.log(`Removing player ${pname} after timeout`);
          lobby.players.splice(idx, 1);
          lobby.players.forEach((p, i) => (p.plyrid = i));
          lobby.players.forEach(p => {
            if (p.ws.readyState === WebSocket.OPEN) {
              p.ws.send(JSON.stringify({ type: 'someuserleft', plyrid: idx }));
            }
          });
          if (lobby.players.length === 0) {
            console.log(`Lobby ${roomid} deleted`);
            delete lobbies[roomid];
          }
        }, 10000);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));