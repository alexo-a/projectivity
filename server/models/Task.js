const mongoose = require("mongoose");

const { Schema } = mongoose;
const User = require("./User");
const Project = require("./Project");
const TimeSheetEntry = require("./TimeSheetEntry");

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
	project: Project.schema,
	employees: [User.schema],
	entries: [TimeSheetEntry.schema]
});

const Task = mongoose.model("Project", taskSchema);

module.exports = Task;
