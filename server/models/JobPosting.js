const mongoose = require("mongoose");

const { Schema } = mongoose;

const jobPostingSchema = new Schema({
	title: {
		type: String,
		required: true,
		trim: true
	},
	description: {
		type: String,
		trim: true
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	group: {
		type: Schema.Types.ObjectId,
		ref: "ProjectGroup",
		required: true
	},
	posted: {
		type: Date,
		default: Date.now,
	}
});

jobPostingSchema.index({ title: "text", description: "text"});

const JobPosting = mongoose.model("JobPosting", jobPostingSchema);

module.exports = JobPosting;
