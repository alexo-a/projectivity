import React, { useEffect } from "react";
import Container from "react-bootstrap/container"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { getCurrentWeekInfo } from "../utils/helpers"
import Auth from "../utils/auth";
import { useQuery } from "@apollo/react-hooks";
import { QUERY_MY_TIMESHEETS } from "../utils/queries";

function addTimeSheetSums(timesheets) {
    let compilation = [];
    let sum = 0;
    let i = 0;
    for (i in timesheets) {
        const length = parseFloat(((parseInt(timesheets[i].end) - parseInt(timesheets[i].start)) / 3600000))
        sum += length
        let j = 0;
        let flag = false;
        for (j in compilation) {
            if ((timesheets[i].task._id === compilation[j][0])) {
                compilation[j][1] += length
                flag = true;
                break
            }
        }
        if (!flag) {
            compilation.push([
                timesheets[i].task._id,
                length
            ])
        }
    }
    sum = sum.toFixed(2)
    console.log(compilation)
    console.log(`sum of timesheets: ${sum} hours`)
    return { compilation, sum }
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
                userId
                //start: new Date(1604443130000)
            }
        }
    );

    const timesheets = data?.timesheets || {};

    let hours = 0;
    if (!loading) {
        console.dir(timesheets)
        const compilationInfo = addTimeSheetSums(timesheets)
        const compiledSums = compilationInfo.compilation
        hours = compilationInfo.sum
    }

    if (loading) {
        return null
    }
    return (
        <Container>
            <Row>
            <h2 className="text-center" id="projectName">
                Weekly Project Report for {username}
            </h2>
            </Row>
            <Row>
            <h3 className="text-center" id="date">
                Week of {weekStart} ({weekNumber})
            </h3>
            </Row>
            <Row>
            <h5 className="text-center">
                Time Logged: <span>{hours}</span>
            </h5>
            </Row >
            <Row>
            <div className="mx-3">
                {}
            </div>
            </Row >
        </Container >
    )
}
export default EmployeeReport;

