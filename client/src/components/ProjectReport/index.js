import React from "react";
import { getCurrentWeekInfo } from "../../utils/helpers"
import Auth from "../../utils/auth";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from 'react-router-dom';
import { QUERY_PROJECT_TIMESHEETS } from "../../utils/queries";
import moment from "moment";

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
    //console.log(compilation)
    return compilation
}

function ProjectReport() {

    const weekInfo = getCurrentWeekInfo();
    const weekNumber = weekInfo.weekNumber;
    const weekStart = weekInfo.weekStartDate;

    const userInfo = Auth.getUserInfo();
    //console.log(userInfo)

    //TODO change the below two lines to a proper variable
    const { id: projectId } = useParams();
    const projectTitle = "Licensed Steel Pizza";

    const { loading, data } = useQuery(QUERY_PROJECT_TIMESHEETS,
        {
            variables: {
                projectId
            }
        }
    );
    let compilationInfo = [];
    const timesheets = data?.timesheets || {};

    let today = moment().format("Do MMMM YYYY");

    if (loading) {
        return null
    }
    if (!loading) {

        //console.dir(timesheets)
        compilationInfo = processProjectTimeSheets(timesheets)
        console.dir(compilationInfo)
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
                        <div class="row border-bottom bg-dark text-light font-weight-bold align-bottom">
                            <div class="col-3">
                                Task
                            </div>
                            <div class="col text-center">
                                TaskID
                            </div>
                            <div class="col text-center">
                                Status
                            </div>
                            <div class="col-5">
                                <div class="row">
                                    <div class="col-8 text-center">
                                        Employee Name
                                    </div>
                                    <div class="col-4 text-center">
                                        Hours
                                    </div>
                                </div>
                            </div>
                        </div>
                        {compilationInfo ? (
                            <>
                                {compilationInfo.map(task => (
                                    <div class="row py-2 border-bottom">
                                        <div class="col-3">
                                            {task.taskTitle}
                                        </div>
                                        <div class="col text-center">In Progress</div>
                                        <div class="col-5">
                                            {task.users.map(taskUser => {
                                                return (
                                                    <div class="row">
                                                        <div class="col-8 text-center">
                                                            {taskUser.username}
                                                        </div>
                                                        <div class="col-4 text-center">
                                                            {taskUser.duration}
                                                        </div>
                                                    </div>
                                                )
                                            })}

                                            
                                            <div class="row">
                                                <div class="col-8 text-center"></div>
                                                <div class="border-top col-4 text-center font-weight-bold">
                                                    {task.totalTime}
                                                </div>
                                            </div>
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
