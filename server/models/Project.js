const mongoose = require("mongoose");

const { Schema } = mongoose;

const projectSchema = new Schema({
	title: {
		type: String,
		required: true,
		trim: true
	},
<<<<<<< HEAD
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
=======
	managers: [User.schema],
	employees: [User.schema]
>>>>>>> feature/routing
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
