import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import socketio from 'socket.io';
import http from 'http'; // https
// import throttle from 'lodash.throttle';
// import debounce from 'lodash.debounce';
import mockWiki from './mockWiki';

import * as UserController from './controllers/user_controller';
import * as LocationController from './controllers/location_controller';


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


// connection server
io.on('connection', (socket) => {
  // startup information
  UserController.getUsers(null, (users) => {
    socket.emit('players', users);
  });

  LocationController.getLocations(null, (locations) => {
    socket.emit('locations', locations);
  });

  socket.on('getPlayer', (username, callback) => {
    console.log(`username in socket is ${username}`);
    UserController.getUser(username, (result) => {
      callback(result);
    });
  });

  // emits to every socket
  const pushPlayers = () => {
    UserController.getUsers(null, (users) => {
      io.sockets.emit('players', users);
    });
  };

  // const pushLocationsByURL = (url) => {
  //   LocationController.getLocationsByURL(url, (locations) => {
  //     io.sockets.emit('locations', locations);
  //   });
  // };

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

  // UPDATED USER -- working on
  socket.on('updatePlayer', (username, fields) => {
    UserController.updateUser(username, fields, (result) => {
      pushPlayers();
      // if (result.curLocation) {
      //   console.log(result.curLocation);
      //   pushLocationsByURL(result.curLocation);
      // }
    });
  });

  socket.on('gameOver', (username) => {
    UserController.removeUserFromGame(username, (result) => {
      pushPlayers();
    });
  });
  // end
});
