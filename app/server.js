import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';

import * as Polls from './controllers/poll_controller';

// initialize
const app = express();

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/cs52poll';
mongoose.connect(mongoURI);
// set mongoose promises to es6 default
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
  // we will later be able to get the polls by calling a function, but let's pass in no polls for now
  Polls.getPolls().then((polls) => {
    res.render('index', { polls });
  }).catch((error) => {
    res.send(`error: ${error}`);
  });
});

app.get('/new', (req, res) => {
  // we will later be able to get the polls by calling a function, but let's pass in no polls for now
  Polls.getPolls().then((polls) => {
    res.render('new');
  }).catch((error) => {
    res.send(`error: ${error}`);
  });
});

app.post('/new', (req, res) => {
  // we will later be able to get the polls by calling a function, but let's pass in no polls for now
  const newpoll = {
    text: req.body.text,
    imageURL: req.body.imageURL,
  };
  Polls.createPoll(newpoll).then((poll) => {
    res.redirect('/');
  });
});

app.post('/vote/:id', (req, res) => {
  // we will later be able to get the polls by calling a function, but let's pass in no polls for now
  const vote = (req.body.vote === 'up');// convert to bool
  Polls.vote(req.params.id, vote).then((result) => {
    res.send(result);
  });
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
