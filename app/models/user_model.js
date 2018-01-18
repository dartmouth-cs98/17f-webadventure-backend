import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, unique: true },
  // playerColor: {
  //   r: Number,
  //   g: Number,
  //   b: Number,
  // },
  curLocation: {
    // hashKey: { type: String, unique: true },
    url: { type: String },
    sectionID: { type: Number },
    sentenceID: { type: Number },
  },
  prevURL: { type: String },
  curNumClicks: { type: Number, default: 0 },
  curSecsElapsed: { type: Number, default: 0 }, // unit is seconds
}, {
  toJSON: {
    virtuals: true,
  },
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
