import React, { useState } from 'react'
import { useStoreContext } from "../../utils/GlobalState";
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
       const users = state.employeeModalTask.employees.map(employee => employee._id);
       setSelectedState(users);
       console.log(selectedState)
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
        console.log(selectedState);
        try {
             await addEmployeesToTask({
                variables: {
                    userId: selectedState,
                    taskId: state.employeeModalTask._id
                }
            });
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="addEmployeeModal">
            <div className="employeeModalTitle">
                <h3>Add employees to {state.employeeModalTask.title}</h3><FontAwesomeIcon icon={ faTimes }></FontAwesomeIcon>
            </div>
            <div>
                {state.employeeModalTask.group.map(employee => (
                    <div 
                    className={`${
                        selectedState.includes(employee._id)
                        ? 'addedUser' : ''}`} 
                    key={employee._id}
                    onClick={() => handleToggleUser(employee._id)}
                    >
                        <p>{employee.username}</p>
                        {selectedState.includes(employee._id) 
                        ? <FontAwesomeIcon icon={faMinus }></FontAwesomeIcon> 
                        : <FontAwesomeIcon icon={ faPlus }></FontAwesomeIcon>}
                        
                    </div>
                ))}
            </div>
            <div>
                <button type="button">Cancel</button>
                <button type="submit" onClick={handleSubmitUsers}>Add User(s)</button>
            </div>
        </div>
    )
}

export default AddEmployeeTask;