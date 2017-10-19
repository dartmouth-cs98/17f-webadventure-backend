import mongoose, { Schema } from 'mongoose';

const SnakeSchema = new Schema({
  NPC_Color: {
    r: Number,
    g: Number,
    b: Number,
  },
  curLocation: { type: Schema.Types.ObjectId, ref: 'Location' },
  Snake_Length: { type: Number },
}, {
  toJSON: {
    virtuals: true,
  },
});

const SnakeModel = mongoose.model('User', SnakeSchema);

export default SnakeModel;
