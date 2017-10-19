import mongoose, { Schema } from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new Schema({
  username: { type: String, unique: true },
  playerColor: {
    r: Number,
    g: Number,
    b: Number,
  },
  curLocation: ObjectId, // why is current location being represented by the objectID
  curScore: { type: Number, default: 0 },
}, {
  toJSON: {
    virtuals: true,
  },
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;