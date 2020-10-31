import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'

function Timesheet() {
    return(
        <div className="createClockIn">
            <input type="text" placeholder="Task Name" className="createClockInTaskName"></input>
            <input type="text" placeholder="memo"></input>
            <button className="flex align-center success"><span className="show-lg-up">CLOCK IN</span>&nbsp;&nbsp;<FontAwesomeIcon icon={faClock}></FontAwesomeIcon></button>
        </div>
    );
}

export default Timesheet