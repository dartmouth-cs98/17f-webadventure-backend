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
    console.log(`got data: ${data}`);
    res(cleanUser(data));
  });
};

export const getUsers = (req, res) => {
  User.find({})
  .then((data) => {
    res(cleanUsers(data));
  });
};

// fields should pass in location, color, and score information
// export const updateUser = (username, fields, res) => {
//   return User.findOne({ username })
//   .then((user) => {
//     Object.keys(fields).forEach((k) => {
//       user[k] = fields[k];
//     });
//     user.save();
//     res(user);
//   });
// };

// ADD LOCATION INFORMATION
// ADD VALIDATION
export const updateUser = (username, fields, res) => {
  User.findOne({ username })
  .then((user) => {
    user.curScore = fields.curScore ? fields.curScore : user.curScore;
    user.playerColor = fields.playerColor ? fields.playerColor : user.playerColor;

    if (fields.location) {
      const hashKey = fields.location.url + fields.location.sectionID + fields.location.sentenceID + fields.location.character;
      console.log(hashKey);
      LocationController.getLocationByHashKey(hashKey, (loc) => {
        // location exists: update on location end and user end
        if (loc) {
          LocationController.updateLocationPlayer(username, loc, (updatedLoc) => {
            user.curLocation = updatedLoc;
          });
        } else {
          // const h = fields.location.url + fields.location.sectionID + fields.location.sentenceID + fields.location.character;
          LocationController.createLocation(username, fields.location, (newLoc) => {
            user.curLocation = newLoc;
          });
        }
      });
    }

    user.save();
    res(user);
  });
};

export const signup = (username, res) => {
  const newUser = new User();
  newUser.username = username;

  // set a default
  newUser.playerColor = { r: 1, g: 0, b: 0 };

  newUser.save();
  res(cleanUser(newUser));
};

export const updateUserLocation = (username, location) => {
  User.findOne({ username })
  .then((user) => {
    user.curLocation = location;
    user.save();
  });
};
