import mongoose, { Schema } from 'mongoose';

/* 
Content {
  Content_ID, <wikipedia URL>
  Section_ID, <char>
  Players_ID, <char>
}
*/

// const ObjectId = mongoose.Schema.Types.ObjectId;
å
const ContentSchema = new Schema({
  Content_ID: { type: String, unique: true },
  Section_ID: { type: Number},
  Players_ID: [{
    type: Schema.Types.ObjectId, ref: 'User',
  }],
}, {
  toJSON: {
    virtuals: true,
  },
});

const ContentModel = mongoose.model('Content', ContentSchema);

export default ContentModel;
