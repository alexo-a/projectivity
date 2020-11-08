import React, {useEffect} from 'react';
import Auth from "../utils/auth";
import { useQuery } from "@apollo/react-hooks";
import { QUERY_MY_TASKS } from "../utils/queries";
import { useStoreContext } from '../utils/GlobalState';
import { ADD_TIMESHEET_TASK} from "../utils/actions"


function parseTasks(tasks) {
    //keeps track of all the unique projects so the operations afterward are smoother
    let uniqueProjects = new Set(tasks.map(task => {
        return task.project._id
    }));

    let compilation = [...uniqueProjects].map(id => {
        return {
            projectId: id,
            projectTitle: "",
            projectDescription: "",
            tasks: []
        }
    })

    for (let i in tasks) {
        //cleanly assemble data from the tasks
        let taskInfo = {
            projectId: tasks[i].project._id,
            projectTitle: tasks[i].project.title,
            projectDescription: tasks[i].project.description,
            taskId: tasks[i]._id,
            taskTitle: tasks[i].title,
            taskDescription: tasks[i].description
        }

        for (let j in compilation) {
            //try to find a match for the projectId so no duplicate projects show up when we group by project in the DOM
            if (taskInfo.projectId === compilation[j].projectId) {
                compilation[j].projectTitle = taskInfo.projectTitle;
                compilation[j].projectDescription = taskInfo.projectDescription;
                compilation[j].tasks.push({
                    taskId: tasks[i]._id,
                    taskTitle: tasks[i].title,
                    taskDescription: tasks[i].description
                })
            }
        }
    }
    return compilation;
}

function Dashboard() {
    const [state, dispatch] = useStoreContext();
    const userInfo = Auth.getUserInfo();
    const username = userInfo.username;
    const userId = userInfo._id;

    //get the logged-in user's assigned tasks.
    const { loading, data } = useQuery(QUERY_MY_TASKS,
        { variables: { userId } } );

    const tasks = data?.myTasks || {};
    let results=[]
    if (loading) {
        return null
    }
    if (!loading) {
        results = parseTasks(tasks)
        //console.log(JSON.stringify(tasks))
    }
/*
    useEffect(() => {
        if (results) {
            dispatch({
                type: ADD_TIMESHEET_TASK,
                task: categoryData.categories
            });
            categoryData.categories.forEach(category => {
                idbPromise('categories', 'put', category);
            });
        } else if (!loading) {
            idbPromise('categories', 'get').then(categories => {
                dispatch({
                    type: UPDATE_CATEGORIES,
                    categories: categories
                });
            });
        }
    }, [categoryData, loading, dispatch]);*/
console.dir(state)
    const handleClick = task => {
        dispatch({
            type: ADD_TIMESHEET_TASK,
            task: task
        });
    };
    return(
        <div>
            <h2>Dashboard</h2>

            <h5>Your Current Tasks:</h5>

            <div className="componentContainer">
                <div className="kanbanContainer">

                        {results ? (
                            <div key="a">
                                {results.map(project => (
                                    <div className="project-container border-bottom" key={project.projectTitle}>
                                        <div className="" key="projectTitle">
                                            {project.projectTitle}
                                        </div>
                                        < div className="employee-task-container">
                                            {project.tasks.map(task => (
                                                <>
                                                    <div className="" key={task.taskTitle}>
                                                        {task.taskTitle}
                                                    </div>
                                                    <button className='taskSelect' onClick={() => {
                                                        handleClick(task);
                                                    }}>
                                                        Select
                                                    </button>
                                                </>
                                            ))}

                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null}

                </div>
            </div>
        </div>
    );
}

export default Dashboard;