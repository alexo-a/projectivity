const mongoose = require("mongoose");

const { Schema } = mongoose;
const User = require("./User");
const ProjectGroup = require("./ProjectGroup");
const Task = require("./Task");

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
	group: ProjectGroup.schema,
	managers: [User.schema],
	tasks: [Task.schema]
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
