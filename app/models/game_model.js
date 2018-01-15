import mongoose, { Schema } from 'mongoose';

const GameSchema = new Schema({
  start_page: { type: String },
  goal_page: { type: String },
  host: { type: Schema.Types.ObjectID, ref: 'User' }, // or should be stored as string?
}, {
  toJSON: {
    virtuals: true,
  },
});

const GameModel = mongoose.model('Game', GameSchema);

export default GameModel;
