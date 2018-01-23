import Game from '../models/game_model';
import User from '../models/user_model';

const cleanGames = (games) => {
  return games.map((game) => {
    return { id: game._id,
      start_page: game.start_page,
      goal_page: game.goal_page,
      host: game.host,
      players_scores: game.players_scores,
      active: game.active };
  });
};

export const getGames = (req, callback) => {
  // User.find({}).populate('curLocation')
  Game.find({})
  .then((data) => {
    callback(cleanGames(data));
  });
};

const cleanGame = (game) => {
  return { id: game._id,
    start_page: game.start_page,
    goal_page: game.goal_page,
    host: game.host,
    players_scores: game.players_scores,
    active: game.active };
};

export const getGame = (user, res) => {
  Game.findOne({ user })
  .then((data) => {
    if (data.active) {
      res(cleanGame(data));
    }
  });
};

export const createGame = (username, endpoints, callback) => {
  const newGame = new Game();
  newGame.start_page = endpoints.start_page;
  newGame.goal_page = endpoints.end_page;

  // do something if user not found
  User.findOne({ username })
  .then((user) => {
    // newGame.host = user;
    newGame.host = username;
    newGame.save();
  });

  callback(newGame); // doesn't call back immediately
  // callback(cleanGame(newGame));
};
