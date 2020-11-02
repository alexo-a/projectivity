import React, { useState, useEffect } from "react";
import { useMutation } from '@apollo/react-hooks';
import { CSSTransition } from 'react-transition-group';
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faChevronUp, faChevronDown
} from '@fortawesome/free-solid-svg-icons'

import { ADD_TIMESHEET_ENTRY } from "../../utils/mutations"

import DateTime from 'react-datetime';

import "react-datetime/css/react-datetime.css";
import "./style.css";

function TimeTracker() {
	// TODO - Test data, this will need to come out of global state!!!
	const currentTask = {
		_id: "5f9ddb8d2fe5b33e703d52c7",
		title: "Promote Synergy",
		description: "Lorem ipsum dolor sit amet consectetur adipiscing elit, urna consequat felis vehicula class ultricies mollis dictumst, aenean non a in donec nulla. Phasellus ante pellentesque erat cum risus consequat imperdiet aliquam, integer placerat et turpis mi eros nec lobortis taciti, vehicula nisl litora tellus ligula porttitor metus.",
	}

	const [openState, setOpenState] = useState(true);
	const [startTime, setStartTime] = useState(new Date(Date.now()));
	const [endTime, setEndTime] = useState(undefined);
	const [timerState, setTimerState] = useState(0);

	const [addTimesheetEntry, { error }] = useMutation(ADD_TIMESHEET_ENTRY);

	// Timer hook.
	useEffect(() => {
		const calcTimer = function() {
			var tmpStart = moment(startTime);
			var tmpEnd = moment(endTime || Date.now());

			setTimerState(tmpEnd.diff(tmpStart, "minutes"));
		}

		let interval = setInterval(calcTimer, 1000);
		calcTimer(); // Force immediate recalculation.

		return () => clearInterval(interval);
	}, [ timerState, startTime, endTime ]);

	/* TODO - Once current Task is loaded form state, should be able to use this to reset the timesheet whenever the task is changed?
	useEffect(() => {
		setStartTime(new Date(Date.now()));
		setEndTime(undefined);
	}, [ currentTask ]);
	*/

	const formatTimer = function(timer) {
		if (timer >= 0) {
			let minutes = timer % 60;
			return Math.floor(timer / 60) + ":" + ((minutes < 10) ? "0" : "") + minutes;
		} else {
			return "N/A";
		}
	}

	const toggleExpand = function(event) {
		setOpenState(!openState);
	}

	const onStartTimeChanged = function(datetime) {
		let now = moment(Date.now());

		if (now.diff(moment(datetime)) >= 0) {
			setStartTime(datetime);
		} else {
			alert("Start time cannot be in the future.");
		}
	}

	const startTimeNow = function() {
		let tmpDate = new Date(Date.now());

		if ((endTime) && (moment(tmpDate).diff(endTime) > 0)) {
			tmpDate = endTime;
		}

		setStartTime(tmpDate);
	}

	const onEndTimeChanged = function(datetime) {
		let now = moment(Date.now());

		if (now.diff(moment(datetime)) >= 0) {
			setEndTime(datetime);
		} else {
			alert("End time cannot be in the future.");
		}
	}

	const endTimeNow = function() {
		let tmpDate = new Date(Date.now());

		setEndTime(tmpDate);
	}

	// TODO - Error alerts should go to a modal system!!
	const submitTimesheet = async function(event) {
		event.preventDefault();

		let now = moment(Date.now());

		if (now.diff(moment(startTime)) < 0) {
			alert("Cannot have a start time in the future!");
			return;
		}

		if (endTime) {
			let tmpEnd = moment(endTime);

			if (moment(startTime).diff(tmpEnd) > 0) {
				alert("End time cannot come before start time!");
				return;
			} else if (now.diff(tmpEnd < 0)) {
				alert("Cannot have an end time in the future!");
				return;
			}
		}

		try {
			await addTimesheetEntry(
				{
					variables: {
						taskId: currentTask._id,
						start: startTime,
						end: endTime || now.toDate(),
						note: document.querySelector("input[name='timeSheetNote']").value
					}
				}
			);

			alert("Timesheet submitted successfully!");
			// TODO - Clear currentTask from global state!
			document.querySelector("input[name='timeSheetNote']").value = "";
		} catch (e) {
			alert(e);
		}
	}

	if (!currentTask) {
		return <></>;
	}

	return (
		<CSSTransition
			in={openState}
			timeout={500}
			classNames="open"
		>
			<footer>
				<div>
					<div className="taskTitle">{currentTask.title}</div>
					<div className="timerHolder">
						<div>{formatTimer(timerState)}</div>
						<button type="button" onClick={toggleExpand}>
							<FontAwesomeIcon icon={(openState) ? faChevronDown : faChevronUp} />
						</button>
					</div>
				</div>
				<div className="taskDescription">{currentTask.description}</div>
				<form onSubmit={submitTimesheet}>
					<div>
						<div>
							<label htmlFor="startTime">Start Time:</label>
							<DateTime
								value={startTime}
								onChange={onStartTimeChanged}
								closeOnSelect={true}
								inputProps={{ name: "startTime" }}
							/>
							<button type="button" onClick={startTimeNow}>Now</button>
						</div>
						<div>
							<label htmlFor="endTime">End Time:</label>
							<DateTime
								value={endTime}
								onChange={onEndTimeChanged}
								closeOnSelect={true}
								inputProps={{ name: "endTime" }}
							/>
							<button type="button" onClick={endTimeNow}>Now</button>
						</div>
					</div>
					<div>
						<input name="timeSheetNote" type="text" placeholder="Add a note (optional)" maxLength="255"></input>
						<button type="submit">Submit</button>
					</div>
				</form>
			</footer>
		</CSSTransition>
	);
}

export default TimeTracker;