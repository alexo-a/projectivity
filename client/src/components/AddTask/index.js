import React, { useState } from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { OPEN_ADD_EMPLOYEE_MODAL, FORCE_RENDER } from '../../utils/actions';
import { useMutation } from '@apollo/react-hooks';
import { useParams } from "react-router-dom";
import { ADD_TASK } from '../../utils/mutations'
import './index.css';

function AddTask({ group }) {
    const [formState, setFormState] = useState({ 
        title: '', description: ''
    });
    const [ state, dispatch ] = useStoreContext();

    const [addTask, { error }] = useMutation(ADD_TASK);

    const { id: projectId } = useParams();

    const handleFormSubmit = async event => {
        event.preventDefault();
        try {
            const mutationResponse = await addTask({ variables: { 
                projectId: projectId,
                title: formState.title, 
                description: formState.description 
            } })

            const task = mutationResponse.data.addTask;

            dispatch({ 
                type: OPEN_ADD_EMPLOYEE_MODAL,
                employeeModalOpen: true,
                employeeModalTask: {...task, group: group.employees }
            });
        } catch (e) {
            console.error(e);
            return
        }
        setFormState({
            title: '', description: ''
        });
        dispatch({
            type: FORCE_RENDER,
            forceRender: true
        });
    };

    
    const handleChange = event => {
        const { name, value } = event.target;
        setFormState({
          ...formState,
          [name]: value
        });
    };
    return(
        <div className="addTaskContainer">
            <form className="form addTaskForm" onSubmit={handleFormSubmit}>
                <div className="formItem title">
                    <input
                        name='title'
                        type='text'
                        id='title'
                        placeholder='Title'
                        onChange={handleChange}
                    />
                </div>
                <div className="formItem description">
                    <input
                        name='title'
                        type='text'
                        id='title'
                        placeholder='Description'
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="success">
                    Add Task
                </button>
            </form>    
        </div>
    );
}

export default AddTask;