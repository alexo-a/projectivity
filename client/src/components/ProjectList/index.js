import React, { useState, useRef } from "react";
import { useMutation } from '@apollo/react-hooks';

import { CREATE_PROJECT } from "../../utils/mutations";
import { SHOW_ALERT_MODAL } from "../../utils/actions";
import { useStoreContext } from '../../utils/GlobalState';

import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faChevronUp, faChevronDown, faPlus
} from "@fortawesome/free-solid-svg-icons";

import "./style.css";

function ProjectList({ projects, administrator, groupId }) {
	const [, dispatch] = useStoreContext();
	const [rerenderState, setRerenderState] = useState(0); // Dummy state to force rendering.
	const [openState, setOpenState] = useState(false);
	const [addingProject, setAddingProject] = useState(false);
	const [newProjectName, setNewProjectName] = useState("");
	const [newProjectDescription, setNewProjectDescription] = useState("");
	const projectTitles = projects.map(curProject => curProject.title).sort();

	const [createProject] = useMutation(CREATE_PROJECT);

	const projectRef = useRef(null);
	const addRef = useRef(null);

	const toggleOpenState = function() {
		if ((administrator) || (projects.length)) {
			if (openState) {
				setAddingProject(false);
				setNewProjectName("");
				setNewProjectDescription("");
			}

			setOpenState(!openState);
		}
	}

	const expandButtonText = function() {
		switch (projects.length) {
			case 0:
				return "No Projects";
			case 1:
				return "1 Project";
			default:
				return projects.length + " Projects";
		}
	}

	const addProject = async function() {
		if (addingProject) {
			try {
				setAddingProject(false);

				if (!newProjectName) {
					setNewProjectDescription("");
					return;
				}

				const projectResult = await createProject( {
					variables: {
						groupId,
						title: newProjectName,
						description: newProjectDescription
					}
				});

				setNewProjectName("");
				setNewProjectDescription("");
				projects.push(projectResult.data.addProject);
				setRerenderState(rerenderState + 1);
			} catch (e) {
				dispatch({
					type: SHOW_ALERT_MODAL,
					modal: {
						title: "Error",
						text: e.toString()
					}
				});

				setAddingProject(true);
			}
		} else {
			setAddingProject(true);
		}
	}

	const validateProjectName = function(event) {
		setNewProjectName(event.target.value);

		if (!event.target.value) {
			event.target.className = "invalid";
		} else {
			event.target.className = "";
		}
	}

	const descriptionChanged = function(event) {
		setNewProjectDescription(event.target.value);
	}

	return (
		<div className="projectList">
			<button type="button" className={(!administrator && !projects.length) ? "empty" : ""} onClick={toggleOpenState}><span>{expandButtonText()}</span>{!!projects.length && <FontAwesomeIcon icon={(openState) ? faChevronUp : faChevronDown} />}</button>
			<CSSTransition
				nodeRef={projectRef}
				in={openState}
				timeout={500}
				classNames="open"
			>
				<div ref={projectRef}>
					<ol>
						{projectTitles.map(curProject => {
							return (
								<li key={curProject}>{curProject}</li>
							)
						})}
					</ol>
					{administrator &&
					<CSSTransition
						nodeRef={addRef}
						in={addingProject}
						timeout={500}
						classNames="adding"
					>
						<form ref={addRef}>
							<div>
								<input name="addProjectName" placeholder="Project Name" value={newProjectName} onChange={validateProjectName} onBlur={validateProjectName}></input>
								<button name="addButton" type="button" title="Add Project" className="redButton" onClick={addProject}>
									<FontAwesomeIcon icon={faPlus} />
								</button>
							</div>
							<div>
								<textarea name="addProjectDescription" placeholder="Project description (optional)" value={newProjectDescription} onChange={descriptionChanged}></textarea>
							</div>
						</form>
					</CSSTransition>}
				</div>
			</CSSTransition>
		</div>
	);
}

export default ProjectList;