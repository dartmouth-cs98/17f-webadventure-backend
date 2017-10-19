import mongoose, { Schema } from 'mongoose';

// const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new Schema({
  username: { type: String, unique: true },
  playerColor: {
    r: Number,
    g: Number,
    b: Number,
  },
  curLocation: { type: Schema.Types.ObjectId, ref: 'Location' },
  curScore: { type: Number, default: 0 },
}, {
  toJSON: {
    virtuals: true,
  },
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
