import Game from '../models/gameModel';
import User from '../models/userModel';

export const cleanGame = (game) => {
  return { id: game._id,
    startPage: game.startPage,
    goalPage: game.goalPage,
    host: game.host,
    isPrivate: game.isPrivate,
    players: game.players,
    active: game.active };
};

export const cleanGames = (games) => {
  return games.map(cleanGame);
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
  newGame.goalPage = endpoints.endPage;

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

export const joinNewGame = (gameId, username, callback) => {
  const newPlayer = {
    username,
    finishTime: -1,
    numClicks: 0,
    curUrl: '',
  };
  Game.findById(gameId, (game) => {
    game.players = game.players.push(newPlayer);
    game.save();
    callback(game);
  });
};

export const getNewGames = (callback) => {
  getGames({ active: false, isPrivate: false }, (games) => {
    if (games.length < 5) {
      for (let i = games.length; i < 5; i += 1) {
        // get random endpoints here
        const endpoints = ['https://en.wikipedia.org/wiki/Architectural_style', 'https://en.wikipedia.org/wiki/Ren%C3%A9_Descartes'];
        createGame('Public Game', false, endpoints, (game) => { return console.log(game); });
        // combine promises of create game
      }
    }
    callback(games);
  });
};

export const getGame = (id, res) => {
  Game.findById(id).then((result) => {
    res(cleanGame(result));
  });
};

export const leaveNewGame = (gameId, username, callback) => {
  Game.findById(gameId, (game) => {
    const newPlayers = game.players.filter((player) => { return player.username !== username; });
    game.players = newPlayers;
    game.save();
    callback(game);
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
