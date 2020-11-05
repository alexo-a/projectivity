import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useStoreContext } from "../../utils/GlobalState";
import { OPEN_ADD_EMPLOYEE_MODAL } from "../../utils/actions";
import { REMOVE_EMPLOYEE_FROM_TASK } from '../../utils/mutations'
import { 
     faChevronUp, faTimes, faPlus, faCheck
} from '@fortawesome/free-solid-svg-icons';

import './index.css'

function KanbanTask({ task, project, group }) {
    const [state, dispatch] = useStoreContext();
    const [expandState, setExpandState] = useState(false);
    const [deleteState, setDeleteState] = useState({ selected: false, id: ''});

    const [removeEmployeeFromTask, { error }] = useMutation(REMOVE_EMPLOYEE_FROM_TASK);

    const toggleExpand = function() {
		setExpandState(!expandState);
    }

    const toggleDelete = function(userId) {
		setDeleteState({
            selected: !deleteState.selected,
            id: userId
        });
    }

    function toggleEmployeeModal(task) {
        dispatch({ 
            type: OPEN_ADD_EMPLOYEE_MODAL,
            employeeModalOpen: true,
            employeeModalTask: { ...task, project: project._id, group: group.employees }
        });
    }

    const handleDelete = async function() {
        try {
            await removeEmployeeFromTask({
                variables: {
                    userId: deleteState.id,
                    taskId: task._id
                }
            });
            setDeleteState({
                selected: false,
                id: ''
            });
        } catch (e) {
            console.error(e);
        }
    }
    
    return (
        <div className="taskContainer">
            <div className={`taskBox ${!expandState && 'taskClosed'}`}>
                <div className={`taskTitle ${task.class}`}>
                    <p>{task.title}</p> 
                    <blockquote className={`${!expandState && 'taskClosed'}`}>{task.description}</blockquote>
                </div>
                <div className={`taskInfoDisplay ${!expandState && 'taskClosed'}`}>
                    <div className="employeesAssigned">
                        {task.employees.map(employee => (
                            <div key={employee._id} className="taskedEmployee">
                                <strong>{employee.username}</strong>
                                <div className="removeEmployeeGroup">
                                    <FontAwesomeIcon icon={ faTimes } className={`removeEmployee ${deleteState.selected && deleteState.id === employee._id && 'deleteable'}`} onClick={() => toggleDelete(employee._id)}></FontAwesomeIcon>
                                    <FontAwesomeIcon icon={ faCheck } className={`removeEmployeeConfirm ${deleteState.selected && deleteState.id === employee._id && 'deleteable'}`} onClick={handleDelete}></FontAwesomeIcon>
                                </div>
                            </div>
                        ))}
                        <div className="addEmployee">
                                <div className="addEmployeeButton">
                                    <strong onClick={() => toggleEmployeeModal(task)}>Add Employee</strong>
                                    <FontAwesomeIcon icon={ faPlus }></FontAwesomeIcon>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
            <FontAwesomeIcon icon={ faChevronUp } className={`taskExpandButton ${!expandState && 'taskClosed'}`} onClick={toggleExpand}></FontAwesomeIcon>
        </div>
    )
}

export default KanbanTask;