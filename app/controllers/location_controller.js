import Location from '../models/location_model';

export const getLocations = (req, res) => {
  Location.find({}, (err, location) => {
    res(location);
  });
};

export const getLocation = (req, res, next) => {
  Location.findOne({ username: req.username }, (err, user) => {
    res(user.curLocation);
  });
};
