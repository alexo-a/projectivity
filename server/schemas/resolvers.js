const { AuthenticationError } = require("apollo-server-express");
const { User, ProjectGroup, Project, Task, TimeSheetEntry, Conversation, JobPosting } = require("../models");
const { populate } = require("../models/User");
const { signToken } = require("../utils/auth");

const resolvers = {
	Query: {
		me: async (parent, args, context) => {
			if (context.user) {
			  const userData = await User.findOne({ _id: context.user._id })
				.select('-__v -password')
				.populate('groups');
		  
			  return userData;
			}
		  
			throw new AuthenticationError('Not logged in');
		},
		// get a user by username
		user: async (parent, { email }) => {
			return User.findOne({ email })
			.select("-__v -password")
			.populate("groups");
		},
		findUser: async (parent, { searchField }) => {
			return User.findOne({ $or: [ { username: searchField }, { email: searchField } ]})
			.select("-__v -password");
		},
		// get all users
		users: async () => {
			return User.find()
			// TODO - Populate anything?
		},
		projects: async (parent, { groupId }) => {
			return Project.find({ group: groupId })
			.populate("managers")
			.populate("tasks");
		},
		tasks: async (parent, { projectId }) => {
            return Task.find({ project: projectId })
                .populate("entries");
        },
		project: async (parent, { id }) => {
			const projectData = Project.findOne({ _id: id })
			.populate("managers")
			.populate({ path: 'tasks', populate: { path: "employees" } });
			return projectData
		},
		groupByProject: async (parent, { projectId }) => {
			return ProjectGroup.findOne({ projects: projectId })
			.populate("managers")
			.populate("employees")
			.populate('administrator');
			
		},
		task: async (parent, { id }) => {
			return Task.findOne({ _id: id })
			.populate('employees')
			.populate('project')
			.populate("entries");
		},
		timesheets: async (parent, { userId, projectId, taskId, start, end }, context) => {
			if (context.user) {
				if ((!userId) && (!projectId) && (!taskId)) {
					throw new Error("A user, project, or task must be specified!");
				}

				// Dynamically build the query filter.
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
					if (end) {
						searchFields.$and = [ { start: { $gte: start } }, { start: { $lt: end } } ];
					} else {
						searchFields.start = { $gte: start };
					}
				} else if (end) {
					searchFields.start = { $lt: end };
				}

                return await TimeSheetEntry.find(searchFields)
                .populate({path: "task", populate: {path: "project"}})
                .populate("user");
            }
			
			throw new AuthenticationError('Not logged in');
		},
		myGroups: async (parent, args, context) => {
			if (context.user) {
				let result = {};
				let groups = await ProjectGroup.find(
					{
						$or: [
							{ administrator: context.user._id },
							{ managers: context.user._id },
							{ employees: context.user._id }
						]
					}
				)
				.populate("administrator")
				.populate("managers")
				.populate("employees")
				.populate("projects");

				result.administrator = groups.filter(curGroup => curGroup.administrator._id == context.user._id);
				result.member = groups.filter(curGroup => curGroup.administrator._id != context.user._id);

				return result;
			}

			throw new AuthenticationError('Not logged in');
		},
		myProjects: async (parent, args, context) => {
			if (context.user) {
				let result = {};
				let processedList = [];

				// Pull project groups where the user is an administrator.
				const groups = await ProjectGroup.find({ administrator: context.user._id });
				// Strip project IDs.
				groups.forEach(curGroup => Array.prototype.push.apply(processedList, curGroup.projects.map(item => item.toString())));

				// Save the relevant projects.
				result.administrator = await Project.find({ _id: { $in: processedList }})
				.populate("managers")
				.populate("tasks");

				// Save projects where user is a manager, but also not an administrator.
				result.manager = await Project.find({
					$and: [
						{ managers: context.user._id },
						{ _id: { $nin: processedList } }
					]
				})
				.populate("managers")
				.populate("tasks");

				// Add the project IDs as manager to the list of items we've already processed.
				Array.prototype.push.apply(processedList, result.manager.map(project => project._id.toString()));

				// Users are assigned at the task level...
				const tasks = await Task.find({ employees: context.user._id });
				// Strip out project IDs, then remove duplicates and those that are already processed.
				const projectList = tasks.map(task => task.project).filter((value, index, self) => {
					return ((processedList.indexOf(value.toString()) == -1) && (self.indexOf(value) === index));
				});

				// User our list to save projects where the user is assigned to a task as a regular old employee.
				result.employee = await Project.find({ _id: { $in: projectList }})
				.populate("managers")
				.populate("tasks");

				return result;
			}

			throw new AuthenticationError('You need to be logged in!');
		},
		myTasks: async (parent, args, context) => {
			if (context.user) {
				return Task.find({ employees: context.user._id })
                .populate("employees")
				//.populate("project");
				.populate({ path: 'project', populate: { path: "managers" } });
			}

			throw new AuthenticationError('You need to be logged in!');
		},
		myConversations: async (parent, args, context) => {
			if (context.user) {
				return Conversation.find({ participants: context.user._id })
				.populate("participants")
				.populate({path: "messages", populate: {path: "sender"}});
			}

			throw new AuthenticationError('You need to be logged in!');
		},
		getJobPosting: async (parent, {postId}, context) => {
			return JobPosting.findById(postId)
			.populate("owner")
			.populate("group");
		},
		searchJobPostings: async (parent, { searchString, page, pageSize}, context) => {
			const searchFilter = (searchString) ? { $text: { $search: searchString } } : {};
			const totalCount = await JobPosting.find(searchFilter).countDocuments();
			const postings = await JobPosting.find(searchFilter).populate("owner")
												.populate("group")
												.sort({ posted: -1 })
												.skip(page * pageSize)
												.limit(pageSize);

			return {
				page,
				pageSize,
				totalCount,
				postings
			};
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
				return await User.findByIdAndUpdate(context.user._id, args, { new: true }).populate("groups");
			}
		
			throw new AuthenticationError("Not logged in");
		},
		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email }).collation({ locale: 'en_US', strength: 2 }).populate("groups");
		
			if (!user) {
				throw new AuthenticationError("No User");
			}
		
			const correctPw = await user.isCorrectPassword(password);
		
			if (!correctPw) {
				throw new AuthenticationError("Incorrect Password");
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
		addProject: async(parent, { groupId, title, description }, context) => {
			if (context.user) {
				const project = await Project.create({ group: groupId, title, description });
			
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
		addTask: async(parent, { projectId, title, description }, context) => {
			if (context.user) {
				const task = await Task.create({ project: projectId, title, description });
			
				await Project.findOneAndUpdate(
					{ _id: projectId },
					{ $addToSet: { tasks: task._id } },
					{ new: true }
				);
			
				return task;
			}
			
			throw new AuthenticationError('You need to be logged in!');
		},
		updateTaskStatus: async(parent, { id, completed }, context) => {
			if (context.user) {
				const response = await Task.findOneAndUpdate({ _id: id }, { $set: { completed: completed }}, { new: true });
				return response; 
			}
			
			throw new AuthenticationError("You need to be logged in!");
		},
		addEmployeesToTask: async(parent, { taskId, userId }, context) => {
			if (context.user) {				
				const task = await Task.findByIdAndUpdate(
					{ _id: taskId },
					{ employees: userId },
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
				).populate('employees');
			
				return task;
			}
			
			throw new AuthenticationError("You need to be logged in!");
		},
		addTimeSheetEntry: async(parent, { taskId, start, end, note }, context) => {
			if (context.user) {
				const timeSheetEntry = await TimeSheetEntry.create({ task: taskId, start, end, note, user: context.user._id });
		  
				await Task.updateOne({ _id: taskId }, { $addToSet: { entries: timeSheetEntry } });
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
		deleteTimeSheetEntry: async(parent, args, context) => {
			if (context.user) {
				await TimeSheetEntry.findByIdAndDelete(args.entryId);
				return "Success!";
			}
			
			throw new AuthenticationError("You need to be logged in!");
		},
		startConversation: async (parent, { participants, initialMessage }, context) => {
			if (context.user) {
				const convo = await Conversation.create({
					participants,
					messages: [
						{
							sender: context.user._id,
							message: initialMessage
						}
					],
					read: [ context.user._id ]
				});

				// TODO - Do we really NEED to immediately query the Conversation we just made???
				return await Conversation.findById(convo._id).populate("participants").populate({path: "messages", populate: {path: "sender"}});
			}

			throw new AuthenticationError("You need to be logged in!");
		},
		joinConversation: async (parent, { conversationId, userId }, context) => {
			if (context.user) {
				return await Conversation.findByIdAndUpdate(conversationId, {
					$addToSet: {
						participants: userId
					}
				},
				{ new: true })
				.populate("participants")
				.populate({path: "messages", populate: {path: "sender"}});
			}

			throw new AuthenticationError("You need to be logged in!");
		},
		leaveConversation: async (parent, { conversationId, userId }, context) => {
			if (context.user) {
				return await Conversation.findByIdAndUpdate(conversationId, {
					$pull: {
						participants: userId
					}
				},
				{ new: true })
				.populate("participants")
				.populate({path: "messages", populate: {path: "sender"}});
			}

			throw new AuthenticationError("You need to be logged in!");
		},
		sendConversationMessage: async (parent, { conversationId, message }, context) => {
			if (context.user) {
				return await Conversation.findByIdAndUpdate(conversationId, {
					$push: {
						messages: {
							sender: context.user._id,
							message
						}
					},
					read: [ context.user._id ]
				},
				{ new: true, runValidators: true })
				.populate("participants")
				.populate({path: "messages", populate: {path: "sender"}});
			}

			throw new AuthenticationError("You need to be logged in!");
		},
		markConversationRead: async (parent, { conversationId }, context) => {
			if (context.user) {
				await Conversation.findByIdAndUpdate(conversationId, {
					$addToSet: {
						read: context.user._id
					}
				},
				{ new: true });

				return true;
			}

			throw new AuthenticationError("You need to be logged in!");
		},
		addJobPosting: async (parent, { groupId, title, description }, context) => {
			if (context.user) {
				return JobPosting.create({group: groupId, owner: context.user._id, title, description });
			}

			throw new AuthenticationError("You need to be logged in!");
		},
		updateJobPosting: async (parent, args, context) => {
			if (context.user) {
				return JobPosting.findOneAndUpdate({ _id: args.postId, owner: context.user._id }, args, { new: true })
				.populate("group")
				.populate("owner");
			}

			throw new AuthenticationError("You need to be logged in!");
		},
		deleteJobPosting: async (parent, { postId }, context) => {
			if (context.user) {
				const result = await JobPosting.findOneAndDelete({ _id: postId, owner: context.user._id });

				return !!result;
			}

			throw new AuthenticationError("You need to be logged in!");
		}
	}
};

module.exports = resolvers;