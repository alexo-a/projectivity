const mongoose = require("mongoose");

const { Schema } = mongoose;

const timeSheetEntrySchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	task: {
		type: Schema.Types.ObjectId,
		ref: "Task",
		required: true
	},
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