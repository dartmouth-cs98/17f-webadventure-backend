import mongoose, { Schema } from 'mongoose';

/*
Section {
	Section_ID, <char>
	Sentence_ID, <char> // there will be a list of sentences
	Player_Occupants, <char, can be None>
	}
*/

const SectionSchema = new Schema({
  Section_ID: { type: Number, unique: true },
  Sentence_ID: [{
    type: Schema.Types.ObjectId, ref: 'Sentence',
  }],
  Player_Occupants: [{
    type: Schema.Types.ObjectId, ref: 'User',
  }],
}, {
  toJSON: {
    virtuals: true,
  },
});

const SectionModel = mongoose.model('Section', SectionSchema);

export default SectionModel;
