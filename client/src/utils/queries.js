import gql from 'graphql-tag';

export const QUERY_MY_PROJECTS = gql`
    query {
        myProjects {
            administrator {
                _id
                title
                description
            }
            manager {
                _id
                title
                description
            }
            employee {
                _id
                title
                description
                tasks {
                    title
                    entries {
                        _id
                    }
                }
            }
        }

        me {
            _id
            username
        }
    } 
`
export const QUERY_MY_TASKS = gql`
    query {
        myTasks {
            _id
            title
            description
            completed
            project {
                _id
                title
                description
                managers {
                    _id
                    username
                }
            }
        }
    }
`

export const QUERY_MY_TIMESHEETS = gql`
query timesheets ($userId: ID,  $start: String, $end: String){
        timesheets ( userId: $userId, start: $start, end: $end) {
            task {
              _id
              title
                project {
                    _id
                    title
                }
            }
            _id
            start
            end
            note
        }
    }
`    
export const QUERY_PROJECT = gql`
    query project($id: ID!) {
        project(id: $id) {
            _id
            title
            description
            managers {
                _id
                username
            }
            tasks {
                _id
                title
                description
                employees {
                    _id
                    username
                }
                entries {
                _id
                }
            completed
            }
        }

        groupByProject(projectId: $id) {
            _id
            title
            administrator {
                _id
                username
            }
            managers {
                _id
                username
            }
            employees {
                _id
                username
            }

        }
    } 
`
export const QUERY_PROJECT_TIMESHEETS = gql`
query timesheets ($projectId: ID,  $start: String, $end: String){
        timesheets ( projectId: $projectId, start: $start, end: $end) {
            task {
              _id
              title
                project {
                    _id
                    title
                }
            }
            start
            end
            note
            user {
                _id
                username
            }
        }
    }
`
export const MY_GROUPS = gql`
query {
	myGroups {
	  administrator {
		_id
		title
		managers {
			_id
			username
		}
		employees {
			_id
			username
		}
		projects {
			_id
			title
		}
	  }
	  member {
		_id
		title
		administrator {
			_id
			username
		}
		projects {
			_id
			title
		}
	  }
	}
  }
`;

export const MY_CONVERSATIONS = gql`
query {
    myConversations {
      _id
      participants {
        _id
        username
      }
      messages {
        _id
        sender {
          _id
          username
        }
        message
        sent
      }
      read {
          _id
      }
    }
  }
`;

export const FIND_USER = gql`
query findUser($searchField: String!) {
	findUser(searchField: $searchField) {
	  _id
	  username
	}
}
`;
