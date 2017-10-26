import User from '../models/user_model';

const cleanUsers = (users) => {
  return users.map((user) => {
    return { id: user._id, username: user.username, playerColor: user.playerColor, curLocation: user.curLocation, curScore: user.curScore };
  });
};

const cleanUser = (user) => {
  console.log(user.username);
  return { id: user._id, username: user.username, playerColor: user.playerColor, curLocation: user.curLocation, curScore: user.curScore };
};

// export const getUser = (req, res) => {
//   User.findOne({ username: req.params.username }, (err, u) => {
//     if (u) {
//       res.json(cleanUser(u));
//     } else {
//       res.status(500).json({ err });
//     }
//   });
// };

export const getUser = (username, res) => {
  User.findOne({ username })
  .then((data) => {
    console.log(`got data: ${data}`);
    res(cleanUser(data));
  });
};


export const getUsers = (req, res) => {
  User.find({})
  .then((data) => {
    res(cleanUsers(data));
  });
};

// fields should pass in location, color, and score information
export const updateUser = (username, fields) => {
  return User.findOne({ username })
  .then((user) => {
    Object.keys(fields).forEach((k) => {
      user[k] = fields[k];
    });
    return user.save();
  });
};

// probably buggy
export const signup = (username, res) => {
  const newUser = new User();
  newUser.username = username;
  newUser.PlayerColor.r = 0;
  newUser.PlayerColor.g = 0;
  newUser.PlayerColor.b = 0;

  // update location here

  return newUser.save();
};
