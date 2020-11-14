import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStoreContext } from '../utils/GlobalState';
import { useQuery } from '@apollo/react-hooks';
import { QUERY_PROJECT } from '../utils/queries';
import { useMutation } from '@apollo/react-hooks';
import { ADD_TASK } from '../utils/mutations'
import { OPEN_ADD_EMPLOYEE_MODAL } from '../utils/actions'


import KanbanTask from '../components/KanbanTask';
import AddEmployeeTask from '../components/AddEmployeeTask';
import './index.css';

function Projects() {
    const [state, dispatch] = useStoreContext();
    const { id: projectId, userId: userId } = useParams();
    const [addTask, { error }] = useMutation(ADD_TASK);
    const { loading, data, refetch } = useQuery(QUERY_PROJECT, {
        variables: { id: projectId }
    });

    const [formState, setFormState] = useState({ 
        title: '', description: ''
    });

    const handleFormSubmit = async event => {
        event.preventDefault();
        try {
            const mutationResponse = await addTask({ variables: { 
                projectId: projectId,
                title: formState.title || '(no title)', 
                description: formState.description || '(no description)'
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
        refetch();
    };

    
    const handleChange = event => {
        
        const { name, value } = event.target;
        console.log(name);
        setFormState({
          ...formState,
          [name]: value
        });
    };

    const project = data?.project || {};
    const group = data?.groupByProject || {};

    if (loading) {
        return (
            <></>
        )
    }

    const managers = project.managers.map(manager => manager._id);
    
    if (userId === group.administrator._id) {
        project.role = 'admin';
    } 
    else if (managers.includes(userId)) {
        project.role = 'manager';
    } else {
        project.role = 'employee';
    }

    const toDoTasks = project.tasks.filter(task => task.entries.length === 0).map(task => {task.class = 'toDo'; return task});
    const inProgressTasks = project.tasks.filter(task => task.entries.length > 0 && !task.completed).map(task => {task.class = 'inProgress'; return task});
    const completedTasks = project.tasks.filter(task => task.completed).map(task => {task.class = 'completed'; return task});

    return(
        <div className="componentContainer">
            <h3 className='projectTitle'>{project.title}</h3>
            <strong className="projectSubtitle">{group.title}</strong>

            { project.role !== 'employee' && 
            <div className="addTaskContainer">
                <form className="form addTaskForm" onSubmit={handleFormSubmit}>
                    <div className="formItem title">
                        <input
                            name='title'
                            type='text'
                            id='title'
                            placeholder='Title'
                            value={formState.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="formItem description">
                        <input
                            name='description'
                            type='text'
                            id='description'
                            placeholder='Description'
                            value={formState.description}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="success">
                        Add Task
                    </button>
                </form>    
            </div>}

            <div className="kanbanContainer">
                <div className="kanbanCell">
                    <div className="kanbanTitle left">
                        <h3>To Do</h3>
                    </div>
                    <div className="kanbanBody">
                        {project &&
                        toDoTasks.map(task => (<KanbanTask key={task.id} task={task} project={project} group={group} />)) 
                        }
                    </div>
                </div>
                <div className="kanbanCell">
                    <div className="kanbanTitle">
                        <h3>In Progress</h3>
                    </div>
                    <div className="kanbanBody">
                        {project &&
                        inProgressTasks.map(task => (<KanbanTask key={task.id} task={task} project={project} group={group} />)) 
                        }
                    </div>
                </div>
                <div className="kanbanCell">
                    <div className="kanbanTitle right">
                        <h3>Completed</h3>
                    </div>
                    <div className="kanbanBody">
                        {project &&
                        completedTasks.map(task => (<KanbanTask key={task.id} task={task} project={project} group={group} />)) 
                        }
                    </div>
                </div>
            </div>
            <AddEmployeeTask></AddEmployeeTask>
        </div>
    );
}

export default Projects;