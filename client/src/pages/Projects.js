import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks'
import { QUERY_PROJECT } from '../utils/queries';
import { useStoreContext } from '../utils/GlobalState';
import KanbanTask from '../components/KanbanTask';
import AddEmployeeTask from '../components/AddEmployeeTask';
import AddTask from '../components/AddTask';

import './index.css'
import { FORCE_RENDER } from '../utils/actions';

function Projects() {
    const [state, dispatch] = useStoreContext();
    const { id: projectId, userId: userId } = useParams();

    const { loading, data } = useQuery(QUERY_PROJECT, {
        variables: { id: projectId }
    });

    const project = data?.project || {};
    const group = data?.groupByProject || {};

    if (loading) {
        return (
            <></>
        )
    }

    if (state.forceRender) {
        dispatch({
            type: FORCE_RENDER,
            forceRender: false
        });
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
            { project.role !== 'employee' && <AddTask group={group}></AddTask>}
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