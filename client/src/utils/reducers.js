import { useReducer } from 'react';

import {
	ADD_TIMESHEET_TASK,
	CLEAR_TIMESHEET_TASK,
} from './actions';

export const reducer = (state, action) => {
	switch (action.type) {
		case ADD_TIMESHEET_TASK:
			return {
				...state,
				timeSheetTask: action.task
			}
		case CLEAR_TIMESHEET_TASK:
			let tmpState = { ...state };

			delete tmpState.timeSheetTask;

			return tmpState;
		default:
			return state;
	}
}

export function useProjectivityReducer(initialState) {
	return useReducer(reducer, initialState);
}