import User from '../models/userModel';


const cleanUser = (user) => {
  return { id: user._id,
    username: user.username,
    avatar: user.avatar,
    active: user.active };
};

const cleanUsers = (users) => {
  return users ? users.map(cleanUser) : [];
};

export const getUsers = (req, callback) => {
  User.find({})
  .then((result) => {
    callback(cleanUsers(result));
  }).catch((err) => { console.log(err); });
};

export const getActiveUsers = (callback) => {
  User.find({ active: true })
  .then((results) => {
    callback(cleanUsers(results));
  }).catch((err) => { console.log(err); });
};

export const getUser = (username, res) => {
  User.findOne({ username })
  .then((result) => {
    res(cleanUser(result));
  }).catch((err) => { console.log(err); });
};

export const updateUser = (username, fields, res) => {
  User.findOneAndUpdate({ username }, fields, { new: true })
  .then((result) => {
    res(cleanUser(result));
  }).catch((err) => { console.log(err); });
};

// do we need this now?
export const logoutUser = (username) => {
  return User.findOneAndUpdate({ username }, { active: false });
};

// is active obsolete now?
export const deleteUser = (username) => {
  return User.remove({ username });
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
