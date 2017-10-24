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

export const makeLocation = (req, res, next) => {
  const username = req.body.username;
  const color = req.body.playerColor;

  if (!username) {
    return res.status(422).send('You must provide a username');
  }

  const newUser = new User();
  newUser.username = username;
  newUser.playerColor.r = color.r;
  newUser.playerColor.g = color.g;
  newUser.playerColor.b = color.b;
  newUser.save()
    .then((result) => {
      res.send({ token: result, id: result._id });
    })
    .catch((error) => {
      res.status(422).send('User with that username already exists');
    });
};
