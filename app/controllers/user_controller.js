import User from '../models/user_model';
import * as LocationController from './location_controller';

const cleanUsers = (users) => {
  return users.map((user) => {
    return { id: user._id, username: user.username, playerColor: user.playerColor, curLocation: user.curLocation, curScore: user.curScore };
  });
};

const cleanUser = (user) => {
  console.log(user.username);
  return { id: user._id, username: user.username, playerColor: user.playerColor, curLocation: user.curLocation, curScore: user.curScore };
};

export const getUser = (username, res) => {
  User.findOne({ username })
  .then((data) => {
    res(cleanUser(data));
  });
};

export const getUsers = (req, callback) => {
  User.find({}).populate('curLocation')
  .then((data) => {
    callback(cleanUsers(data));
  });
};

export const updateUser = (username, fields, res) => {
  const update = {};
  if (fields.curScore) { update.curScore = fields.curScore; }
  if (fields.playerColor) { update.playerColor = fields.playerColor; }
  if (fields.location) {
    LocationController.getOrCreateLocation(fields.location, username, (loc) => {
      update.curLocation = loc;
      User.findOneAndUpdate({ username }, update).then(res);
    });
  } else { User.findOneAndUpdate({ username }, update).then(res); }
};

export const signup = (username, res) => {
  const newUser = new User();
  newUser.username = username;

  // set a default
  newUser.playerColor = { r: 1, g: 0, b: 0 };

  newUser.save();
  res(cleanUser(newUser));
};

// change location to the user
export const updateUserLocation = (username, location) => {
  User.findOne({ username })
  .then((user) => {
    user.curLocation = location;
    user.save();
  });
};
