import React, { useState } from 'react'
import { useStoreContext } from "../../utils/GlobalState";
import { OPEN_ADD_EMPLOYEE_MODAL } from '../../utils/actions';
import { useMutation } from '@apollo/react-hooks';
import { UPDATE_EMPLOYEES_TASK } from '../../utils/mutations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, faPlus, faMinus
} from '@fortawesome/free-solid-svg-icons';

import './index.css'

function AddEmployeeTask() {
    const [ state, dispatch ] = useStoreContext();
    const [ selectedState, setSelectedState ] = useState([]);
    const [addEmployeesToTask, { error }] = useMutation(UPDATE_EMPLOYEES_TASK);

    if (!state.employeeModalOpen) {
        return (
            <></>
        )
    }

    if (!selectedState.length) {
       const users = state.employeeModalTask.group.map(employee => employee._id);
    }


    function handleToggleUser(id) {
        if (selectedState.includes(id)) {
            let addedUsers = selectedState.filter(user => user !== id);
            if (!addedUsers.length) {
                addedUsers = ['placeholder']
            }
            setSelectedState(addedUsers);
        } else {
            const users = selectedState;
            if (users[0] === 'placeholder') {
                users.splice(0);
            }
            setSelectedState([...users, id]);
        }     
    }

    async function handleSubmitUsers(event) {
        event.preventDefault();
        if (selectedState[0] === 'placeholder') {
            return
        }
        try {
            await addEmployeesToTask({
                variables: {
                    userId: selectedState,
                    taskId: state.employeeModalTask._id
                }
            });
            dispatch({ 
                type: OPEN_ADD_EMPLOYEE_MODAL,
                employeeModalOpen: false,
                employeeModalTask: {}
            });
            setSelectedState([]);
        } catch (e) {
            console.error(e);
        }
    }

    function handleModalClose() {
        dispatch({ 
            type: OPEN_ADD_EMPLOYEE_MODAL,
            employeeModalOpen: false,
            employeeModalTask: {}
        });
        setSelectedState([]);
    }
    

    return (
        <div className="addEmployeeModal">
            <div className="employeeModalTitle">
                <h3>Add Employees to <span>{state.employeeModalTask.title}</span></h3><FontAwesomeIcon icon={ faTimes } onClick={handleModalClose} className="employeeModalClose"></FontAwesomeIcon>
            </div>
            <div className="employeeContainer">
                {state.employeeModalTask.group.map(employee => (
                    <div 
                    className={`employeeCell ${
                        selectedState.includes(employee._id)
                        ? 'addedUser' : ''}`} 
                    key={employee._id}
                    onClick={() => handleToggleUser(employee._id)}
                    >
                        <p>{employee.username}</p>
                        {selectedState.includes(employee._id) 
                        ? <FontAwesomeIcon icon={ faMinus } className="addSubtract"></FontAwesomeIcon> 
                        : <FontAwesomeIcon icon={ faPlus } className="addSubtract"></FontAwesomeIcon>}
                        
                    </div>
                ))}
            </div>
                <div className="employeeButtonGroup">
                    <button type="button" onClick={handleModalClose}>Cancel</button>
                    <button type="submit" onClick={handleSubmitUsers} className="employeeSubmit">Add User(s)</button>
                </div>
            </div>
    )
}

export default AddEmployeeTask;