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
      console.log('Received invalid JSON message');
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

      console.log(`Lobby created: ${roomid}, Host: ${msg.username}`);
      ws.send(JSON.stringify({ type: 'lobbycreated', plyrid: 0, roomid, wscode }));
      ws.send(JSON.stringify({ type: 'userjoin', users: [{ plyrid: 0, username: msg.username, icon: msg.icon }] }));
    }

    else if (msg.type === 'page_entered') {
      const { roomid, plyrid, wscode } = msg;
      const lobby = lobbies[roomid];
      if (!lobby) {
        console.log(`page_entered error: room ${roomid} not found`);
        return ws.send(JSON.stringify({ type: 'roomerr' }));
      }
      const player = lobby.players.find(p => p.plyrid === plyrid);
      if (!player) {
        console.log(`page_entered error: player ID ${plyrid} not found`);
        return ws.send(JSON.stringify({ type: 'plyrerror' }));
      }
      if (player.wscode !== wscode) {
        console.log(`page_entered error: wscode mismatch for player ${plyrid}`);
        return ws.send(JSON.stringify({ type: 'wserror' }));
      }

      clearTimeout(player._disconnectTimeout);
      delete player._disconnectTimeout;

      player.ws = ws;
      player.wsindex++;

      if (plyrid === 0) lobby.hostws = ws;

      console.log(`Player ${player.username} reconnected to room ${roomid}`);
      ws.send(JSON.stringify({ type: 'wssuccess' }));

      for (const p of lobby.players) {
        if (p.plyrid !== plyrid && p.ws.readyState === WebSocket.OPEN) {
          p.ws.send(JSON.stringify({
            type: 'someuserjoin',
            username: player.username,
            icon: player.icon,
            plyrid
          }));
        }
      }

      ws.send(JSON.stringify({
        type: 'userjoin',
        users: lobby.players.map(p => ({ plyrid: p.plyrid, username: p.username, icon: p.icon }))
      }));

      const allAtTambola = lobby.players.every(p => p.wsindex === 2);
      if (allAtTambola && !lobby.shuffrang) {
        lobby.shuffrang = Array.from({ length: 100 }, (_, i) => i);
        shuffleArray(lobby.shuffrang);

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

        console.log(`Tickets generated and sent to players in room ${roomid}`);

        lobby.ffarr = []; lobby.fsarr = []; lobby.frarr = [];
        lobby.srarr = []; lobby.trarr = []; lobby.fgarr = [];
      }

      const allAtStandings = lobby.players.every(p => p.wsindex === 3);
      if (allAtStandings && lobby.totalpoints) {
        console.log(`All players at standings page in room ${roomid}`);
        for (const player of lobby.players) {
          player.ws.send(JSON.stringify({ type: 'standingdone', standings: lobby.totalpoints }));
        }
      }
    }

    else if (msg.type === 'joinlobby') {
      const { username, icon, roomid, game } = msg;
      const lobby = lobbies[roomid];
      if (!lobby) {
        console.log(`joinlobby failed: room ${roomid} not found`);
        return ws.send(JSON.stringify({ type: 'roomnot' }));
      }
      if (lobby.hostws.readyState !== WebSocket.OPEN) {
        console.log(`joinlobby failed: host not connected in room ${roomid}`);
        return ws.send(JSON.stringify({ type: 'nohostin' }));
      }
      if (lobby.players[0].game !== game) {
        console.log(`joinlobby failed: game mismatch`);
        return ws.send(JSON.stringify({ type: 'gameniotsamew' }));
      }
      if (lobby.players.length >= 8) {
        console.log(`joinlobby failed: game full in room ${roomid}`);
        return ws.send(JSON.stringify({ type: 'gamefull' }));
      }

      const allSameIndex = lobby.players.every(p => p.wsindex === lobby.players[0].wsindex);
      if (!allSameIndex) {
        console.log(`joinlobby denied: wsindex mismatch`);
        return;
      }

      const plyrid = lobby.players.length;
      const wscode = generateUniqueWsCode();
      const wsindex = 0;

      const newPlayer = {
        plyrid, username, icon, ws, wscode, wsindex,
        host: false, game, rounds: lobby.players[0].rounds
      };

      lobby.players.push(newPlayer);
      console.log(`Player ${username} joined room ${roomid} as plyrid ${plyrid}`);
      ws.send(JSON.stringify({ type: 'lobbyjoined', plyrid, wscode, round: newPlayer.rounds }));
    }

    else if (msg.type === 'startgame') {
      const { host, game } = msg;
      for (const player of Object.values(lobbies).flatMap(l => l.players)) {
        if (player.host && player.ws === ws && player.ws.readyState === WebSocket.OPEN) {
          const roomid = Object.keys(lobbies).find(k => lobbies[k].hostws === ws);
          if (roomid) {
            const lobby = lobbies[roomid];
            console.log(`Game started in room ${roomid} by host`);
            for (const p of lobby.players) {
              p.ws.send(JSON.stringify({ type: 'gamestarts' }));
            }
          }
        }
      }
    }

    else if (msg.type === 'varclaim') {
      const { var: stage, plyrid, roomid, timestamp } = msg;
      const lobby = lobbies[roomid];
      if (!lobby) return;

      const player = lobby.players.find(p => p.plyrid === plyrid);
      if (!player) return;

      const entry = {
        arrid: timestamp,
        ass: player.username,
        icon: player.icon,
        plyrid,
        timestamp,
        points: 10
      };

      const arrname = `${stage}arr`;
      if (!lobby[arrname]) lobby[arrname] = [];
      if (!lobby[arrname].some(e => e.plyrid === plyrid)) {
        lobby[arrname].push(entry);
        console.log(`Player ${player.username} claimed ${stage} in room ${roomid}`);
      }

      for (const p of lobby.players) {
        if (p.ws.readyState === WebSocket.OPEN) {
          p.ws.send(JSON.stringify({
            type: 'varupdate',
            var: stage,
            plyrid,
            username: player.username,
            icon: player.icon,
            arrid: timestamp,
            points: entry.points
          }));
        }
      }

      if (stage === 'fg' && lobby.fgarr.length === lobby.players.length) {
        const total = [];
        for (const p of lobby.players) {
          let pts = 0;
          ['ffarr', 'fsarr', 'frarr', 'srarr', 'trarr', 'fgarr'].forEach(arr => {
            const found = lobby[arr].find(e => e.plyrid === p.plyrid);
            if (found) pts += found.points;
          });
          total.push({
            arrid: Date.now() + '_' + p.plyrid,
            plyrid: p.plyrid,
            icon: p.icon,
            username: p.username,
            totalpoints: pts
          });
        }
        lobby.totalpoints = total;
        console.log(`Game finished in room ${roomid}. Final points calculated.`);
      }
    }

    else if (msg.type === 'exitgame') {
      const { roomid, plyrid } = msg;
      const lobby = lobbies[roomid];
      if (!lobby) return;

      lobby.players = lobby.players.filter(p => p.plyrid !== plyrid);
      console.log(`Player ${plyrid} exited room ${roomid}`);
      if (lobby.players.length === 0) {
        delete lobbies[roomid];
        console.log(`Room ${roomid} deleted after all players exited`);
      }
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

            console.log(`Player ${plyrid} removed from room ${roomid} after disconnect timeout`);

            if (lobby.players.length === 0) {
              delete lobbies[roomid];
              console.log(`Room ${roomid} deleted after disconnect`);
            }
          }, 10000);
          console.log(`Player ${plyrid} disconnected from room ${roomid}, waiting 10s for reconnect`);
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
