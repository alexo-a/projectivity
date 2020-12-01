const { gql } = require("apollo-server-express");

const typeDefs = gql`
type User {
	_id: ID
	username: String
	password: String
	email: String
	groups: [ProjectGroup]
}

type Auth {
	token: ID!
	user: User
}

type ProjectGroup {
	_id: ID
	title: String
	administrator: User
	managers: [User]
	employees: [User]
	projects: [Project]
}

type Project {
	_id: ID
	title: String
	description: String
	group: ProjectGroup
	managers: [User]
	tasks: [Task]
}

type Task {
	_id: ID
	title: String
	description: String
	completed: Boolean
	project: Project
	employees: [User]
	entries: [TimeSheetEntry]
}

type TimeSheetEntry {
	_id: ID
	user: User
	task: Task
	start: String
	end: String
	note: String
}

type ConversationMessage {
	_id: ID
	sender: User
	message: String
	sent: String
}

type Conversation {
	_id: ID
	participants: [User]
	messages: [ConversationMessage]
	read: [User]
}

type JobPosting {
	_id: ID
	title: String
	description: String
	owner: User
	group: ProjectGroup
	posted: String
}

type ProjectGroupListing {
	administrator: [ProjectGroup]
	member: [ProjectGroup]
}

type ProjectListing {
	administrator: [Project]
	manager: [Project]
	employee: [Project]
}

type JobPostingPage {
	page: Int
	pageSize: Int
	totalCount: Int
	postings: [JobPosting]
}

type Query {
	me: User
	user(email: String!): User
	findUser(searchField: String!): User
	users: [User]
	projects(groupId: ID): [Project]
	project(id: ID!): Project
	groupByProject(projectId: ID!): ProjectGroup
	tasks(projectId: ID!): [Task]
	task(id: ID!): Task
	timesheets(userId: ID, projectId: ID, taskId: ID, start: String, end: String): [TimeSheetEntry]
	myGroups: ProjectGroupListing
	myProjects: ProjectListing
	myTasks: [Task]
	myConversations: [Conversation]
	getJobPosting(postId: ID!): JobPosting
	searchJobPostings(searchString: String, page: Int!, pageSize: Int!): JobPostingPage
}

type Mutation {
	addUser(username: String!, email: String!, password: String!): Auth
	updateUser(username: String, email: String, password: String): User
	login(email: String!, password: String!): Auth
	addProjectGroup(title: String!): ProjectGroup
	updateProjectGroup(_id: ID!, title: String, administrator: ID): ProjectGroup
	addManagerToProjectGroup(groupId: ID!, userId: ID!): ProjectGroup
	removeManagerFromProjectGroup(groupId: ID!, userId: ID!): ProjectGroup
	addEmployeeToProjectGroup(groupId: ID!, userId: ID!): ProjectGroup
	removeEmployeeFromProjectGroup(groupId: ID!, userId: ID!): ProjectGroup
	addProject(groupId: ID!, title: String!, description: String): Project
	updateProject(_id: ID!, title: String, description: String): Project
	addManagerToProject(projectId: ID!, userId: ID!): Project
	removeManagerFromProject(projectId: ID!, userId: ID!): Project
	addTask(projectId: ID!, title: String!, description: String): Task
	updateTaskStatus(id: ID!, completed: Boolean!): Task
	addEmployeesToTask(taskId: ID!, userId: [ID!]): Task
	removeEmployeeFromTask(taskId: ID!, userId: ID!): Task
	addTimeSheetEntry(taskId: ID!, start: String!, end: String!, note: String): TimeSheetEntry
	updateTimeSheetEntry(entryId: ID!, start: String, end: String, note: String): TimeSheetEntry
	deleteTimeSheetEntry(entryId: ID!): String
	startConversation(participants: [ID!], initialMessage: String): Conversation
	joinConversation(conversationId: ID!, userId: ID!): Conversation
	leaveConversation(conversationId: ID!, userId: ID!): Conversation
	sendConversationMessage(conversationId: ID!, message: String!): Conversation
	markConversationRead(conversationId: ID!): Boolean
	addJobPosting(groupId: ID!, title: String!, description: String!): JobPosting
	updateJobPosting(postId: ID!, title: String, description: String): JobPosting
	deleteJobPosting(postId: ID!): Boolean
}
`;

module.exports = typeDefs;