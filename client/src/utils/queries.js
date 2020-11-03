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