import Location from '../models/location_model';
import * as UserController from './user_controller';

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

// export const updateLocation = (username, res) => {
//   Location.find
// };

export const createLocation = (loc, res) => {
  const location = new Location();
  location.url = loc.url;
  location.sectionID = loc.sectionID;
  location.sentenceID = loc.sentenceID;
  location.character = loc.character;

  const h = loc.url + loc.sectionID + loc.sentenceID + loc.character;
  location.hashKey = h;

  location.playerUsername = loc.playerUsername;
  location.save();

  // save location and update the player
  UserController.updateUserLocation(loc.playerUsername, location);
  res(location);
};
