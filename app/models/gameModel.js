import mongoose, { Schema } from 'mongoose';

const GameSchema = new Schema({
  startPage: String,
  goalPage: String,
  host: { type: Schema.Types.ObjectId, ref: 'User' },
  players: [{
    finishTime: Number,
    numClicks: Number,
    username: String,
    curUrl: String,
  }],
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
