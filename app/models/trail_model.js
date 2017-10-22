import mongoose, { Schema } from 'mongoose';

const TrailSchema = new Schema({
  trailID: { type: Number, unique: true }, // string or int for ID?
  startSentenceID: Number,
  currentSentenceID: Number,
  trailStartWord: String,
  trailEndWorld: String,
  highlightcolor: {
    r: Number,
    g: Number,
    b: Number,
  },
}, {
  toJSON: {
    virtuals: true,
  },
});

const TrailModel = mongoose.model('Trail', TrailSchema);

export default TrailModel;
