import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_TASK_STATUS } from '../../utils/mutations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCheck
} from '@fortawesome/free-solid-svg-icons';

function UpdateTask({ task }) {
    const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);
    const [, setRefreshState] = useState({refresh: true});

    const handleTaskStatus = async function() {
        if (!task.completed) {
            try {
                await updateTaskStatus({
                    variables: {
                        id: task._id,
                        completed: true
                    }
                });
                setRefreshState({refresh: true});
            } catch (e) {
                console.error(e);
            }
        }
        if (task.completed) {
            try {
                await updateTaskStatus({
                    variables: {
                        id: task._id,
                        completed: false
                    }
                });
                setRefreshState({refresh: true});
            } catch (e) {
                console.error(e);
            }
        }
    }

    if (task.completed) {
        return (
            <div className="markIncomplete flex align-center" onClick={handleTaskStatus}><span>Mark Incomplete</span><FontAwesomeIcon icon={faCheck}></FontAwesomeIcon></div>
        )
    }

    else {
        return (
            <div className="markComplete flex align-center" onClick={handleTaskStatus}>Mark Complete</div>
        )
    }
}

export default UpdateTask;