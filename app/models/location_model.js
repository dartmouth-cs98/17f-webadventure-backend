import mongoose, { Schema } from 'mongoose';

/*
Location {
	Section_ID, <Number of Section>
	Sentence_Number, <int>
	Word_Number, <int>
	Player_ID, <char> // this is the player’s ID
}
*/

const LocationSchema = new Schema({
  hashKey: { type: String, unique: true },
  url: { type: String },
  sectionID: { type: Number },
  sentenceID: { type: Number },
  character: { type: Number },
  playerUsername: { type: String },
}, {
  toJSON: {
    virtuals: true,
  },
});

const LocationModel = mongoose.model('Location', LocationSchema);

export default LocationModel;
