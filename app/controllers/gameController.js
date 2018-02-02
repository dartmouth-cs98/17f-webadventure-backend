import Game from '../models/gameModel';
import User from '../models/userModel';

export const cleanGame = (game) => {
  return { id: game._id,
    startPage: game.startPage,
    goalPage: game.goalPage,
    host: game.host,
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
  getGames({ active: false }, callback);
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
    curUrl: null,
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
  playerInfo = { finishTime: -1, numClicks: 0, curUrl: null }, callback) => {
  Game.findById(gameId, (game) => {
    const newPlayers = game.players.map((player) => {
      if (player.username === username) {
        player.finishTime = playerInfo.finishTime;
        player.numClicks = playerInfo.numClicks;
        player.curUrl = playerInfo.curUrl;
      }
      return player;
    });
    game.players = newPlayers;
    game.save();
    callback(game);
  });
};

export const updateGame = (id, update, callback) => {
  Game.findOneAndUpdate(id, update, callback);
};

export const startGame = (gameId) => {
  return Game.findByIdandUpdate(gameId, { active: true });
};
