import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks'
import { QUERY_PROJECT } from '../utils/queries';
import { useStoreContext } from '../utils/GlobalState';
import KanbanTask from '../components/KanbanTask'
import AddEmployeeTask from '../components/AddEmployeeTask'

import './index.css'

function Projects() {
    const [state, dispatch] = useStoreContext();
    const { id: projectId } = useParams();

    console.log(state.employeeModalOpen, state.employeeModalTask);

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
    console.log(data);
    const toDoTasks = project.tasks.filter(task => task.entries.length === 0).map(task => {task.class = 'toDo'; return task});
    const inProgressTasks = project.tasks.filter(task => task.entries.length > 0).map(task => {task.class = 'inProgress'; return task});
    const completedTasks = project.tasks.filter(task => task.completed).map(task => {task.class = 'completed'; return task});

    return(
        <div className="componentContainer">
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