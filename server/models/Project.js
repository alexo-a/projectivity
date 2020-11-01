const mongoose = require("mongoose");

const { Schema } = mongoose;

const projectSchema = new Schema({
	title: {
		type: String,
		required: true,
		trim: true
	},
	description: {
		type: String,
		trim: true
	},
	group: {
		type: Schema.Types.ObjectId,
		ref: "ProjectGroup",
		required: true
	},
	managers: [
		{
			type: Schema.Types.ObjectId,
			ref: "User"
		},
	],
	tasks: [
		{
			type: Schema.Types.ObjectId,
			ref: "Task"
		},
	],
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
