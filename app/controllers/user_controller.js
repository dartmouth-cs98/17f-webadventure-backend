import User from '../models/user_model';

// const cleanUsers = (users) => {
//   return users.map((user) => {
//     return { id: user._id, username: user.username, playerColor: user.playerColor, curLocation: user.curLocation, curScore: user.curScore };
//   });
// };

const cleanUser = (user) => {
  console.log(user.username);
  return { id: user._id, username: user.username, playerColor: user.playerColor, curLocation: user.curLocation, curScore: user.curScore };
};

export const getUser = (req, res) => {
  User.findOne({ username: req.params.username }, (err, u) => {
    if (u) {
      res.json(cleanUser(u));
    } else {
      res.status(500).json({ err });
    }
  });
};

// TWO GET USERS -- which one? Depends on how Alma implements the frontend

// getUsers should return username and locations
// export const getUsers = (req, res) => {
//   User.find({}).sort({ created_at: -1 })
//   .then((result) => {
//     res.json(cleanUsers(result));
//   })
//   .catch((error) => {
//     res.status(500).json({ error });
//   });
// };

export const getUsers = (req, res) => {
  User.find({}, (err, users) => {
    res(users);
  });
};

export const signin = (req, res, next) => {
  res.send({ user: req.user });
};

export const signup = (req, res, next) => {
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
