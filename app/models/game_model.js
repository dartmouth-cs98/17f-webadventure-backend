import mongoose, { Schema } from 'mongoose';

const GameSchema = new Schema({
  startPage: { type: String },
  goalPage: { type: String },
  host: { type: Schema.Types.ObjectId, ref: 'User' },
  // hostUsername: { type: String },
  playersInformation: [{
    path: [{ type: String }],
    secsElapsed: { type: Number },
    numClicks: { type: Number },
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
