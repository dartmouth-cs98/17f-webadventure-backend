import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, unique: true },
  active: { type: Boolean, default: false },
  avatar: { type: [String], default: ['https://i.imgur.com/rZSkKF0.gif', 'https://i.imgur.com/YNcTBuU.gif'] },
}, { toJSON: {
  virtuals: true,
} });

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
