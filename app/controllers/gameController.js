import Game from '../models/gameModel';
import User from '../models/userModel';

export const cleanGame = (game) => {
  if (game) {
    return {
      id: game._id,
      startPage: game.startPage,
      goalPage: game.goalPage,
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


export const createGame = (username, isPrivate, endpoints, callback) => {
  const newGame = new Game();

  // Generate start and end here
  newGame.startPage = endpoints.startPage;
  newGame.goalPage = endpoints.goalPage;

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
      newGame.save();
      callback(newGame);
    }).catch((err) => {
      console.log(err);
      callback(null);
    });
  } else {
    newGame.host = username;
    newGame.isPrivate = false;
    newGame.players = [];
    newGame.save();
    callback(newGame);
  }
};

export const getNewGames = (callback) => {
  getGames({ active: false, isPrivate: false }, (games) => {
    if (games.length < 5) {
      for (let i = games.length; i < 5; i += 1) {
        // get random endpoints here
        const endpoints = { startPage: 'https://en.wikipedia.org/wiki/Architectural_style',
          goalPage: 'https://en.wikipedia.org/wiki/Ren%C3%A9_Descartes' };
        createGame(`Game ${i + 1}`, false, endpoints, (game) => { return console.log(game); });
        // combine promises of create game
      }
    }
    callback(games);
  });
};

export const getGame = (id, res) => {
  Game.findById(id)
  .then((result) => {
    res(cleanGame(result));
  })
  .catch((error) => {
    console.log(error);
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
  return Game.findById(gameId, (game) => {
    const newPlayers = game.players.map((player) => {
      if (player.username === username) {
        playerInfo.forEach((key) => {
          player[key] = playerInfo[key];
        });
      }
      return player;
    });
    game.players = newPlayers;
    game.save();
  });
};

export const updateGame = (id, update, callback) => {
  Game.findOneAndUpdate(id, update, callback);
};

export const startGame = (gameId) => {
  return Game.findByIdandUpdate(gameId, { active: true });
};
