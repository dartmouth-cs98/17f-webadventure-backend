import User from '../models/user_model';

// const cleanUser = (user) => {
//   return { id: user._id, author_name: user.author_name };
// };
//
// export const getUser = (req, res) => {
//   User.findById(req.params.userId, (err, u) => {
//     if (u) {
//       res.json(cleanUser(u));
//     } else {
//       res.status(500).json({ err });
//     }
//   });
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
