import Game from '../models/gameModel';
import User from '../models/userModel';
import { getRandomEndpoint } from '../controllers/endpointController';

export const cleanGame = (game) => {
  if (game) {
    return {
      id: game._id,
      startPage: game.startPage,
      goalPage: game.goalPage,
      path: game.path,
      host: game.host,
      isPrivate: game.isPrivate,
      players: game.players,
      active: game.active,
    };
  }
  return new Error('game does not exist');
};

export const cleanGames = (games) => {
  return games ? games.map(cleanGame) : [];
};


export const getGames = (filter, callback) => {
  Game.find(filter)
  .then((result) => {
    callback(cleanGames(result));
  });
};


export const createGame = (username, isPrivate, callback) => {
  const newGame = new Game();

  getRandomEndpoint((endpoint) => {
    newGame.startPage = endpoint.startPage;
    newGame.goalPage = endpoint.goalPage;
    newGame.path = endpoint.path;
    if (isPrivate) {
      User.findOne({ username })
    .then((user) => {
      newGame.host = user.username;
      newGame.isPrivate = isPrivate;
      newGame.players = [{
        finishTime: -1,
        numClicks: 0,
        username: user.username,
        curUrl: null,
      }];
      newGame.save((err, result) => {
        callback(cleanGame(result));
      });
    }).catch((err) => {
      console.log(err);
      callback(null);
    });
    } else {
      newGame.host = username;
      newGame.isPrivate = false;
      newGame.players = [];
      newGame.save((err, result) => {
        callback(cleanGame(result));
      });
    }
  });
};

export const getNewGames = () => {
  // get non active games that are public and have 0 players
  getGames({ active: false, isPrivate: false, players: { $exists: true }, $where: 'this.players.length < 5' }, (games) => {
    if (games.length < 5) {
      for (let i = games.length; i < 5; i += 1) {
        // get random endpoints here
        const num = Math.floor(Math.random() * 500);
        createGame(`Open Game`, false, (game) => { return console.log(game); });
        // combine promises of create game
      }
    }
  });
};

export const getGame = (id, res) => {
  Game.findById(id, (err, result) => {
    if (err) { console.log(err); return; }
    res(cleanGame(result));
  });
};

export const joinNewGame = (gameId, username, callback) => {
  const newPlayer = {
    username,
    finishTime: -1,
    numClicks: 0,
    curUrl: '',
  };
  Game.findOneAndUpdate(
    { _id: gameId, 'players.username': { $ne: username } },
    { $push: { players: newPlayer } },
    { new: true },
    (error, game) => {
      if (game === null) {
        callback(new Error('Same username!'));
      }
      callback(cleanGame(game));
    });
};

export const leaveNewGame = (gameId, username, callback) => {
  Game.findByIdAndUpdate(gameId,
  { $pull: { players: { username } } },
  { new: true },
  (error, game) => {
    if (error) {
      console.log(error);
    }
    callback(cleanGame(game));
  });
};

export const updatePlayer = (gameId, username,
  playerInfo = { finishTime: -1, numClicks: 0, curUrl: '' }, callback) => {
  return Game.findById(gameId, (err, game) => {
    if (err) { console.log(err); }
    const newPlayers = game.players.map((player) => {
      const updatedPlayer = player;
      if (player.username === username) {
        Object.keys(playerInfo).forEach((key) => {
          updatedPlayer[key] = playerInfo[key];
        });
      }
      return updatedPlayer;
    });
    game.players = newPlayers;
    game.save((err, updatedGame) => {
      callback(cleanGame(updatedGame));
    });
  });
};

export const deleteGame = (gameId) => {
  return Game.remove({ _id: gameId });
};

export const updateGame = (id, update, callback) => {
  return Game.findByIdAndUpdate(id, update, { new: true },
    (game) => { return callback(cleanGame(game)); });
};

export const startGame = (gameId, callback) => {
  return Game.findByIdAndUpdate(gameId, { active: true }, { new: true })
  .then((game) => { return callback(cleanGame(game)); });
};
