import mongoose, { Schema } from 'mongoose';

/* 
Sentence {
	Sentence_ID, <char>
	Sentence_Owner, <char>
	Question_ID, <char>
	Power_Attribute, <char, only X number of attributes allowed>
	Sentence_Points, <int>
}
*/

const SentenceSchema = new Schema({
  Sentence_ID: { type: Number, unique: true },
  Section_Owner: { type: Number},
  Question_ID: { type: Number},
  Power_Attribute: { type: Number},
  Sentence_Points: { type: Number},
  Words_ID: [{
    type: Schema.Types.ObjectId, ref: 'Word',
  }],
}, {
  toJSON: {
    virtuals: true,
  },
});

const SentenceModel = mongoose.model('Sentence', SentenceSchema);

export default SentenceModel;
