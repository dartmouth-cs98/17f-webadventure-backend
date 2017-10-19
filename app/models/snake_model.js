import mongoose, { Schema } from 'mongoose';

/*
Snakes {
Snake_ID,
	NPC_Color,
	Location,
	Snake_Length, /// for now, it can just be 1
	}
*/

const ObjectId = mongoose.Schema.Types.ObjectId;

const SnakeSchema = new Schema({
  NPC_Color: {
    r: Number,
    g: Number,
    b: Number,
  },
  curLocation: ObjectId, 			// why objectID??
  Snake_Length: { type: Number}
}, {
  toJSON: {
    virtuals: true,
  },
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;