location_model.js

/*
Location {
	Section_ID, <Number of Section>
	Sentence_Number, <int>
	Word_Number, <int>
	Player_ID, <char> // this is the player’s ID
}
*/

const LocationSchema = new Schema({
  Section_ID: { type: Number},
  Sentence_ID: { type: Number},		// Sentence_Number???
  Word_ID: { type: Number},			// Word_Number???
  Player_ID: { type: Number}
}, {
  toJSON: {
    virtuals: true,
  },
});

const LocationModel = mongoose.model('Location', LocationSchema);

export default LocationModel;
