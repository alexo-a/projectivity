import React, { useState } from "react";
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
	const [state, dispatch] = useStoreContext();
	const [openState, setOpenState] = useState(false);
	const [addingProject, setAddingProject] = useState(false);
	const [newProjectName, setNewProjectName] = useState("");
	const [newProjectDescription, setNewProjectDescription] = useState("");
	const projectTitles = projects.map(curProject => curProject.title).sort();

	const [createProject, { error }] = useMutation(CREATE_PROJECT);

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
		if (!event.target.value) {
			event.target.className = "invalid";
		} else {
			event.target.className = "";
			setNewProjectName(event.target.value);
		}
	}

	const descriptionChanged = function(event) {
		setNewProjectDescription(event.target.value);
	}

	return (
		<div className="projectList">
			<button type="button" className={(!administrator && !projects.length) ? "empty" : ""} onClick={toggleOpenState}><span>{expandButtonText()}</span>{!!projects.length && <FontAwesomeIcon icon={(openState) ? faChevronUp : faChevronDown} />}</button>
			<CSSTransition
				in={openState}
				timeout={500}
				classNames="open"
			>
				<div>
					<ol>
						{projectTitles.map(curProject => {
							return (
								<li>{curProject}</li>
							)
						})}
					</ol>
					{administrator &&
					<CSSTransition
						in={addingProject}
						timeout={500}
						classNames="adding"
					>
						<form>
							<div>
								<input name="addProjectName" placeholder="Project Name" onChange={validateProjectName} onBlur={validateProjectName}></input>
								<button name="addButton" type="button" title="Add Project" className="redButton" onClick={addProject}>
									<FontAwesomeIcon icon={faPlus} />
								</button>
							</div>
							<div>
								<textarea name="addProjectDescription" placeholder="Project description (optional)" onChange={descriptionChanged}></textarea>
							</div>
						</form>
					</CSSTransition>}
				</div>
			</CSSTransition>
		</div>
	);
}

export default ProjectList;