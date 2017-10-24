import Location from '../models/location_model';
import User from '../models/user_model';

export const getLocations = (req, res) => {
  Location.find({}, (err, location) => {
    res(location);
  });
};

export const getLocation = (username, res) => {
  Location.findOne({ username }, (err, user) => {
    // res is a callback
    res(user.curLocation);
  });
};

export const makeLocation = (sectionID, sentenceID, wordID, playerUsername, res) => {
  User.get({ playerUsername }, (err, user) => {
    const location = new Location();
    location.sectionID = sectionID;
    location.sentenceID = sentenceID;
    location.wordID = wordID;
    location.playerUsername = playerUsername;
    location.save();
    res(location);
  });
};
