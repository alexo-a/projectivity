import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import moment from "moment";
import Auth from "../utils/auth";
import { formatTimeSpan } from "../utils/helpers";

import DateTime from "react-datetime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCheck, faChevronLeft, faChevronRight, faTrash
} from "@fortawesome/free-solid-svg-icons";

import { QUERY_MY_TIMESHEETS } from "../utils/queries";
import { UPDATE_TIMESHEET_ENTRY, DELETE_TIMESHEET_ENTRY } from "../utils/mutations";
import { SHOW_ALERT_MODAL } from "../utils/actions";
import { useStoreContext } from '../utils/GlobalState';

function Timesheet() {
    const userId = Auth.getUserInfo()._id;

    const [state, dispatch] = useStoreContext();
    const [editEntry, setEditEntry] = useState({});
    const [timeSheetStart, setTimeSheetStart] = useState(moment().startOf("week"));

    const [updateTimesheetEntry, { updateError }] = useMutation(UPDATE_TIMESHEET_ENTRY);
    const [deleteTimesheetEntry, { deleteError }] = useMutation(DELETE_TIMESHEET_ENTRY);
    const { loading, data } = useQuery(QUERY_MY_TIMESHEETS,
        {
            variables: {
                userId,
                start: timeSheetStart.toDate(),
                end: moment(timeSheetStart).add(7, "d").toDate()
            }
        }
    );

    const advanceWeek = function() {
        setTimeSheetStart(moment(timeSheetStart).add(7, "d"));
    }

    const previousWeek = function() {
        setTimeSheetStart(moment(timeSheetStart).subtract(7, "d"));
    }

    const changeEditEntry = function(newEntry) {
        if (newEntry._id === editEntry._id) {
            let curEntry = {
                ...editEntry,
                ...newEntry,
                changed: true
            };

            if ((curEntry.start) && (!curEntry.end)) {
                curEntry.end = timesheets.find(item => item._id === curEntry._id).end;
            } else if ((curEntry.end) && (!curEntry.start)) {
                curEntry.start = timesheets.find(item => item._id === curEntry._id).start;
            }

            curEntry.timeSpan = moment(curEntry.end).diff(moment(curEntry.start), "minutes");

            setEditEntry(curEntry);
        } else {
            setEditEntry({ _id: newEntry._id });
        }
    }

    const processTimesheetEntry = function(entry) {
        const start = new Date(parseInt(entry.start));
        const end = new Date(parseInt(entry.end));

        return {
            _id: entry._id,
            start,
            end,
            note: entry.note,
            task: entry.task,
            timeSpan: moment(end).diff(moment(start), "minutes")
        }
    }

    const timesheets = data?.timesheets || [];

    const updateCurrentEntry = async function() {
        try {
            // If dates are set, check them out!  (Other logic requires both start and end to be set in the object, so we only need to check for start here)
            if (editEntry.start) {
                const now = moment(Date.now());
                const momStart = moment(editEntry.start);
                const momEnd = moment(editEntry.end);

                if (momStart.diff(now) > 0) {
                    dispatch({
                        type: SHOW_ALERT_MODAL,
                        modal: {
                            title: "Error",
                            text: "Start time cannot be in the future."
                        }
                    });
                    return;
                } else if (momEnd.diff(now) > 0) {
                    dispatch({
                        type: SHOW_ALERT_MODAL,
                        modal: {
                            title: "Error",
                            text: "End time cannot be in the future."
                        }
                    });
                    return;
                } else if (momStart.diff(momEnd) > 0) {
                    dispatch({
                        type: SHOW_ALERT_MODAL,
                        modal: {
                            title: "Error",
                            text: "End time cannot come before start time."
                        }
                    });
                    return;
                }
            }

            const variables = {
                entryId: editEntry._id,
                start: editEntry.start,
                end: editEntry.end,
                note: editEntry.note
            };

            const updateResponse = await updateTimesheetEntry(
            {
                variables
            });

            let updatedInfo = processTimesheetEntry(updateResponse.data.updateTimeSheetEntry);
            let changeMe = data.timesheets.findIndex(item => item._id === editEntry._id);

            data.timesheets[changeMe] = {
                ...updateResponse.data.updateTimeSheetEntry,
                task: data.timesheets[changeMe].task
            }

            setEditEntry({});
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

    const deleteCurrentEntry = function() {
        dispatch({
            type: SHOW_ALERT_MODAL,
            modal: {
                text: "This time sheet entry will be deleted.  Are you sure?",
                buttons: {
                    Yes: confirmDeleteEntry,
                    No: null
                }
            }
        });
    }

    const confirmDeleteEntry = async function() {
        try {
            await deleteTimesheetEntry({
                variables: {
                    entryId: editEntry._id
                }
            });

            let killMe = data.timesheets.findIndex(item => item._id === editEntry._id);

            data.timesheets.splice(killMe, 1);

            setEditEntry({ });
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

    const startChanged = function(newStart) {
        changeEditEntry({ _id: editEntry._id, start: newStart.toDate() });
    }

    const endChanged = function(newEnd) {
        changeEditEntry({ _id: editEntry._id, end: newEnd.toDate() });
    }

    const noteChanged = function(event) {
        changeEditEntry({ _id: editEntry._id, note: event.target.value });
    }

    const displayTimesheetEntry = function(entry) {
        const editThisEntry = function() {
            changeEditEntry({ _id: entry._id} );
        }

        return (<div key={entry._id} className="timesheetEntry" onClick={editThisEntry}>
            <div>
                <strong title={entry.task.project.description}>{entry.task.project.title}</strong> - <span title={entry.task.description}>{entry.task.title}</span>
            </div>
            <div>
                <DateTime
                    value={new Date(((editEntry._id === entry._id) && (editEntry.start)) ? editEntry.start : entry.start)}
                    dateFormat={"MM/DD/YY"}
                    onChange={startChanged}
                    onOpen={editThisEntry}
                    closeOnSelect={true}
                    inputProps={{ name: "start" }}
                />
                <span> - </span>
                <DateTime
                    value={new Date(((editEntry._id === entry._id) && (editEntry.end)) ? editEntry.end : entry.end)}
                    dateFormat={"MM/DD/YY"}
                    onChange={endChanged}
                    onOpen={editThisEntry}
                    closeOnSelect={true}
                    inputProps={{ name: "end" }}
                />
                <span> ({formatTimeSpan(((editEntry._id === entry._id) && (editEntry.timeSpan)) ? editEntry.timeSpan : entry.timeSpan)})</span>
            </div>
            <div>
                <label htmlFor="note">Note: </label>
                <input type="text" name="note" value={(editEntry._id === entry._id) ? editEntry.note : entry.note} onChange={noteChanged} onFocus={editThisEntry}></input>
            </div>
            <div className={"editControls" + ((editEntry._id === entry._id) ? " shown" : "")}>
                {((editEntry?._id === entry._id) && (editEntry.changed)) ?
                (<span name="accept" onClick={updateCurrentEntry} title="Save Changes">
                    <FontAwesomeIcon icon={ faCheck }></FontAwesomeIcon> 
                </span>)
                : <></>}
                <span name="cancel" onClick={deleteCurrentEntry} title="Delete This Entry">
                    <FontAwesomeIcon icon={ faTrash }></FontAwesomeIcon> 
                </span>
            </div>
        </div>);
    }

    return(
        <div>
            <h2 className="text-center">Timesheet for Week of {timeSheetStart.format("MM/DD/YY")} - {moment(timeSheetStart).add(6, 'd').format("MM/DD/YY")}</h2>
            <div className="timesheet">
                {(loading) ?
                    (<div className="loading" />) :
                    timesheets.map(sheet => displayTimesheetEntry(processTimesheetEntry(sheet)))
                }
            </div>
            {(!loading) ?
                <div className="timesheetNav">
                    <div onClick={previousWeek}><FontAwesomeIcon icon={ faChevronLeft }></FontAwesomeIcon>  Previous Week</div>
                    {(moment(timeSheetStart).add(7, "d").diff(moment(Date.now())) < 0) ?
                        <div onClick={advanceWeek}>Next Week <FontAwesomeIcon icon={ faChevronRight }></FontAwesomeIcon> </div>
                        : <></>
                    }
                </div>
                : <></>
            }
        </div>
    );
}

export default Timesheet