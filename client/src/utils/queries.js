import gql from 'graphql-tag';

export const QUERY_MY_PROJECTS = gql`
    query {
        myProjects {
            administrator {
                _id
                title
            }
            manager {
                _id
                title
            }
            employee {
                _id
                title
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
<<<<<<< HEAD
export const QUERY_MY_TASKS = gql`
    query {
        myTasks {
            _id
            project
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
            start
            end
            note
        }
    }
=======
export const QUERY_PROJECT = gql`
    query project($id: ID!) {
        project(id: $id) {
            title
            description
            managers {
                _id
                username
            }
            tasks {
                _id
                title
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
>>>>>>> feature/projectpage
`
