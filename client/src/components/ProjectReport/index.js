import React from "react";
import { getCurrentWeekInfo, createProjectReportPDF } from "../../utils/helpers"
import Auth from "../../utils/auth";
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
        console.dir(timesheets)
        compilationInfo = processProjectTimeSheets(timesheets)
        console.dir(compilationInfo)
    }

    function generatePDF(data){
        createProjectReportPDF(data, projectTitle)
    }

    return (
        <div>

            <div className="text-center">
                <button onClick={() => {generatePDF(compilationInfo)}}>Download PDF Version</button>
            </div>
            
            <h2 className="text-center" id="projectName">{projectTitle}</h2>
            <h3 className="text-center" id="reportDescription">Project Progress Report</h3>
            <h3 className="text-center" id="date">As of {today}</h3>
            <h5 className="text-center">Task View</h5>

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

                {compilationInfo ? (
                    <>
                        {compilationInfo.map(task => (
                            <div className="task-container py-2 border-bottom">
                                <div className="title-box">
                                    {task.taskTitle}
                                </div>
                                <div className="text-center">
                                    {task.status ? "Completed" : "In Progress"}
                                </div>
                                <div className="employee-container">
                                    {task.users.map(taskUser => {
                                        return (
                                            <>
                                                <div className="text-center" key={taskUser.username}>
                                                    {taskUser.username}
                                                </div>
                                                <div className="text-center" key={taskUser.duration}>
                                                    {taskUser.duration.toFixed(2)}
                                                </div>
                                            </>
                                        )
                                    })}
                                    <div></div>
                                    <div className="employee-total text-center bold">
                                        {task.totalTime}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                ) : null}
            </div>
        </div >
    )
}

export default ProjectReport;