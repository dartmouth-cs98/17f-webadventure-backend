import User from '../models/user_model';
import * as LocationController from './location_controller';

const cleanUsers = (users) => {
  return users.map((user) => {
    return { id: user._id, username: user.username, playerColor: user.playerColor, curLocation: user.curLocation, curScore: user.curScore, highScore: user.highScore };
  });
};

export const getUsers = (req, callback) => {
  User.find({}).populate('curLocation')
  .then((data) => {
    callback(cleanUsers(data));
  });
};

const cleanUser = (user) => {
  console.log(user.username);
  return { id: user._id, username: user.username, playerColor: user.playerColor, curLocation: user.curLocation, curScore: user.curScore, highScore: user.highScore };
};

export const getUser = (username, res) => {
  User.findOne({ username })
  .then((data) => {
    res(cleanUser(data));
  });
};

export const updateUser = (username, fields, res) => {
  const update = {};
  if (fields.curScore) { update.curScore = fields.curScore; }
  if (fields.highScore) { update.highScore = fields.highScore; }
  if (fields.playerColor) { update.playerColor = fields.playerColor; }
  if (fields.location) {
    LocationController.getOrCreateLocation(fields.location, username, (loc) => {
      update.curLocation = loc;
      User.findOneAndUpdate({ username }, update).then(res);
    });
  } else { User.findOneAndUpdate({ username }, update).then(res); }
};

// check if exists
export const signup = (username, playerColor, res) => {
  User.findOne({ username })
  .then((user) => {
    if (user) {
      res(cleanUser(user));
    }
    const newUser = new User();
    newUser.username = username;
    newUser.playerColor = playerColor;
    newUser.save();
    res(cleanUser(newUser));
  });
};

export const removeUserFromGame = (username, res) => {
  User.findOne({ username })
  .then((user) => {
    const update = {};
    update.curLocation = null;
    if (user.curScore > user.highScore) {
      update.highScore = user.curScore;
    }
    update.curScore = null;

    User.findOneAndUpdate({ username }, update).then(res);
  })
  .then((user) => {
    LocationController.clearUserLocations(username);
  });
};
