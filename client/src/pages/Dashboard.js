import React, {useEffect} from 'react';
import Auth from "../utils/auth";
import { useQuery } from "@apollo/react-hooks";
import { QUERY_MY_TASKS } from "../utils/queries";
import { useStoreContext } from '../utils/GlobalState';
import { ADD_TIMESHEET_TASK, SHOW_ALERT_MODAL, UPDATE_DASHBOARD_TASKS} from "../utils/actions"
import { idbPromise } from '../utils/helpers';

import DashboardProject from "../components/DashboardProject";

// util is useful for debugging. use: console.log(util.inspect(**item**,true,null,true))
//import util from "util";

function parseTasks(tasks) {
    //keeps track of all the unique projects so the operations afterward are smoother
    let uniqueProjects = new Set(tasks.map(task => {
        //console.log(`uniqueProjects: ${task}`)
        return task.project._id
    }));

    let compilation = [...uniqueProjects].map(id => {
        return {
            projectId: id,
            projectTitle: "",
            projectDescription: "",
            projectManagers: [],
            tasks: []
        }
    })

    for (let i in tasks) {
        //cleanly assemble data from the tasks
        let taskInfo = {
            projectId: tasks[i].project._id,
            projectTitle: tasks[i].project.title,
            projectDescription: tasks[i].project.description,
            projectManagers: tasks[i].project.managers,
            taskId: tasks[i]._id,
            taskTitle: tasks[i].title,
            taskDescription: tasks[i].description
        }

        for (let j in compilation) {
            //try to find a match for the projectId so no duplicate projects show up when we group by project in the DOM
            if (taskInfo.projectId === compilation[j].projectId) {
                compilation[j].projectTitle = taskInfo.projectTitle;
                compilation[j].projectDescription = taskInfo.projectDescription;
                compilation[j].projectManagers = taskInfo.projectManagers;
                compilation[j].tasks.push({
                    taskId: tasks[i]._id,
                    taskTitle: tasks[i].title,
                    taskDescription: tasks[i].description
                });
            }
        }
    }
    return compilation;
}

function Dashboard() {
    const [state, dispatch] = useStoreContext();
    const userInfo = Auth.getUserInfo();
    const userId = userInfo._id;
    //get the logged-in user's assigned tasks.
    const { loading, data } = useQuery(QUERY_MY_TASKS,
        { variables: { userId } } );

    let {dashboardTasks: tasks} = state; //data?.myTasks || null;
    
/*    function addIDBTasks (tasksIn) {
        tasks.push(tasksIn)
    }*/
        
    useEffect(() => {
        if (data) {
            dispatch({
                type: UPDATE_DASHBOARD_TASKS,
                tasks: data.myTasks 
            });
            data.myTasks.forEach(task => {
                idbPromise('dashboard', 'put', task);
            });
        } else if (!loading) {
            idbPromise('dashboard', 'get').then(tasks => {
                //addIDBTasks(tasks)
                //TODO how can I pass out the stored tasks?
                dispatch({
                    type: UPDATE_DASHBOARD_TASKS,
                    tasks
                });

            });
        }
    }, [data, loading, dispatch]);

    if (loading) {
        return null
    }
    if (!loading) {
        //results = parseTasks(tasks)
        //console.log(JSON.stringify(tasks))
    }

    const handleClick = task => {
        function okay (){
            dispatch({
                type: ADD_TIMESHEET_TASK,
                task: { description: task.taskDescription, title: task.taskTitle, _id: task.taskId }
            });
        }
        //if already selected
        if (state.timeSheetTask) {
            if (state.timeSheetTask._id === task.taskId) return;

            dispatch({
                type: SHOW_ALERT_MODAL,
                modal: {
                    title: "Proceed?",
                    text: "The task you selected is different than the previous selection.\n\n Do you want to activate this new task?",
                    buttons: {
                        Yes: okay,
                        No: null
                    }
                }
            });
        }
        else {
            okay();
        }
    };

    //console.dir(state);

    return(
        <div>
            <h2>Dashboard</h2>
            { tasks.length > 0 ?
                (<div className="flexContainer">
                    {parseTasks(tasks).map(project => <DashboardProject key={project.projectTitle} project={project} selectTaskCallback={handleClick} />)}
                </div>)
                : null
            }
            </div>
    );
}

export default Dashboard;