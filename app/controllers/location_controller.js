import Location from '../models/location_model';

const cleanLocations = (locs) => {
  return locs.map((loc) => {
    return { id: loc._id, hashKey: loc.hashKey, sectionID: loc.sectionID, sentenceID: loc.sentenceID, character: loc.character, playerUsername: loc.playerUsername };
  });
};

export const getLocations = (req, res) => {
  Location.find({})
  .then((data) => {
    res(data);
  });
};

export const getLocationsByURL = (locID, callback) => {
  Location.findOne({ _id: locID })
  .then((loc) => {
    Location.find({ url: loc.url })
    .then((locs) => {
      callback(cleanLocations(locs));
    });
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
  .then((result) => { })
  .catch((error) => { return console.log(error); });
};
