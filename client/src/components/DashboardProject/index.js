import React, { useState, useRef } from "react";
import { useStoreContext } from '../../utils/GlobalState';

import { CSSTransition } from "react-transition-group";
import DisplayUser from '../DisplayUser';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faChevronUp, faChevronDown
} from "@fortawesome/free-solid-svg-icons";

import "./style.css";

function DashBoardProject({ project, selectTaskCallback }) {
	const [state, dispatch] = useStoreContext();
	const [ openState, setOpenState ] = useState(false);

	const projectRef = useRef(null);

	const toggleOpenState = function() {
		setOpenState(!openState);
	}

	return (<div className="dashboardProject card">
		<div className="projectTitle">
			<h3>{project.projectTitle}</h3>
			<button type="button" className="redButton" onClick={toggleOpenState}><FontAwesomeIcon icon={(openState) ? faChevronUp : faChevronDown} /></button>
		</div>
		<CSSTransition
				nodeRef={projectRef}
				in={openState}
				timeout={500}
				classNames="open"
			>
			<div className="projectDescription" ref={projectRef}>
				<p>
					<strong>Managers: </strong>
					{project.projectManagers.map(curManager => <DisplayUser key={curManager._id} user={curManager} />)}
				</p>
				<p>{project.projectDescription}</p>
			</div>
		</CSSTransition>
		<div className="taskContainer">
			{project.tasks.map(task => (<div key={task.taskId} className="taskCard" data-id={task.taskId}>
				<div className="cardTitle"><h4>{task.taskTitle}</h4></div>
				<div className="cardBody">{task.taskDescription}</div>
				<div className="cardFooter">
					{(state.timeSheetTask && task.taskId === state.timeSheetTask._id) ?
						<button type="button" disabled>Selected</button> :
						<button type="button" className="redButton" onClick={() => { selectTaskCallback(task); }}>Select</button>
					}
				</div>
			</div>))}
		</div>
	</div>);
}

export default DashBoardProject;