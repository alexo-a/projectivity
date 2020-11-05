import React from "react";
//import Container from "react-bootstrap/container"
//import Row from 'react-bootstrap/Row'
//import Col from 'react-bootstrap/Col'
import { getCurrentWeekInfo } from "../utils/helpers"
import Auth from "../utils/auth";
import { useQuery } from "@apollo/react-hooks";
import { QUERY_MY_TIMESHEETS } from "../utils/queries";

function processTimeSheets(timesheets) {

    let compilation = [];
    //let condensedProjectTaskList= [];
    let uniqueProjects = new Set();
    //let projectTitles=[];
    let sum = 0;
    for ( let i in timesheets) {
        uniqueProjects.add(timesheets[i].task.project.title)
        const duration = parseFloat(((parseInt(timesheets[i].end) - parseInt(timesheets[i].start)) / 3600000))
        sum += duration
        let flag = false;
        for (let j in compilation) {
            if ((timesheets[i].task._id=== compilation[j][1])) {
                compilation[j][2] += duration
                flag = true;
                break
            }
        };
        if (!flag) {
            compilation.push([
                timesheets[i].task.project.title,
                timesheets[i].task._id,
                duration,
                timesheets[i].task.title
            ])
        };
        //condensedProjectTaskList.push({ title: timesheets[i].task.project.title, tasks: timesheets[i].task._id});
    }
    sum = sum.toFixed(2)
    
    console.log(compilation)
    console.log(uniqueProjects)
    //let dataTree = {}
    //let dataTree = uniqueProjects.map(arr => arr.reduce((a, c, i) => (a['column' + (i + 1)] = c, a), {}))
    let dataTree = []
    uniqueProjects.forEach(proj=> {dataTree.push({title: proj, tasksWithDuration:[]})})
    
    compilation.forEach(uniqueTask => {
        for (let i=0; i < dataTree.length; i++) {
            if(uniqueTask[0]===dataTree[i].title){
                dataTree[i].tasksWithDuration.push({title: uniqueTask[3], duration: uniqueTask[2]})
                break;
            }
        }
    })

    console.log(dataTree)
    //console.log(`sum of timesheets: ${sum} hours`)
    return { compilation, sum, dataTree}//, condensedProjectTaskList}
}

function EmployeeReport() {
    //get employee id, projects + tasks they've worked on this week.

    const weekInfo = getCurrentWeekInfo();
    const weekNumber = weekInfo.weekNumber;
    const weekStart = weekInfo.weekStartDate;

    const userInfo = Auth.getUserInfo();
    console.log(userInfo)
    const username = userInfo.username;
    const userId = userInfo._id;

    const { loading, data } = useQuery(QUERY_MY_TIMESHEETS,
        {
            variables: {
                userId,
                start: new Date(weekStart)
            }
        }
    );

    const timesheets = data?.timesheets || {};

    let hours = 0;
    let dataTree={}
    if (loading) {
        return null
    }
    if (!loading) {

        console.dir(timesheets)
        const compilationInfo = processTimeSheets(timesheets)
        const compiledSums = compilationInfo.compilation
        dataTree= compilationInfo.dataTree
        hours = compilationInfo.sum

        
    }


    return (
        <div className="bootstrap-wrapper">
            <div className="container-fluid">
                <div className="row">
                    <h2 className="text-center" id="projectName">
                        Weekly Project Report for {username}
                    </h2>
                </div>
                <div className="row">
                    <h3 className="text-center" id="date">
                        Week of {weekStart} (W{weekNumber})
                    </h3>
                </div>
                <div className="row">
                    <h5 className="text-center">
                        Time Logged this Week: <span>{hours}</span>
                    </h5>
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
                        ) : null }
                    </div>
                </div >
            </div >
        </div>
    )
}
export default EmployeeReport;

