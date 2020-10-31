const mongoose = require("mongoose");

const { Schema } = mongoose;

const taskSchema = new Schema({
	title: {
		type: String,
		required: true,
		trim: true
	},
	description: {
		type: String,
		trim: true
	},
	completed: {
		type: Boolean,
	},
	project: {
		type: Schema.Types.ObjectId,
		ref: "Project",
		required: true
	},
	employees: [
		{
			type: Schema.Types.ObjectId,
			ref: "User"
		},
	],
	entries: [
		{
			type: Schema.Types.ObjectId,
			ref: "TimeSheetEntry"
		},
	],
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
