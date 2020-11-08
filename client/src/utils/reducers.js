import { useReducer } from 'react';

import {
	ADD_TIMESHEET_TASK,
	CLEAR_TIMESHEET_TASK,
	SHOW_ALERT_MODAL,
	CLEAR_ALERT_MODAL, 
	OPEN_ADD_EMPLOYEE_MODAL, FORCE_RENDER
} from './actions';

export const reducer = (state, action) => {
	switch (action.type) {
		case ADD_TIMESHEET_TASK:
			return {
				...state,
				timeSheetTask: action.task
			}
		case CLEAR_TIMESHEET_TASK: {
				let tmpState = { ...state };

				delete tmpState.timeSheetTask;

				return tmpState;
			}
		case SHOW_ALERT_MODAL:
			return {
				...state,
				modal: action.modal
			}
		case CLEAR_ALERT_MODAL: {
				let tmpState = { ...state };

				delete tmpState.modal;

				return tmpState;
			}
		case OPEN_ADD_EMPLOYEE_MODAL:
			return {
				...state,
				employeeModalTask: action.employeeModalTask,
				employeeModalOpen: action.employeeModalOpen
			}

		case FORCE_RENDER:
			return {
				...state,
				forceRender: action.forceRender
			}	
		default:
			return state;
	}
}

export function useProjectivityReducer(initialState) {
	return useReducer(reducer, initialState);
}