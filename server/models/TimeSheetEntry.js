const mongoose = require("mongoose");

const { Schema } = mongoose;
const User = require("./User");
const Project = require("./Project");

const timeSheetEntrySchema = new Schema({
	user: User.schema,
	project: Project.schema,
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
});

const TimeSheetEntry = mongoose.model("TimeSheetEntry", timeSheetEntrySchema);

module.exports = TimeSheetEntry;