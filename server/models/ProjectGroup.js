const mongoose = require("mongoose");

const { Schema } = mongoose;

const projectGroupSchema = new Schema({
	title: {
		type: String,
		required: true,
		trim: true
	},
	administrator: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	managers: [
		{
			type: Schema.Types.ObjectId,
			ref: "User"
		},
	],
	employees: [
		{
			type: Schema.Types.ObjectId,
			ref: "User"
		},
	],
	projects: [
		{
			type: Schema.Types.ObjectId,
			ref: "Project"
		},
	],
});

const ProjectGroup = mongoose.model("ProjectGroup", projectGroupSchema);

module.exports = ProjectGroup;