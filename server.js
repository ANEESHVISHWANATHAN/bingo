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
    console.log('Received message:', message);
    let msg;
    try {
      msg = JSON.parse(message);
    } catch {
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
        players: [{
          plyrid: 0, username: msg.username, icon: msg.icon,
          ws, wscode, wsindex: 0, host: true, game: msg.game, rounds: msg.round
        }]
      };

      console.log(`Lobby ${roomid} created by ${msg.username}`);
      ws.send(JSON.stringify({ type: 'lobbycreated', plyrid: 0, roomid, wscode }));
      ws.send(JSON.stringify({ type: 'userjoin', users: [{ plyrid: 0, username: msg.username, icon: msg.icon }] }));
    }

    else if (msg.type === 'voiceenable') {
      console.log(`Voice enable requested in room ${msg.roomid}`);
      const lobby = lobbies[msg.roomid];
      if (!lobby) return;
      for (const player of lobby.players) player.voice = true;
      console.log('Voice enabled for all players in lobby.');
    }

    else if (msg.type === 'voicedisable') {
      console.log(`Voice disable requested in room ${msg.roomid}`);
      const lobby = lobbies[msg.roomid];
      if (!lobby) return;
      for (const player of lobby.players) delete player.voice;
      console.log('Voice disabled for all players in lobby.');
    }

    else if (msg.type === 'page_entered') {
      console.log(`Page entered:`, msg);
      const { roomid, plyrid, wscode, game, wsindex } = msg;
      const lobby = lobbies[roomid];
      if (!lobby) return ws.send(JSON.stringify({ type: 'roomerr' }));

      const pid = Number(plyrid);
      const player = lobby.players.find(p => p.plyrid === pid);
      if (!player) return ws.send(JSON.stringify({ type: 'plyrerror' }));
      if (player.wscode !== wscode) return ws.send(JSON.stringify({ type: 'wserror' }));

      console.log(`Player ${player.username} validated`);

      clearTimeout(player._disconnectTimeout);
      delete player._disconnectTimeout;

      player.ws = ws;
      player.wsindex++;

      if (player.plyrid === 0) lobby.hostws = ws;

      ws.send(JSON.stringify({ type: 'wssuccess' }));

      for (const p of lobby.players) {
        if (p.plyrid !== player.plyrid && p.ws.readyState === WebSocket.OPEN) {
          p.ws.send(JSON.stringify({
            type: 'someuserjoin',
            username: player.username,
            icon: player.icon,
            plyrid: player.plyrid
          }));
        }
      }

      ws.send(JSON.stringify({
        type: 'userjoin',
        users: lobby.players.map(p => ({ plyrid: p.plyrid, username: p.username, icon: p.icon }))
      }));

      if (player.wsindex === 2 && game === 'monopoly') {
        console.log(`${player.username} entered Monopoly page.`);

        const colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6'];
        const reserves = [...colors];
        shuffleArray(reserves);

        const voicearray = lobby.players.map((p, i) => ({
          username: p.username,
          icon: p.icon,
          plyrid: p.plyrid,
          color: reserves[i],
          voice: p.voice || false
        }));

        shuffleArray(voicearray);
        if (voicearray.length > 0) voicearray[0].start = true;

        console.log('Sending topbar voice array:', voicearray);

        for (const p of lobby.players) {
          if (p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(JSON.stringify({ type: 'topbar', data: voicearray }));
          }
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
        tickets.forEach((ticket, idx) => {
          lobby.tickets[idx] = ticket;
          const player = lobby.players[idx];
          if (player.ws.readyState === WebSocket.OPEN) {
            player.ws.send(JSON.stringify({ type: 'ticketsend', ticket }));
          }
        });

        lobby.ffarr = []; lobby.fsarr = []; lobby.frarr = [];
        lobby.srarr = []; lobby.trarr = []; lobby.fgarr = [];

        lobby.numberInterval = setInterval(() => {
          if (lobby.numberIndex < lobby.shuffrang.length) {
            const number = lobby.shuffrang[lobby.numberIndex++];
            console.log('Calling number:', number);
            for (const p of lobby.players) {
              if (p.ws.readyState === WebSocket.OPEN) {
                p.ws.send(JSON.stringify({ type: 'numbercalled', number }));
              }
            }
          } else {
            clearInterval(lobby.numberInterval);
          }
        }, 5000);
      }

      const allAtStandings = lobby.players.every(p => p.wsindex === 3);
      if (allAtStandings && lobby.totalpoints) {
        console.log('All players at standings page. Sending standings.');
        for (const player of lobby.players) {
          player.ws.send(JSON.stringify({ type: 'standingdone', standings: lobby.totalpoints }));
        }
      }
    }

    else if (msg.type === 'joinlobby') {
      console.log('Join lobby request:', msg);
      const { username, icon, roomid, game } = msg;
      const lobby = lobbies[roomid];
      if (!lobby) return ws.send(JSON.stringify({ type: 'roomnot' }));
      if (lobby.hostws.readyState !== WebSocket.OPEN) return ws.send(JSON.stringify({ type: 'nohostin' }));
      if (lobby.players[0].game !== game) return ws.send(JSON.stringify({ type: 'gameniotsamew' }));
      if (lobby.players.length >= 8) return ws.send(JSON.stringify({ type: 'gamefull' }));

      const allSameIndex = lobby.players.every(p => p.wsindex === lobby.players[0].wsindex);
      if (!allSameIndex) return;

      const plyrid = lobby.players.length;
      const wscode = generateUniqueWsCode();

      const newPlayer = {
        plyrid, username, icon, ws, wscode, wsindex: 0,
        host: false, game, rounds: lobby.players[0].rounds
      };

      if (lobby.players[0].voice) newPlayer.voice = true;

      lobby.players.push(newPlayer);
      console.log(`Player ${username} joined lobby ${roomid}`);
      ws.send(JSON.stringify({ type: 'lobbyjoined', plyrid, wscode, round: newPlayer.rounds }));
    }

    else if (msg.type === 'startgame') {
      console.log('Start game request');
      for (const player of Object.values(lobbies).flatMap(l => l.players)) {
        if (player.host && player.ws === ws && player.ws.readyState === WebSocket.OPEN) {
          const roomid = Object.keys(lobbies).find(k => lobbies[k].hostws === ws);
          if (roomid) {
            const lobby = lobbies[roomid];
            console.log(`Game starting in room ${roomid}`);
            for (const p of lobby.players) {
              p.ws.send(JSON.stringify({ type: 'gamestarts' }));
            }
          }
        }
      }
    }

    else if (msg.type === 'varclaim') {
      console.log('Claim message:', msg);
      const { var: stage, plyrid, roomid, icon, username } = msg;
      const lobby = lobbies[roomid];
      if (!lobby) return;
      const player = lobby.players.find(p => p.plyrid === plyrid);
      if (!player) return;

      const arrname = `${stage}arr`;
      if (!lobby[arrname]) lobby[arrname] = [];

      const alreadyClaimed = lobby[arrname].some(e => e.plyrid === plyrid);
      if (alreadyClaimed) return;

      const arrid = lobby[arrname].length;
      const points = lobby.players.length - arrid;

      const entry = { arrid, username, icon, plyrid, points };
      lobby[arrname].push(entry);

      const msgType = arrid === 0 ? 'varfirstdone' : 'varothersdone';
      console.log(`${stage.toUpperCase()} claim by ${username}, points: ${points}`);

      for (const p of lobby.players) {
        if (p.ws.readyState === WebSocket.OPEN) {
          p.ws.send(JSON.stringify({
            type: msgType, var: stage, username, icon, plyrid, points, ...(msgType === 'varothersdone' ? { arrid } : {})
          }));
        }
      }

      if (stage === 'fg' && lobby.fgarr && lobby.fgarr.length === lobby.players.length) {
        const total = [];
        for (const p of lobby.players) {
          let pts = 0;
          ['ffarr', 'fsarr', 'frarr', 'srarr', 'trarr', 'fgarr'].forEach(arr => {
            const found = lobby[arr]?.find(e => e.plyrid === p.plyrid);
            if (found) pts += found.points;
          });
          total.push({ arrid: Date.now() + '_' + p.plyrid, plyrid: p.plyrid, icon: p.icon, username: p.username, totalpoints: pts });
        }
        lobby.totalpoints = total;
        for (const p of lobby.players) {
          if (p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(JSON.stringify({ type: 'tambdone' }));
          }
        }
      }
    }

    else if (msg.type === 'exitgame') {
      console.log('Exit game request:', msg);
      const { roomid, plyrid } = msg;
      const lobby = lobbies[roomid];
      if (!lobby) return;
      lobby.players = lobby.players.filter(p => p.plyrid !== plyrid);
      if (lobby.players.length === 0) delete lobbies[roomid];
    }
  });
    else if (msg.type === 'offer') {
      const targetPlayer = findPlayerById(msg.target);
      if (targetPlayer?.ws) {
       targetPlayer.ws.send(JSON.stringify({
        type: 'offer',
        plyrid: msg.plyrid,
        offer: msg.offer
        } ));
      }
    }
   else if (msg.type === 'answer') {
     const targetPlayer = findPlayerById(msg.target);
     if (targetPlayer?.ws) {
      targetPlayer.ws.send(JSON.stringify({
       type: 'answer',
       plyrid: msg.plyrid,
       answer: msg.answer
       }));
      }
     }
   else if (msg.type === 'icecandidate') {
     const targetPlayer = findPlayerById(msg.target);
     if (targetPlayer?.ws) {
      targetPlayer.ws.send(JSON.stringify({
       type: 'icecandidate',
       plyrid: msg.plyrid,
       candidate: msg.candidate
        }));
      }
    }

  ws.on('close', () => {
    console.log('WebSocket closed');
    for (const [roomid, lobby] of Object.entries(lobbies)) {
      for (const player of lobby.players) {
        if (player.ws === ws) {
          console.log(`Player ${player.username} disconnected`);
          const plyrid = player.plyrid;
          player._disconnectTimeout = setTimeout(() => {
            console.log(`Removing player ${player.username} after timeout`);
            lobby.players.splice(plyrid, 1);
            for (let i = plyrid; i < lobby.players.length; i++) {
              lobby.players[i].plyrid--;
            }
            for (const p of lobby.players) {
              if (p.ws.readyState === WebSocket.OPEN) {
                p.ws.send(JSON.stringify({ type: 'someuserleft', plyrid }));
              }
            }
            if (lobby.players.length === 0) {
              console.log(`Lobby ${roomid} deleted`);
              delete lobbies[roomid];
            }
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
