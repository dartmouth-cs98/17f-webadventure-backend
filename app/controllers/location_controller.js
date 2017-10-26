import Location from '../models/location_model';
import User from '../models/user_model';

export const getLocations = (req, res) => {
  Location.find({})
  .then((data) => {
    res(data);
  });
};


// key is username, or superkey?
export const getLocation = (username, res) => {
  Location.findOne({ playerUsername: username })
  .then((data) => {
    res(data);
  });
};

// export const makeLocation = (sectionID, sentenceID, wordID, playerUsername) => {
//   User.get({ playerUsername }, (err, user) => {
//     const location = new Location();
//     location.sectionID = sectionID;
//     location.sentenceID = sentenceID;
//     location.wordID = wordID;
//     location.playerUsername = playerUsername;
//     location.save();
//   });
// };

export const createLocation = (playerUsername, fields) => {
  const location = new Location();
  location.sectionID = fields.sectionID;
  location.sentenceID = fields.sentenceID;
  location.wordID = fields.wordID;
  location.playerUsername = playerUsername;
  location.save();

  // save location and update the player
  User.findOne({ playerUsername }, (user) => {
    if (user) {
      user.curLocation = location;
    }
  });

  return location;
};
