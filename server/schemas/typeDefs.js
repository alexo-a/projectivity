const { gql } = require("apollo-server-express");

const typeDefs = gql`
type User {
	_id: ID
	firstName: String
	lastName: String
	email: String
}

type ProjectGroup {
	_id: ID
	title: String
	administrator: User
	managers: [User]
	employees: [User]
}

type Project {
	_id: ID
	title: String
	managers: [User]
	employees: [User]
}

type TimeSheetEntry {
	_id: ID
	user: User
	project: Project
	start: String
	end: String
}

type Query {
}

type Mutation {
	addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
	updateUser(firstName: String, lastName: String, email: String, password: String): User
	login(email: String!, password: String!): Auth
}
`;

module.exports = typeDefs;