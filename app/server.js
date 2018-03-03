import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import socketio from 'socket.io';
import http from 'http';

import setupLobby from './lobbyServer';
import setupGameServer from './gameServer';
import mockWiki from './mockWiki';

import * as EndpointController from './controllers/EndpointController';

// initialize
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/webadventure';
mongoose.connect(mongoURI);
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

app.post('/api/endpoints', (req, res) => {
  const graphPath = req.query.path ? req.query.path.split(',') : [];
  EndpointController.insertEndpoint(req.query.startPage, req.query.goalPage, graphPath);
});


// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
server.listen(port);

console.log(`listening on: ${port}`);

setupLobby(io);
setupGameServer(io);
