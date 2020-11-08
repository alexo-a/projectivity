import React from "react";
import { getCurrentWeekInfo } from "../utils/helpers"
import Auth from "../utils/auth";
import { useQuery } from "@apollo/react-hooks";
import { QUERY_MY_TIMESHEETS } from "../utils/queries";
import EmployeeReportChart from "../components/EmployeeReportChart"

function processTimeSheets(timesheets) {
    //processed the time sheets, extracting the project info, task info, and duration info.
    //logs this data as objects in the compilation array
    let totalHours=0;
    let dataForChart={
        labels: [],
        datasets: [{
            label: "Task Data",
            data: []
        }]
    }
    //keeps track of all the unique projects so the operations afterward are smoother
    let uniqueProjects = new Set(timesheets.map(timesheet => {
        return timesheet.task.project._id
    }));

    //turn that uniqueProjects set into the compilation array of objects
    let compilation = [...uniqueProjects].map(id => {
        return {
            projectId: id,
            projectTitle: "",
            tasks: [],
            totalTime: 0
        }
    })
    for (let i in timesheets) {
        //cleanly assemble data from the timesheet
        let log = {
            projectId: timesheets[i].task.project._id,
            projectTitle: timesheets[i].task.project.title,
            taskId: timesheets[i].task._id,
            taskTitle: timesheets[i].task.title,
            duration: parseFloat(((parseInt(timesheets[i].end) - parseInt(timesheets[i].start)) / 3600000).toFixed(2))
        }
        totalHours +=log.duration;
        for (let j in compilation) {
            //try to find a match for the task _id to add to that duration ...
            if (log.projectId === compilation[j].projectId) {
                compilation[j].projectTitle = log.projectTitle;
                compilation[j].totalTime += log.duration;

                let timesheetLogged = false;
                for (let k in compilation[j].tasks) {
                    if (log.taskId === compilation[j].tasks[k].taskId) {
                        compilation[j].tasks[k].duration += log.duration;
                        timesheetLogged = true
                        break
                    }
                }
                if (!timesheetLogged) {
                    //... or create a new one
                    compilation[j].tasks.push({
                        taskId: log.taskId,
                        taskTitle: log.taskTitle,
                        duration: log.duration
                    })
                }
            }
        }
    }
    for (let i in compilation){
        for (let j in compilation[i].tasks){
            let newLabel = compilation[i].projectTitle + " - " + compilation[i].tasks[j].taskTitle
            let newData = compilation[i].tasks[j].duration
            console.log(newLabel, newData)
            dataForChart.labels.push(newLabel);
            dataForChart.datasets[0].data.push(newData)
        }
    }
    console.log(dataForChart)
    //you must import util for the following line to work:
    //console.log(util.inspect(compilation, true, null, true))
    return {compilation, totalHours, dataForChart}
}

function EmployeeReport() {
    const weekInfo = getCurrentWeekInfo();
    const weekNumber = weekInfo.weekNumber;
    const weekStart = weekInfo.weekStartDate;
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
    let compilationInfo = {};

    if (loading) {
        return null
    }

    if (!loading) {
        //console.log(JSON.stringify(timesheets))
        compilationInfo = processTimeSheets(timesheets)
        console.log(compilationInfo.dataForChart)
    }

    return (
        <div key="EmployeeReport">
            <h2 className="text-center" id="projectName">
                Weekly Progress Report for {username}
            </h2>
            <h3 className="text-center" id="date">
                Week of {weekStart} (W{weekNumber})
            </h3>
            <h5 className="text-center">
                Time Logged: <span>{compilationInfo.totalHours}</span>
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
                {compilationInfo.compilation ? (
                    <div key="test3242342">
                        {compilationInfo.compilation.map(project => (
                            <div className="project-container border-bottom" key={project.projectTitle}>
                                <div className="text-mid pl-5" key="projectTitle">
                                    {project.projectTitle}
                                </div>
                                < div className="employee-task-container">
                                    {project.tasks.map(task => (
                                        <>
                                            <div className="" key={task.taskTitle}>
                                                {task.taskTitle}
                                            </div>
                                            <div className="text-center text-mid">
                                                {task.duration}
                                            </div>
                                        </>
                                    ))}

                                </div>
                            </div>
                        ))}

                    </div>
                ) : null}
            </div >
            <EmployeeReportChart data={compilationInfo.dataForChart} username={username} />

        </div >
    )
}
export default EmployeeReport;

