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
            project
        }
    }
`

export const QUERY_MY_TIMESHEETS = gql`
query timesheets ($userId: ID,  $start: String, $end: String){
        timesheets ( userId: $userId, start: $start, end: $end) {
            task {
              _id

            }
            start
            end
            note
        }
    }
`

