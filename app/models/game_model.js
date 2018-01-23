import mongoose, { Schema } from 'mongoose';

const GameSchema = new Schema({
  start_page: { type: String },
  goal_page: { type: String },
  // host: { type: Schema.Types.ObjectId, ref: 'User' }, // or should be stored as string?
  host: { type: String },
  // hostUsername: { type: String },
  players_scores: [{
    path: [{ type: String }],
    secsElapsed: { type: Number },
    numClicks: { type: Number },
    // player_username: { type: String },
    player: { type: Schema.Types.ObjectId, ref: 'User' },
  }],
  active: { type: Boolean, default: false },
  // createdAt: { type: Date, default: Date.now },
},
  {
    timestamps: { createdAt: 'created_at' },
  },
  {
    toJSON: {
      virtuals: true,
    },
  });

const GameModel = mongoose.model('Game', GameSchema);

export default GameModel;
