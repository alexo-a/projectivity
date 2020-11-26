import React, { useState, useEffect, useRef } from "react";
import { useMutation } from "@apollo/react-hooks";
import { CSSTransition } from "react-transition-group";
import moment from "moment";
import { formatTimeSpan } from "../../utils/helpers";

import { ADD_TIMESHEET_ENTRY } from "../../utils/mutations";
import { CLEAR_TIMESHEET_TASK, SHOW_ALERT_MODAL } from "../../utils/actions";
import { useStoreContext } from '../../utils/GlobalState';

import DateTime from "react-datetime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faChevronUp, faChevronDown
} from "@fortawesome/free-solid-svg-icons";

import "react-datetime/css/react-datetime.css";
import "./style.css";

function TimeTracker() {
	const [state, dispatch] = useStoreContext();
	const [openState, setOpenState] = useState(true);
	const [startTime, setStartTime] = useState(new Date(Date.now()));
	const [endTime, setEndTime] = useState(undefined);
	const [timerState, setTimerState] = useState(0);
	const currentTask = state.timeSheetTask;

	const [addTimesheetEntry] = useMutation(ADD_TIMESHEET_ENTRY);

	const trackerRef = useRef(null);

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

	// Reset times when task changes.
	useEffect(() => {
		setStartTime(new Date(Date.now()));
		setEndTime(undefined);
	}, [ currentTask ]);

	const toggleExpand = function(event) {
		setOpenState(!openState);
	}

	const onStartTimeChanged = function(datetime) {
		let now = moment(Date.now());

		if (now.diff(moment(datetime)) >= 0) {
			setStartTime(datetime);
		} else {
			dispatch({
				type: SHOW_ALERT_MODAL,
				modal: {
					title: "Error",
					text: "Start time cannot be in the future."
				}
			});
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
			dispatch({
				type: SHOW_ALERT_MODAL,
				modal: {
					title: "Error",
					text: "End time cannot be in the future."
				}
			});
		}
	}

	const endTimeNow = function() {
		let tmpDate = new Date(Date.now());

		setEndTime(tmpDate);
	}

	const refreshTimesheet = function() {
		setStartTime(new Date(Date.now()));
		setEndTime(undefined);
		document.querySelector("input[name='timeSheetNote']").value = "";
	}

	const clearTimeSheet = function() {
		dispatch({ type: CLEAR_TIMESHEET_TASK });
	}

	const submitTimesheet = async function(event) {
		event.preventDefault();

		let now = moment(Date.now());

		if (now.diff(moment(startTime)) < 0) {
			dispatch({
				type: SHOW_ALERT_MODAL,
				modal: {
					title: "Error",
					text: "Start time cannot be in the future."
				}
			});
			return;
		}

		if (endTime) {
			let tmpEnd = moment(endTime);

			if (moment(startTime).diff(tmpEnd) > 0) {
				dispatch({
					type: SHOW_ALERT_MODAL,
					modal: {
						title: "Error",
						text: "End time cannot come before start time."
					}
				});
				return;
			} else if (now.diff(tmpEnd < 0)) {
				dispatch({
					type: SHOW_ALERT_MODAL,
					modal: {
						title: "Error",
						text: "End time cannot be in the future."
					}
				});
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

			dispatch({
				type: SHOW_ALERT_MODAL,
				modal: {
					title: "Success!",
					text: "Timesheet submitted successfully!\n\nKeep this task active?",
					buttons: {
						Yes: refreshTimesheet,
						No: clearTimeSheet
					}
				}
			});
		} catch (e) {
			dispatch({
				type: SHOW_ALERT_MODAL,
				modal: {
					title: "Error",
					text: e.toString()
				}
			});
		}
	}

	if (!currentTask) {
		return <></>;
	}

	return (
		<CSSTransition
			nodeRef={trackerRef}
			in={openState}
			timeout={500}
			classNames="open"
		>
			<footer ref={trackerRef}>
				<div>
					<div className="trackedTaskTitle">{currentTask.title}</div>
					<div className="timerHolder">
						<div>{formatTimeSpan(timerState)}</div>
						<button type="button" className="redButton" onClick={toggleExpand}>
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
						<div className="endTimeHolder">
							<label htmlFor="endTime">End Time:</label>
							<DateTime
								value={endTime}
								onChange={onEndTimeChanged}
								closeOnSelect={true}
								renderInput={(props) => {
									return <input {...props} name="endTime" autocomplete="off" value={(endTime) ? props.value : ''} />
								}}
							/>
							<button type="button" onClick={endTimeNow}>Now</button>
						</div>
					</div>
					<div>
						<input name="timeSheetNote" type="text" placeholder="Add a note (optional)" maxLength="255"></input>
						<button type="submit" className="redButton">Submit</button>
					</div>
				</form>
			</footer>
		</CSSTransition>
	);
}

export default TimeTracker;