import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const CREATE_PROJECT_GROUP = gql`
mutation createProjectGroup($title: String!) {
  addProjectGroup(title: $title) {
    _id
    title
    managers
    employees
    projects
  }
}
`;

export const ADD_MANAGER_TO_GROUP = gql`
mutation addManagerToProjectGroup($groupId: ID!, $userId: ID!) {
  addManagerToProjectGroup(groupId: $groupId, userId: $userId) {
    managers {
      _id
      username
    }
  }
}
`;

export const ADD_EMPLOYEE_TO_GROUP = gql`
mutation addEmployeeToProjectGroup($groupId: ID!, $userId: ID!) {
  addEmployeeToProjectGroup(groupId: $groupId, userId: $userId) {
    employees {
      _id
      username
    }
  }
}
`;

export const ADD_TIMESHEET_ENTRY = gql`
  mutation addTimeSheetEntry($taskId: ID!, $start: String!, $end: String!, $note: String) {
    addTimeSheetEntry(taskId: $taskId, start: $start, end: $end, note: $note) {
      _id
    }
  }
`;