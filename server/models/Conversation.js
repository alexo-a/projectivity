const mongoose = require("mongoose");

const { Schema } = mongoose;

const conversationMessageSchema = new Schema({
	sender: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	message: {
		type: String,
		maxlength: 255,
		required: true,
	},
	sent: {
		type: Date,
		default: Date.now,
	},
});

const conversationSchema = new Schema({
	participants: [
		{
			type: Schema.Types.ObjectId,
			ref: "User"
		},
	],
	messages: [conversationMessageSchema],
	// This is a list of users who have read the conversation.  Whenever a new message is sent, it is cleared except for the sender.
	read: [
		{
			type: Schema.Types.ObjectId,
			ref: "User"
		}
	],
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;