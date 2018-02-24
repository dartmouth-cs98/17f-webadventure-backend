import mongoose, { Schema } from 'mongoose';

const GamePathSchema = new Schema({
  game: { type: Schema.Types.ObjectId, ref: 'Game' },
  player: { type: Schema.Types.ObjectId, ref: 'User' },
  path: [String],
}, {
  toJSON: {
    virtuals: true,
  },
});

const GamePathModel = mongoose.model('GamePath', GamePathSchema);

export default GamePathModel;
