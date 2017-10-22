import mongoose, { Schema } from 'mongoose';

/*
Questions {
	Question_ID, <char>
	Question, <string>
	Answer, <string>
}
*/

const QuestionSchema = new Schema({
  Question_ID: { type: Number, unique: true },
  Question: { type: String },
  Answer: { type: String },
}, {
  toJSON: {
    virtuals: true,
  },
});

const QuestionModel = mongoose.model('Question', QuestionSchema);

export default QuestionModel;
