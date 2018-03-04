import mongoose, { Schema } from 'mongoose';

const EndpointSchema = new Schema({
  startPage: String,
  goalPage: String,
  path: [String],
}, {
  toJSON: {
    virtuals: true,
  },
});

const EndpointModel = mongoose.model('GamePath', EndpointSchema);

export default EndpointModel;
