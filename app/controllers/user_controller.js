import User from '../models/user_model';

export const getUser = (req, res, next) => {
  User.findOne({ username: req.username }, (err, user) => {
    if (user == null) {
      user = new User();
      user.username = req.body.username;
      user.playerColor = req.body.playerColor;
      user.save()
      .then((result) => { return res.send(result); });
    }
  });
};

export const signin = (req, res, next) => {
  res.send({ user: req.user });
};

export const signup = (req, res, next) => {
  const username = req.body.username;

  if (!username) {
    return res.status(422).send('You must provide a username');
  }

  const newUser = new User();
  newUser.username = username;
  newUser.save()
    .then((result) => {
      res.send({ token: result, id: result._id });
    })
    .catch((error) => {
      res.status(422).send('User with that username already exists');
    });
};
