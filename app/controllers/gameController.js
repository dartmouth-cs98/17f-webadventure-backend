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

export const getNewGames = (callback) => {
  getGames({ active: false, isPrivate: false }, callback);
};

export const getGame = (id, res) => {
  Game.findById(id).then((result) => {
    res(cleanGame(result));
  });
};

export const createGame = (username, endpoints, callback) => {
  const newGame = new Game();

  // Generate start and end here
  newGame.startPage = endpoints.startPage;
  newGame.goalPage = endpoints.endPage;

  User.findOne({ username })
  .then((user) => {
    newGame.host = user;
    newGame.playersInformation = [{
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
