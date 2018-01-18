import mongoose, { Schema } from 'mongoose';

const GameSchema = new Schema({
  start_page: { type: String },
  goal_page: { type: String },
  host: { type: Schema.Types.ObjectID, ref: 'User' }, // or should be stored as string?
  // hostUsername: { type: String },
  players_scores: [{
    path: [{ type: String }],
    secsElapsed: { type: Number },
    numClicks: { type: Number },
    // player_username: { type: String },
    player: { type: Schema.Types.ObjectID, ref: 'User' },
  }],
}, {
  toJSON: {
    virtuals: true,
  },
});

const GameModel = mongoose.model('Game', GameSchema);

export default GameModel;
