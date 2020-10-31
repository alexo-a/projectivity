const { AuthenticationError } = require("apollo-server-express");
const { User, ProjectGroup, Project, Task, TimeSheetEntry } = require("../models");
const { populate } = require("../models/User");
const { signToken } = require("../utils/auth");

const resolvers = {
	Query: {
		// get a user by username
		user: async (parent, { email }) => {
			return User.findOne({ email })
			.select("-__v -password")
			.populate("groups");
			// TODO - Populate anything?
		},
		// get all users
		users: async () => {
			return User.find()
			.select("-__v -password");
			// TODO - Populate anything?
		},
		projects: async (parent, { groupId }) => {
			return Project.find({ group: groupId })
			.populate("managers")
			.populate("tasks");
		},
		tasks: async (parent, { taskId }) => {
			return Task.find({ task: taskId })
			.populate("entries");
		},
		timesheets: async (parent, { userId, projectId, taskId, start, end }, context) => {
			if (context.user) {
				if ((!userId) && (!projectId) && (!taskId)) {
					throw new Error("A user, project, or task must be specified!");
				}

				let searchFields = {};

				if (userId) {
					searchFields.user = userId;
				}

				if (taskId) {
					searchFields.task = taskId;
				} else if (projectId) {
					const project = await Project.findById(projectId);

					searchFields.task = { $in: project.tasks };
				}

				if (start) {
					searchFields.start = { $gte: Date.parse(start) };
				}

				if (end) {
					searchFields.end = { $lte: Date.parse(end) };
				}

				return await TimeSheetEntry.find(searchFields);
			}
			
			throw new AuthenticationError('Not logged in');
		},
		myProjects: async (parent, args, context) => {
			if (context.user) {
				// Users are assigned at the task level...
				const tasks = await Task.find({ employees: context.user._id });
				// Strip out project IDs, then remove duplicates.
				const projectList = tasks.map(task => task.project).filter((value, index, self) => { return self.indexOf(value) === index; });

				return Project.find({ $or: [ { _id: { $in: projectList } }, { managers: context.user._id } ]})
				.populate("managers")
				.populate("tasks");
			}

			throw new AuthenticationError('You need to be logged in!');
		},
		myTasks: async (parent, args, context) => {
			if (context.user) {
				return Task.find({ employees: context.user._id })
				.populate("employees");
			}

			throw new AuthenticationError('You need to be logged in!');
		}
	},
	Mutation: {
		addUser: async (parent, args) => {
			const user = await User.create(args);
			const token = signToken(user);
		
			return { token, user };
		},
		updateUser: async (parent, args, context) => {
			if (context.user) {
				return await User.findByIdAndUpdate(context.user._id, args, { new: true });
			}
		
			throw new AuthenticationError("Not logged in");
		},
		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email }).populate("groups");
		
			if (!user) {
				throw new AuthenticationError("Incorrect credentials");
			}
		
			const correctPw = await user.isCorrectPassword(password);
		
			if (!correctPw) {
				throw new AuthenticationError("Incorrect credentials");
			}
		
			const token = signToken(user);
		
			return { token, user };
		},
		addProjectGroup: async(parent, args, context) => {
			if (context.user) {
				const projectGroup = await ProjectGroup.create({ ...args, administrator: context.user._id });
			
				await User.findByIdAndUpdate(
					{ _id: context.user._id },
					{ $addToSet: { groups: projectGroup._id } },
					{ new: true }
				);

				return projectGroup;
			}
			
			throw new AuthenticationError('You need to be logged in!');
		},
		updateProjectGroup: async(parent, args, context) => {
			if (context.user) {
				return await (await ProjectGroup.findByIdAndUpdate(args._id, args, { new: true }))
				.populate("managers")
				.populate("employees");
			}
			
			throw new AuthenticationError("You need to be logged in!");
		},
		addManagerToProjectGroup: async(parent, { groupId, userId }, context) => {
			if (context.user) {
				const projectGroup = await ProjectGroup.findOneAndUpdate(
					{ _id: groupId, administrator: context.user._id },
					{ $addToSet: { managers: userId } },
					{ new: true }
				)
				.populate("managers")
				.populate("employees");
			
				return projectGroup;
			}
			
			throw new AuthenticationError("You need to be logged in!");
		},
		removeManagerFromProjectGroup: async(parent, { groupId, userId }, context) => {
			if (context.user) {
				const projectGroup = await ProjectGroup.findOneAndUpdate(
					{ _id: groupId, administrator: context.user._id },
					{ $pull: { managers: userId } },
					{ new: true }
				)
				.populate("managers")
				.populate("employees");
			
				return projectGroup;
			}
			
			throw new AuthenticationError("You need to be logged in!");
		},
		addEmployeeToProjectGroup: async(parent, { groupId, userId }, context) => {
			if (context.user) {
				const projectGroup = await ProjectGroup.findOneAndUpdate(
					{ _id: groupId, administrator: context.user._id },
					{ $addToSet: { employees: userId } },
					{ new: true }
				)
				.populate("managers")
				.populate("employees");
			
				return projectGroup;
			}
			
			throw new AuthenticationError("You need to be logged in!");
		},
		removeEmployeeFromProjectGroup: async(parent, { groupId, userId }, context) => {
			if (context.user) {
				const projectGroup = await ProjectGroup.findOneAndUpdate(
					{ _id: groupId, administrator: context.user._id },
					{ $pull: { employees: userId } },
					{ new: true }
				)
				.populate("managers")
				.populate("employees");
			
				return projectGroup;
			}
			
			throw new AuthenticationError("You need to be logged in!");
		},
		addProject: async(parent, { groupId, title }, context) => {
			if (context.user) {
				const project = await Project.create({ group: groupId, title });
			
				await ProjectGroup.findOneAndUpdate(
					{ _id: groupId, administrator: context.user._id },
					{ $addToSet: { projects: project._id } },
					{ new: true }
				);
			
				return project;
			}
			
			throw new AuthenticationError('You need to be logged in!');
		},
		updateProject: async(parent, args, context) => {
			if (context.user) {
				return await Project.findByIdAndUpdate(args._id, args, { new: true });
			}
			
			throw new AuthenticationError("You need to be logged in!");
		},
		addManagerToProject: async(parent, { projectId, userId }, context) => {
			if (context.user) {
				const project = await Project.findByIdAndUpdate(
					{ _id: projectId },
					{ $addToSet: { managers: userId } },
					{ new: true }
				)
				.populate("managers")
				.populate("tasks");
			
				return project;
			}
			
			throw new AuthenticationError("You need to be logged in!");
		},
		removeManagerFromProject: async(parent, { projectId, userId }, context ) => {
			if (context.user) {
				const project = await Project.findByIdAndUpdate(
					{ _id: projectId },
					{ $pull: { managers: userId } },
					{ new: true }
				)
				.populate("managers")
				.populate("tasks");
			
				return project;
			}
			
			throw new AuthenticationError("You need to be logged in!");
		},
		addTask: async(parent, { projectId, title }, context) => {
			if (context.user) {
				const task = await Task.create({ project: projectId, title });
			
				await Project.findOneAndUpdate(
					{ _id: projectId },
					{ $addToSet: { tasks: task._id } },
					{ new: true }
				);
			
				return task;
			}
			
			throw new AuthenticationError('You need to be logged in!');
		},
		updateTask: async(parent, args, context) => {
			if (context.user) {
				return await Task.findByIdAndUpdate(args._id, args, { new: true })
				.populate("employees");
			}
			
			throw new AuthenticationError("You need to be logged in!");
		},
		addEmployeeToTask: async(parent, { taskId, userId }, context) => {
			if (context.user) {
				const task = await Task.findByIdAndUpdate(
					{ _id: taskId },
					{ $addToSet: { employees: userId } },
					{ new: true }
				)
				.populate("employees");
			
				return task;
			}
			
			throw new AuthenticationError("You need to be logged in!");
		},
		removeEmployeeFromTask: async(parent, { taskId, userId }, context) => {
			if (context.user) {
				const task = await Task.findByIdAndUpdate(
					{ _id: taskId },
					{ $pull: { employees: userId } },
					{ new: true }
				);
			
				return task;
			}
			
			throw new AuthenticationError("You need to be logged in!");
		},
		addTimeSheetEntry: async(parent, { taskId, start, end, note }, context) => {
			if (context.user) {
				const timeSheetEntry = await TimeSheetEntry.create({ task: taskId, start, end, note, user: context.user._id });
		  
				return timeSheetEntry;
			}
		  
			throw new AuthenticationError('You need to be logged in!');
		},
		updateTimeSheetEntry: async(parent, args, context) => {
			if (context.user) {
				return await TimeSheetEntry.findByIdAndUpdate(args.entryId, args, { new: true });
			}
			
			throw new AuthenticationError("You need to be logged in!");
		},
	}
};

module.exports = resolvers;