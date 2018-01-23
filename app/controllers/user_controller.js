import User from '../models/user_model';
import * as LocationController from './location_controller';

const cleanUsers = (users) => {
  return users.map((user) => {
    return { id: user._id,
      username: user.username,
      curLocation: user.curLocation,
      prevURL: user.prevURL,
      curNumClicks: user.curNumClicks,
      curSecsElapsed: user.curSecsElapsed };
  });
};

export const getUsers = (req, callback) => {
  // User.find({}).populate('curLocation')
  User.find({})
  .then((data) => {
    callback(cleanUsers(data));
  });
};

const cleanUser = (user) => {
  return { id: user._id,
    username: user.username,
    curLocation: user.curLocation,
    prevURL: user.prevURL,
    curNumClicks: user.curNumClicks,
    curSecsElapsed: user.curSecsElapsed };
};

export const getUser = (username, res) => {
  User.findOne({ username })
  .then((data) => {
    res(cleanUser(data));
  });
};

export const updateUser = (username, fields, res) => {
  const update = {};
  if (fields.curLocation) { update.curLocation = fields.curLocation; }
  if (fields.prevURL) { update.prevURL = fields.prevURL; }
  if (fields.curNumClicks) { update.curNumClicks = fields.curNumClicks; }
  if (fields.curSecsElapsed) { update.curSecsElapsed = fields.curSecsElapsed; }
  User.findOneAndUpdate({ username }, update, { new: true })
  .then((data) => {
    console.log(data);
    res(cleanUser(data));
  });
};

// export const updateUser = (username, fields, res) => {
//   const update = {};
//   if (fields.highScore) { update.highScore = fields.highScore; }
//   if (fields.playerColor) { update.playerColor = fields.playerColor; }
//   if (fields.location) {
//     LocationController.getOrCreateLocation(fields.location, username, (loc) => {
//       update.curLocation = loc;
//       User.findOneAndUpdate({ username }, update).then(res);
//     });
//   } else { User.findOneAndUpdate({ username }, update).then(res); }
// };

// check if exists
export const signup = (username, res) => {
  User.findOne({ username })
  .then((user) => {
    if (user) {
      res(cleanUser(user));
    } else {
      const newUser = new User();
      newUser.username = username;
      newUser.save();
      res(cleanUser(newUser));
    }
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
    update.curScore = 0;

    User.findOneAndUpdate({ username }, update).then(res);
  })
  .then((user) => {
    LocationController.clearUserLocations(username);
  });
};
