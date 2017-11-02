import Location from '../models/location_model';

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

export const createLocation = (loc, username, res) => {
  const location = new Location();
  location.url = loc.url;
  location.sectionID = loc.sectionID;
  location.sentenceID = loc.sentenceID;
  location.character = loc.character;
  const h = loc.url + loc.sectionID + loc.sentenceID + loc.character;
  location.hashKey = h;
  location.playerUsername = username;
  return location.save();
};

export const getOrCreateLocation = (loc, username, res) => {
  const hashKey = loc.url + loc.sectionID + loc.sentenceID + loc.character;
  Location.findOne({ hashKey }).then((result) => {
    if (!result) {
      createLocation(loc, username).then((newLoc) => { return res(newLoc); });
    }
    return res(result);
  });
};

export const clearUserLocations = (username, res) => {
  Location.deleteMany({ playerUsername: username })
  .then((result) => { return console.log(result); })
  .catch((error) => { return console.log(error); });
};
