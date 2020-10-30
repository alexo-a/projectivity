const mongoose = require("mongoose");

const { Schema } = mongoose;
const User = require("./User");
const Task = require("./Task");

const timeSheetEntrySchema = new Schema({
	user: User.schema,
	task: Task.schema,
	start: {
		type: Date,
		default: Date.now,
		required: true
	},
	end: {
		type: Date,
		default: Date.now,
		required: true
	},
	note: {
		type: String,
		trim: true
	}
});

const TimeSheetEntry = mongoose.model("TimeSheetEntry", timeSheetEntrySchema);

module.exports = TimeSheetEntry;