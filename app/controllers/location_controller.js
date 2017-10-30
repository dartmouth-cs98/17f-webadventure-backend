import Location from '../models/location_model';
import * as UserController from './user_controller';

export const getLocations = (req, res) => {
  Location.find({})
  .then((data) => {
    res(data);
  });
};

export const getLocationsByPlayer = (username, res) => {
  Location.find({ playerUsername: username })
  .then((locs) => {
    res(locs);
  });
};

export const getLocationByHashKey = (hashKey, res) => {
  Location.findOne({ hashKey })
  .then((loc) => {
    res(loc);
  });
};

export const updateLocationPlayer = (username, loc, res) => {
  const hashKey = loc.url + loc.sectionID + loc.sentenceID + loc.character;
  Location.findOne({ hashKey })
  .then((location) => {
    location.playerUsername = username;
    location.save();
    res(location);
  });
};

export const createLocation = (username, loc, res) => {
  const location = new Location();
  location.url = loc.url;
  location.sectionID = loc.sectionID;
  location.sentenceID = loc.sentenceID;
  location.character = loc.character;

  const h = loc.url + loc.sectionID + loc.sentenceID + loc.character;
  location.hashKey = h;

  location.playerUsername = username;
  location.save();

  // save location and update the player
  UserController.updateUserLocation(username, location);
  res(location);
};
