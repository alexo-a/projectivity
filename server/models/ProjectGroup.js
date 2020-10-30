const mongoose = require("mongoose");

const { Schema } = mongoose;
const User = require("./User");
const Project = require("./Project");

const projectGroupSchema = new Schema({
	title: {
		type: String,
		required: true,
		trim: true
	},
	administrator: User.schema,
	managers: [User.schema],
	employees: [User.schema],
	projects: [Project.schema]
});

const ProjectGroup = mongoose.model("ProjectGroup", projectGroupSchema);

module.exports = ProjectGroup;