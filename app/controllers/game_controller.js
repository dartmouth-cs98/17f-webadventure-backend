/* eslint new-cap: 0 */

import mongoose from 'mongoose';
import Game from '../models/game_model';
import User from '../models/user_model';

// get all players in a game

const cleanGames = (games) => {
  return games.map((game) => {
    return { id: game._id,
      startPage: game.startPage,
      goalPage: game.goalPage,
      host: game.host,
      playersInformation: game.playersInformation,
      active: game.active };
  });
};

export const getGames = (req, callback) => {
  // User.find({}).populate('curLocation')
  Game.find({})
  .then((result) => {
    callback(cleanGames(result));
  });
};

const cleanGame = (game) => {
  return { id: game._id,
    startPage: game.startPage,
    goalPage: game.goalPage,
    host: game.host,
    playersInformation: game.playersInformation,
    active: game.active };
};

// untested
export const getGameByUsername = (user, res) => {
  Game.findOne({ host: user, active: true })
  .then((result) => {
    res(cleanGame(result));
  },
  );
};

// untested
export const getGameByID = (id, res) => {
  Game.findById(id)
  .then((result) => {
    if (result.active) {
      res(cleanGame(result));
    }
  });
};

export const createGame = (username, endpoints, callback) => {
  const newGame = new Game();
  newGame.startPage = endpoints.startPage;
  newGame.goalPage = endpoints.endPage;

  // do something if user not found
  User.findOne({ username })
  .then((user) => {
    newGame.host = user;
    newGame.playersInformation = [{
      path: [],
      secsElapsed: 0,
      numClicks: 0,
      player: user,
    }];
    // newGame.host = username;
    newGame.save();
  });

  console.log('get here');
  callback(newGame); // doesn't call back immediately
  // callback(cleanGame(newGame));
};


// works
export const activateGame = (id, callback) => {
  const gameId = mongoose.Types.ObjectId(id);
  Game.findOneAndUpdate({ _id: gameId }, { $set: { active: true } }, { new: true })
  .then((result) => {
    callback(result);
  });
};

export const deactivateGame = (id, callback) => {
  const gameId = mongoose.Types.ObjectId(id);
  Game.findOneAndUpdate({ _id: gameId }, { $set: { active: false } }, { new: true })
  .then((result) => {
    callback(result);
  });
};
