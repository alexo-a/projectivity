const { gql } = require("apollo-server-express");

const typeDefs = gql`
type User {
	_id: ID
	firstName: String
	lastName: String
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

type Auth {
    token: ID
    user: User
}

type Query {
<<<<<<< HEAD
	user(email: String!): User
	users: [User]
	projects(groupId: ID): [Project]
	tasks(projectId: ID!): [Task]
	timesheets(userId: ID, projectId: ID, taskId: ID, start: String, end: String): [TimeSheetEntry]
	myProjects: [Project]
	myTasks: [Task]
=======
	
>>>>>>> feature/routing
}

type Mutation {
	addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
	updateUser(firstName: String, lastName: String, email: String, password: String): User
	login(email: String!, password: String!): Auth
	addProjectGroup(title: String!): ProjectGroup
	updateProjectGroup(_id: ID!, title: String, administrator: ID): ProjectGroup
	addManagerToProjectGroup(groupId: ID!, userId: ID!): ProjectGroup
	removeManagerFromProjectGroup(groupId: ID!, userId: ID!): ProjectGroup
	addEmployeeToProjectGroup(groupId: ID!, userId: ID!): ProjectGroup
	removeEmployeeFromProjectGroup(groupId: ID!, userId: ID!): ProjectGroup
	addProject(groupId: ID!, title: String!): Project
	updateProject(_id: ID!, title: String, description: String): Project
	addManagerToProject(projectId: ID!, userId: ID!): Project
	removeManagerFromProject(projectId: ID!, userId: ID!): Project
	addTask(projectId: ID!, title: String!): Task
	updateTask(_id: ID!, title: String, description: String): Task
	addEmployeeToTask(taskId: ID!, userId: ID!): Task
	removeEmployeeFromTask(taskId: ID!, userId: ID!): Task
	addTimeSheetEntry(taskId: ID!, start: String!, end: String!, note: String): TimeSheetEntry
	updateTimeSheetEntry(entryId: ID!, start: String, end: String, note: String): TimeSheetEntry
}
`;

// TODO - Logged in user gets owned ProjectGroups!

module.exports = typeDefs;