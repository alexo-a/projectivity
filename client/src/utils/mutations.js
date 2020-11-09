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

export const CREATE_PROJECT = gql`
mutation createProject($groupId: ID!, $title: String!, $description: String) {
  addProject(groupId: $groupId, title: $title, description: $description) {
    _id
    title
    description
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

export const UPDATE_TIMESHEET_ENTRY = gql`
mutation updateTimeSheetEntry($entryId: ID!, $start: String, $end: String, $note: String) {
  updateTimeSheetEntry(entryId: $entryId, start: $start, end: $end, note: $note) {
    _id
    user {
      _id
    }
    task {
      _id
      title
    }
    start
    end
    note
  }
}
`;

export const DELETE_TIMESHEET_ENTRY = gql`
mutation deleteTimeSheetEntry($entryId: ID!) {
  deleteTimeSheetEntry(entryId: $entryId)
}
`;

export const REMOVE_EMPLOYEE_FROM_TASK = gql`
  mutation removeEmployeeFromTask($taskId: ID!, $userId: ID!) {
    removeEmployeeFromTask(taskId: $taskId, userId: $userId) {
      _id
      title
      description
      completed
      employees {
        _id
        username
      }
    }
  }
`;

export const UPDATE_EMPLOYEES_TASK =gql`
  mutation addEmployeesToTask($userId: [ID!], $taskId: ID!) {
    addEmployeesToTask(userId: $userId, taskId: $taskId) {
      _id
      title
      description
      completed
      employees {
        _id
        username
      }
    }
  }
`
export const UPDATE_TASK_STATUS = gql `
  mutation updateTaskStatus($id: ID!, $completed: Boolean!) {
    updateTaskStatus(id: $id, completed: $completed) {
      _id
      title
      completed
    }
  }
`
export const ADD_TASK = gql `
  mutation addtask($projectId: ID!, $title: String!, $description: String) {
    addTask(projectId: $projectId, title: $title, description: $description) {
      _id
      title
      description
    }
  }
`