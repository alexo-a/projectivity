import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faChevronUp, faChevronDown, faPlus
} from "@fortawesome/free-solid-svg-icons";
import "./style.css";

function ProjectList({ projects }) {
	const [openState, setOpenState] = useState(false);
	const projectTitles = projects.map(curProject => curProject.title).sort();

	const toggleOpenState = function() {
		setOpenState(!!projects.length && !openState);
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


	return (
		<div className="projectList">
			<button type="button" onClick={toggleOpenState}>{expandButtonText()} <FontAwesomeIcon icon={(openState) ? faChevronUp : faChevronDown} /></button>
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
				</div>
			</CSSTransition>
		</div>
	);
}

export default ProjectList;