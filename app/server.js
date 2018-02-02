import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import socketio from 'socket.io';
import http from 'http';

import setupLobby from './lobbyServer';
import * as UserController from './controllers/userController';
import * as GameController from './controllers/gameController';
import mockWiki from './mockWiki';

// initialize
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/webadventure';
mongoose.connect(mongoURI, {
  useMongoClient: true,
});
mongoose.Promise = global.Promise;

// enable/disable cross origin resource sharing if necessary
app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static('static'));
// enables static assets from folder static
app.set('views', path.join(__dirname, '../app/views'));
// this just allows us to render ejs from the ../app/views directory

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// default index route
app.get('/', (req, res) => {
  res.send(mockWiki);
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
server.listen(port);

console.log(`listening on: ${port}`);

setupLobby(io);

// connection server
io.on('connection', (socket) => {
  // startup information
  UserController.getUsers(null, (users) => {
    socket.emit('players', users);
  });

  GameController.getGames(null, (games) => {
    socket.emit('games', games);
  });

  // emits to every socket
  const pushPlayers = () => {
    UserController.getUsers(null, (users) => {
      io.sockets.emit('players', users);
    });
  };

  const pushGames = () => {
    GameController.getGames(null, (games) => {
      socket.emit('games', games);
    });
  };

  // const pushLocationsByURL = (url) => {
  //   LocationController.getLocationsByURL(url, (locations) => {
  //     io.sockets.emit('locations', locations);
  //   });
  // };

  // READ USER (singular) -- done
  socket.on('getPlayer', (username, callback) => {
    console.log(`username in socket is ${username}`);
    UserController.getUser(username, (result) => {
      callback(result);
    });
  });

  // READ USER (multiple) -- done
  socket.on('getPlayers', (callback) => {
    UserController.getUsers(null, callback);
  });

  // CREATE USER -- done
  socket.on('signup', (username, callback) => {
    UserController.signup(username, (result) => {
      callback(result);
      pushPlayers();
    });
  });

  // UPDATE USER -- working on
  socket.on('updatePlayer', (username, fields, callback) => {
    UserController.updateUser(username, fields, (result) => {
      callback(result);
      pushPlayers();
      // if (result.curLocation) {
      //   console.log(result.curLocation);
      //   pushLocationsByURL(result.curLocation);
      // }
    });
  });

  socket.on('createGame', (username, endpoints, callback) => {
    console.log(`game created with user${username}`);
    GameController.createGame(username, endpoints, (result) => {
      // pushGames();
      callback(result);
      pushGames();
    });
  });

  // Untested
  socket.on('activateGame', (id, callback) => {
    GameController.activateGame(id, (result) => {
      callback(result);
      pushGames();
    });
  });

  socket.on('deactivateGame', (id, callback) => {
    GameController.deactivateGame(id, (result) => {
      callback(result);
      pushGames();
    });
  });

  socket.on('gameOver', (username) => {
    UserController.removeUserFromGame(username, (result) => {
      pushPlayers();
    });
  });
  // end
});
