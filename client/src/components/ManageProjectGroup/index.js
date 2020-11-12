import React from "react";
import { useMutation } from '@apollo/react-hooks';

import ManageEmployeeList from "../ManageEmployeeList";
import ProjectList from "../ProjectList";

import { ADD_MANAGER_TO_GROUP, ADD_EMPLOYEE_TO_GROUP } from "../../utils/mutations";
import { SHOW_ALERT_MODAL } from "../../utils/actions";
import { useStoreContext } from '../../utils/GlobalState';

import "./style.css";

function ManageProjectGroup({ group, refetch }) {
	const [state, dispatch] = useStoreContext();
	const [addManagerToGroup, ignoreMe] = useMutation(ADD_MANAGER_TO_GROUP);
	const [addEmployeeToGroup, ignoreMe2] = useMutation(ADD_EMPLOYEE_TO_GROUP);

	const doAddCallback = async function(propName, mutName, callback, userId) {
        if (!userId) {
            dispatch({
				type: SHOW_ALERT_MODAL,
				modal: {
					title: "Error",
					text: "Invalid user ID!"
				}
            });
            return;
		}
		
        try {
			const groupResult = await callback(
				{
					variables: {
						groupId: group._id,
						userId
					}
				}
			);
			
			group[propName] = groupResult.data[mutName][propName];
		} catch (e) {
			dispatch({
				type: SHOW_ALERT_MODAL,
				modal: {
					title: "Error",
					text: e.toString()
				}
			});
        }
	}

	const doAddManager = function(userId) {
		doAddCallback("managers", "addManagerToProjectGroup", addManagerToGroup, userId);
	}

	const doAddEmployee = function(userId) {
		doAddCallback("employees", "addEmployeeToProjectGroup", addEmployeeToGroup, userId);
	}

	return (
		<div className="projectGroup card">
			<h3>{group.title}</h3>
			<ManageEmployeeList employees={group.managers} label="Manager" addCallback={doAddManager} />
			<ManageEmployeeList employees={group.employees} label="Employee" addCallback={doAddEmployee} />
			<ProjectList projects={group.projects} administrator={true} groupId={group._id} />
		</div>
	);
}

export default ManageProjectGroup;