import gql from 'graphql-tag';

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

export const FIND_USER = gql`
query findUser($searchField: String!) {
	findUser(searchField: $searchField) {
	  _id
	  username
	}
}
`;