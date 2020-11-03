import React, { useState } from "react";
import Container from "react-bootstrap/container"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useMutation } from "@apollo/react-hooks";
import { useStoreContext } from '../utils/GlobalState';
import getCurrentWeekInfo from "../utils/helpers"

function EmployeeReport() {
    //get employee id, projects + tasks they've worked on this week.
    const weekInfo = getCurrentWeekInfo();
    const weekNumber = weekInfo.weekNumber;
    const weekStart = weekInfo.weekStartDate;
    let hours;
    let name;
    return (
        <Container>
            <h2 class="text-center" id="projectName">Weekly Project Report for {name}</h2>
            <h3 class="text-center" id="date">Week of {weekStart} ({weekNumber})</h3>
            <h5 class="text-center">Time Logged: <span>{hours}</span></h5>

            <div class="mx-3">
                <Row class="border-bottom bg-dark text-light font-weight-bold align-bottom">
                    <Col xs={3}>
                        Project Name
                    </Col>
                    <Col xs={9}>
                        <Row>
                            <Col xs={6}>
                                Task Description
                            </Col>
                            <Col xs={3} class="text-center">
                                Task ID
                            </Col>
                            <Col xs={3} class="text-center">
                                Hours
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </Container >
    )
}
export default EmployeeReport;