import React from "react";
import { getCurrentWeekInfo } from "../utils/helpers"
import Auth from "../utils/auth";
import { useQuery } from "@apollo/react-hooks";
import { QUERY_MY_TIMESHEETS } from "../utils/queries";

function processTimeSheets(timesheets) {
    //processes timesheets array, extracting the task title, task id, timesheet duration, and project title.
    let compilation = [];
    let uniqueProjects = new Set();
    let sum = 0;
    for (let i in timesheets) {

        //add the project title of the timesheet to the uniqueProjects *SET*
        //sets don't allow duplicate values, so this gets updated only once for each unique project in a week's timesheet logs
        uniqueProjects.add(timesheets[i].task.project.title)

        const duration = parseFloat(((parseInt(timesheets[i].end) - parseInt(timesheets[i].start)) / 3600000))
        sum += duration
        let flag = false;
        //loop through the compilation array to see if there's already a task._id entry matching this timesheet's task._id
        //if there is, add this timesheet's duration to that of the entry already in compilation[]
        for (let j in compilation) {
            if ((timesheets[i].task._id === compilation[j][1])) {
                compilation[j][2] += duration
                flag = true;
                break
            }
        };
        //if there wasn't a match in the previous loop, there's no task with a matching ._id in compilation... add the data from this timesheet to compilation
        if (!flag) {
            compilation.push([
                timesheets[i].task.project.title,
                timesheets[i].task._id,
                duration.toFixed(2),
                timesheets[i].task.title
            ])
        };

    }
    sum = sum.toFixed(2)

    //console.log(compilation)
    //console.log(uniqueProjects)
    let dataTree = []
    uniqueProjects.forEach(proj => { dataTree.push({ title: proj, tasksWithDuration: [] }) })

    compilation.forEach(uniqueTask => {
        for (let i = 0; i < dataTree.length; i++) {
            if (uniqueTask[0] === dataTree[i].title) {
                dataTree[i].tasksWithDuration.push({ title: uniqueTask[3], duration: uniqueTask[2] })
                break;
            }
        }
    })

    //console.log(dataTree)

    return { compilation, sum, dataTree }
}

function EmployeeReport() {
    const weekInfo = getCurrentWeekInfo();
    const weekNumber = weekInfo.weekNumber;
    const weekStart = weekInfo.weekStartDate;
    let hours = 0;
    let dataTree = {}
    const userInfo = Auth.getUserInfo();
    const username = userInfo.username;
    const userId = userInfo._id;

    //console.log(userInfo)
    //get the logged-in user's timesheets from the current week.
    const { loading, data } = useQuery(QUERY_MY_TIMESHEETS,
        {
            variables: {
                userId,
                start: new Date(weekStart)
            }
        }
    );

    const timesheets = data?.timesheets || {};

    if (loading) {
        return null
    }

    if (!loading) {
        //console.dir(timesheets)
        const compilationInfo = processTimeSheets(timesheets)
        dataTree = compilationInfo.dataTree
        hours = compilationInfo.sum
    }

    return (
        <div>
            <h2 className="text-center" id="projectName">
                Weekly Project Report for {username}
            </h2>
            <h3 className="text-center" id="date">
                Week of {weekStart} (W{weekNumber})
            </h3>
            <h5 className="text-center">
                Time Logged: <span>{hours}</span>
            </h5>
            <div className="mx-3">
                <div className="employee-table-title bold align-bottom">
                    <div className="text-mid">
                        Project Name
                    </div>
                    <div className="text-mid">
                        Task Description
                    </div>
                    <div className="text-mid text-center">
                        Hours
                    </div>
                </div>
                {dataTree ? (
                    <>
                        {dataTree.map(project => (
                            <div className="project-container border-bottom" key={project.title}>
                                <div className="text-mid pl-5">
                                    {project.title}
                                </div>
                                < div className="employee-task-container">
                                    {project.tasksWithDuration.map(task => (

                                        <div className="row" key={task.title}>
                                            <div className="">
                                                {task.title}
                                            </div>
                                            <div className="text-center text-mid">
                                                {task.duration}
                                            </div>
                                        </div>

                                    ))}

                                </div>
                            </div>
                        ))}

                    </>
                ) : null}
            </div >
        </div >
    )
}
export default EmployeeReport;

