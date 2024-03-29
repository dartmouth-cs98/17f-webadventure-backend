import mongoose, { Schema } from 'mongoose';

const GameSchema = new Schema({
  startPage: String,
  goalPage: String,
  host: String,
  isPrivate: { type: Boolean, default: false },
  players: [{
    finishTime: Number,
    numClicks: Number,
    username: String,
    curUrl: String,
  }],
  path: [String],
  active: { type: Boolean, default: false },
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
