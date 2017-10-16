import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, unique: true },
}, {
  toJSON: {
    virtuals: true,
  },
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
