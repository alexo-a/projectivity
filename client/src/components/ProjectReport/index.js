import React from "react";
import { getCurrentWeekInfo } from "../utils/helpers"
import Auth from "../utils/auth";
import { useQuery } from "@apollo/react-hooks";
import { QUERY_PROJECT_TIMESHEETS } from "../utils/queries";

function processProjectTimeSheets(timesheets) {

    let compilation = [];
    let uniqueTasks = new Set(timesheets.map(timesheet => {
        return timesheet.task._id
    }));

    compilation = [...uniqueTasks].map(id => { return { taskId: id, taskTitle: "", users: [], totalTime: 0 } })

    for (let i in timesheets) {
        let log = {
            taskId: timesheets[i].task._id,
            taskTitle: timesheets[i].task.title,
            duration: parseFloat(((parseInt(timesheets[i].end) - parseInt(timesheets[i].start)) / 3600000).toFixed(2)),
            username: timesheets[i].user.username
        }
        for (let j in compilation) {
            if (log.taskId === compilation[j].taskId) {
                compilation[j].taskTitle = log.taskTitle;
                compilation[j].totalTime += log.duration;

                let timesheetLogged = false;
                for (let k in compilation[j].users) {
                    if (log.username === compilation[j].users[k].username) {
                        compilation[j].users[k].duration += log.duration;
                        timesheetLogged = true
                        break
                    }
                }
                if (!timesheetLogged) {
                    compilation[j].users.push({ username: log.username, duration: log.duration })
                }

            }
        }
    }
    console.log(compilation)
    return compilation
}

function ProjectReport() {

    const weekInfo = getCurrentWeekInfo();
    const weekNumber = weekInfo.weekNumber;
    const weekStart = weekInfo.weekStartDate;

    const userInfo = Auth.getUserInfo();
    console.log(userInfo)
    //const username = userInfo.username;
    //TODO change the below line to a proper variable
    const projectId = "5fa099f5a8cd115d30f4789a";
    const projectTitle = "Licensed Steel Pizza";

    const { loading, data } = useQuery(QUERY_PROJECT_TIMESHEETS,
        {
            variables: {
                projectId//, start: new Date(weekStart)
            }
        }
    );

    const timesheets = data?.timesheets || {};

    let hours = 0;
    let dataTree = {}
    if (loading) {
        return null
    }
    if (!loading) {

        console.dir(timesheets)
        const compilationInfo = processProjectTimeSheets(timesheets)
    }


    return (
        <div className="bootstrap-wrapper">
            <div className="container-fluid">
                <div className="row">
                    <h2 className="text-center" id="projectName">
                        {projectTitle}
                    </h2>
                </div>
                <div className="row">
                    <h3 className="text-center" id="date">
                        Project Progress Report
                    </h3>
                </div>
                <div className="row">
                    <h3 className="text-center" id="date">
                        As of {today}
                    </h3>
                </div>
                <div className="row">
                    <h6>Task View</h6>
                </div >
                <div className="row">
                    <div className="mx-3">

                        {dataTree ? (
                            <>
                                {dataTree.map(project => (
                                    <div className="row py-2 border-bottom border-dark" key={project.title}>
                                        <div className="my-auto col-xs-3">
                                            {project.title}
                                        </div>
                                        < div className="col-xs-9">
                                            {project.tasksWithDuration.map(task => (

                                                <div className="row" key={task.title}>
                                                    <div className="col-xs-8">
                                                        {task.title}
                                                    </div>
                                                    <div className="col-xs=4 text-center my-auto">
                                                        {task.duration}
                                                    </div>
                                                </div>

                                            ))}

                                        </div>
                                    </div>
                                ))}

                            </>
                        ) : null}
                    </div>
                </div >
            </div >
        </div>
    )
}
export default ProjectReport;
