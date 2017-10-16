import User from '../models/user_model';

// export const getUsers = () => {
//   return User.find({});
// };

export const signin = (req, res, next) => {
  res.send({ token: req.user, id: req.user._id });
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
