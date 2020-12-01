import React from "react";
import { createProjectReportPDF } from "../../utils/helpers"
//import Auth from "../../utils/auth";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from 'react-router-dom';
import { QUERY_PROJECT_TIMESHEETS } from "../../utils/queries";
import moment from "moment";

function processProjectTimeSheets(timesheets) {

    let compilation = [];
    //use a Set to find the unique "timesheet.task._id"s quickly
    let uniqueTasks = new Set(timesheets.map(timesheet => {
        return timesheet.task._id
    }));

    //set up the objects to house all our necessary data
    compilation = [...uniqueTasks].map(id => {
        return {
            taskId: id,
            taskTitle: "",
            users: [],
            totalTime: 0,
            status: "In Progress"
        }
    })
    //loop through timesheets ...
    for (let i in timesheets) {
        //... extracting the data for each separate timesheet ...
        let log = {
            taskId: timesheets[i].task._id,
            taskTitle: timesheets[i].task.title,
            duration: parseFloat(((parseInt(timesheets[i].end) - parseInt(timesheets[i].start)) / 3600000).toFixed(2)),
            username: timesheets[i].user.username
        }
        for (let j in compilation) {
            if (log.taskId === compilation[j].taskId) {
                //... combining data for matching tasks ...
                compilation[j].taskTitle = log.taskTitle;
                compilation[j].totalTime += log.duration;
                compilation[j].status = timesheets[i].task.status ? "Complete" : "In Progress"
                let timesheetLogged = false;
                //... further combining timesheet sums if user has multiple timesheets for a task ...
                for (let k in compilation[j].users) {
                    if (log.username === compilation[j].users[k].username) {
                        compilation[j].users[k].duration += log.duration;
                        timesheetLogged = true
                        break
                    }
                }
                //... or adding new user data if no timesheet exists for them for that task
                if (!timesheetLogged) {
                    compilation[j].users.push({
                        username: log.username,
                        duration: log.duration
                    })
                }
            }
        }
    }
    return compilation
}

function ProjectReport() {

    const { id: projectId, title } = useParams();

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
        compilationInfo = processProjectTimeSheets(timesheets)
    }

    function generatePDF(data) {
        createProjectReportPDF(data, title)
    }

    return (

        <div>
            {compilationInfo ? (
                <>
                    <div className="text-center">
                        <button onClick={() => { generatePDF(compilationInfo) }}>Download PDF Version</button>
                    </div>

                    <h2 className="text-center" id="projectName">{title}</h2>
                    <h3 className="text-center" id="reportDescription">Project Progress Report</h3>
                    <h3 className="text-center" id="date">As of {today}</h3>
                    {/*<h5 className="text-center">Task View</h5>*/}

                    <div className="">

                        <div className="table-title border-bottom bg-dark text-light bold align-bottom">
                            <div className="text-mid">
                                Task
                            </div>
                            <div className="text-center text-mid">
                                Status
                            </div>
                            <div className="text-center text-mid">
                                Employee Name
                            </div>
                            <div className="text-center text-mid">
                                Hours
                            </div>
                        </div>
                        <>
                            {compilationInfo.map(task => (
                                <div className="task-container py-2 border-bottom" key={task.taskId}>
                                    <div className="title-box">
                                        {task.taskTitle}
                                    </div>
                                    <div className="text-center">
                                        {task.status}
                                    </div>
                                    <div className="employee-container">
                                        {task.users.map(taskUser => (
                                            <React.Fragment key={taskUser.username}>
                                                <div className="text-center">
                                                    {taskUser.username}
                                                </div>
                                                <div className="text-center" key={taskUser.duration}>
                                                    {taskUser.duration.toFixed(2)}
                                                </div>
                                            </React.Fragment>
                                        )
                                        )}
                                        <div></div>
                                        <div className="employee-total text-center bold">
                                            {task.totalTime.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>

                    </div>
                </>
            ) : 
            <h1>There are no timestamps logged for this project yet.</h1>}
        </div >

    )
}

export default ProjectReport;