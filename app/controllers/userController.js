import User from '../models/userModel';


const cleanUser = (user) => {
  return { id: user._id,
    username: user.username,
    avatar: user.avatar,
    active: user.active };
};

const cleanUsers = (users) => {
  return users.map(cleanUser);
};

export const getUsers = (req, callback) => {
  User.find({})
  .then((result) => {
    callback(cleanUsers(result));
  });
};

export const getActiveUsers = (callback) => {
  User.find({ active: true })
  .then((results) => {
    callback(cleanUsers(results));
  });
};

export const getUser = (username, res) => {
  User.findOne({ username })
  .then((result) => {
    res(cleanUser(result));
  });
};

export const updateUser = (username, fields, res) => {
  User.findOneAndUpdate({ username }, fields, { new: true })
  .then((result) => {
    res(cleanUser(result));
  });
};

export const logoutUser = (username) => {
  return User.findOneAndUpdate({ username }, { active: false });
};

export const getOrCreateUser = (username, res) => {
  User.findOne({ username })
  .then((user) => {
    if (user) {
      user.active = true;
      user.save();
      res(cleanUser(user));
    } else {
      const newUser = new User();
      newUser.username = username;
      newUser.active = true;
      // add avatar stuff here
      newUser.save()
      .then((result) => {
        res(cleanUser(result));
      });
    }
  });
};
