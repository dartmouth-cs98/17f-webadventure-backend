import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import socketio from 'socket.io';
import http from 'http'; // https
// import throttle from 'lodash.throttle';
// import debounce from 'lodash.debounce';
import apiRouter from './router';

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
  res.send('hi');
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
server.listen(port);

console.log(`listening on: ${port}`);


// connection server
io.on('connection', (socket) => {
  UserController.getUsers(null, (users) => {
    socket.emit('players', users);
  });

  // emits to every socket
  const pushPlayers = () => {
    UserController.getUsers(null, (users) => {
      io.sockets.emit('players', users);
    });
  };

  socket.on('getPlayer', (username, callback) => {
    console.log(`username in socket is ${username}`);
    UserController.getUser(username, (result) => {
      callback(result);
      pushPlayers();
    });
  });

  // fields are the superkey

  // catch error?
  // probably change it, use then and return the result
  socket.on('signup', (username, callback) => {
    UserController.signup(username, (result) => {
      callback(result);
      pushPlayers();
    });
    // }).catch((error) => {
    //   console.log(error);
    //   socket.emit('error', 'signup failed');
    // });
  });

  // smoothed later?
  // for updating location, score, and color?
  socket.on('updatePlayer', (username, fields, callback) => {
    UserController.updateUser(username, fields, (result) => {
      callback(result);
      pushPlayers();
    });
  });


  // LOCATION

  LocationController.getLocations(null, (locations) => {
    socket.emit('locations', locations);
  });

  const pushLocations = () => {
    LocationController.getLocations(null, (locations) => {
      console.log('two');
      io.sockets.emit('locations', locations);
    });
  };

// fields should be passed in as a JSON object
  socket.on('createLocation', (username, location, callback) => {
    LocationController.createLocation(username, location, (result) => {
      callback(result);
      pushLocations();
    });
  });

  socket.on('getLocationsByPlayer', (username, callback) => {
    LocationController.getLocationsByPlayer(username, (result) => {
      callback(result);
      pushLocations();
    });
  });

  socket.on('getLocation', (username, callback) => {
    LocationController.getLocation(username, (result) => {
      console.log('getLocation');
      callback(result);
      pushLocations();
    });
  });

  socket.on('updateLocationPlayer', (username, location, callback) => {
    console.log('hellooooo');
    LocationController.updateLocationPlayer(username, location, (result) => {
      callback(result);
      pushLocations();
    });
  });

  // end
});
