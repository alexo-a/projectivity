const { AuthenticationError } = require("apollo-server-express");
const { User, ProjectGroup, Project, TimeSheetEntry } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
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
				const projectGroup = await Project.create({ ...args, administrator: context.user._id });
			
				await User.findByIdAndUpdate(
					{ _id: context.user._id },
					{ $push: { groups: projectGroup._id } },
					{ new: true }
				);
			
				return projectGroup;
			}
			
			throw new AuthenticationError('You need to be logged in!');
		},
		updateProjectGroup: async(parent, args, context) => {
			if (context.user) {
				return await ProjectGroup.findByIdAndUpdate(args._id, args, { new: true });
			}
			
			throw new AuthenticationError("Not logged in");
		},
		addManagerToProjectGroup: async(parent, { groupId, userId }, context) => {
			if (context.user) {
				const projectGroup = await ProjectGroup.findOneAndUpdate(
					{ _id: groupId, administrator: context.user._id },
					{ $addToSet: { managers: userId } },
					{ new: true }
				);
			
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
				);
			
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
				);
			
				return projectGroup;
			}
			
			throw new AuthenticationError("You need to be logged in!");
		},
		removeEmployeeFromProjectGroup: async(parent, { groupId, userId }, context) => {
			if (context.user) {
				const projectGroup = await ProjectGroup.findOneAndUpdate(
					{ _id: groupId, administrator: context.user._id },
					{ $addToSet: { employees: userId } },
					{ new: true }
				);
			
				return projectGroup;
			}
			
			throw new AuthenticationError("You need to be logged in!");
		},
		addProject: async(parent, { groupId, title }, context) => {
			if (context.user) {
				const project = await Project.create({ group: groupId, title });
			
				await ProjectGroup.findOneAndUpdate(
					{ _id: groupId, administrator: context.user._id },
					{ $push: { projects: project._id } },
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
			
			throw new AuthenticationError("Not logged in");
		},
		addManagerToProject: async(parent, { projectId, userId }, context) => {
			if (context.user) {
				const project = await Project.findByIdAndUpdate(
					{ _id: projectId },
					{ $addToSet: { managers: userId } },
					{ new: true }
				);
			
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
				);
			
				return project;
			}
			
			throw new AuthenticationError("You need to be logged in!");
		},
		addTask: async(parent, { projectId, title }, context) => {
			if (context.user) {
				const task = await Task.create({ project: projectId, title });
			
				await Project.findOneAndUpdate(
					{ _id: projectId },
					{ $push: { tasks: task._id } },
					{ new: true }
				);
			
				return task;
			}
			
			throw new AuthenticationError('You need to be logged in!');
		},
		updateTask: async(parent, args, context) => {
			if (context.user) {
				return await Task.findByIdAndUpdate(args._id, args, { new: true });
			}
			
			throw new AuthenticationError("Not logged in");
		},
		addEmployeeToTask: async(parent, { taskId, userId }, context) => {
			if (context.user) {
				const task = await Task.findByIdAndUpdate(
					{ _id: taskId },
					{ $addToSet: { employees: userId } },
					{ new: true }
				);
			
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
		addTimeSheetEntry: async(parent, args, context) => {
			if (context.user) {
				const timeSheetEntry = await timeSheetEntry.create({ ...args, userId: context.user._id });
		  
				return timeSheetEntry;
			}
		  
			throw new AuthenticationError('You need to be logged in!');
		},
		updateTimeSheetEntry: async(parent, args, context) => {
			if (context.user) {
				return await TimeSheetEntry.findByIdAndUpdate(args._id, args, { new: true });
			}
			
			throw new AuthenticationError("Not logged in");
		},
	}
};

module.exports = resolvers;