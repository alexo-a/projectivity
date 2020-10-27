const mongoose = require("mongoose");

const { Schema } = mongoose;
const User = require("./User");
const ProjectGroup = require("./ProjectGroup");

const projectSchema = new Schema({
	title: {
		type: String,
		required: true,
		trim: true
	},
	parent: ProjectGroup.schema,
	managers: [User.schema],
	employees: [User.schema]
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
