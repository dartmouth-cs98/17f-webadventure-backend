import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import socketio from 'socket.io';
import http from 'http';
import apiRouter from './router';

import * as UserController from './controllers/user_controller';


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
    console.log('one');
    socket.emit('players', users);
  });

  // emits to every socket
  const pushPlayers = () => {
    UserController.getUsers(null, (users) => {
      console.log('two');
      io.sockets.emit('players', users);
    });
  };

  socket.on('getPlayer', (username) => {
    UserController.getUser(username, (result) => {
      console.log('three');
      socket.emit('curPlayer', result);
      pushPlayers();
    });
  });
});
