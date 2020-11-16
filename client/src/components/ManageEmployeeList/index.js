import React, { useState } from "react";
import { useLazyQuery } from '@apollo/react-hooks';

import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faChevronUp, faChevronDown, faPlus
} from "@fortawesome/free-solid-svg-icons";

import { FIND_USER } from "../../utils/queries";

import "./style.css";

function ManageEmployeeList({ employees, label, addCallback }) {
	let interval;
	const [openState, setOpenState] = useState(false);
	const [addingUser, setAddingUser] = useState(false);

	const [findUser, { data }] = useLazyQuery(FIND_USER);

	const employeeNames = employees.map(curEmployee => curEmployee.username).sort();

	const addEmployee = async function() {
		if ((addingUser) && (data)) {
			if (data.findUser) {
				addCallback(data.findUser._id);
				setAddingUser(false);
				findUser({ variables: { searchField: "" }}); // Run a dummy query to get invalid results.
			} else {
				alert("Invalid user!");
			}
		} else {
			setAddingUser(true);
		}
	}

	const toggleOpenState = function() {
		setOpenState(!openState);

		if (data) {
			data.findUser = null;
		}

		if (employees.length) {
			setAddingUser(false);
		} else {
			addEmployee();
		}
	}

	const expandButtonText = function() {
		switch (employees.length) {
			case 0:
				return "No " + label + "s";
			case 1:
				return "1 " + label;
			default:
				return employees.length + " " + label + "s";
		}
	}

	const checkEmployee = async function(event) {
		if (interval) {
			clearInterval(interval);
		}

		if (data) {
			data.findUser = null;
		}

		interval = setTimeout(() => {
			try {
				findUser({
					variables: {
						searchField: event.target.value
					}
				});
			} catch(e) {
				console.log(e);
				if (data) {
					data.findUser = null;
				}
			}
		}, 500);
	}

	return (
		<div className="employeeList">
			<button type="button" title={(!employees.length) ? "Add " + label : ""} onClick={toggleOpenState}>{expandButtonText()} <FontAwesomeIcon icon={(openState) ? faChevronUp : faChevronDown} /></button>
			<CSSTransition
				in={openState}
				timeout={500}
				classNames="open"
			>
				<div>
					<ol>
						{employeeNames.map(curEmployee => {
							return (
								<li>{curEmployee}</li>
							)
						})}
					</ol>
					<div>
						{(addingUser) ? (<input name="addUser" onChange={checkEmployee} className={(data?.findUser) ? "userOk" : ""}></input>) : <></> }
						<button name="addButton" type="button" title={"Add " + label} className="redButton" onClick={addEmployee}>
							<FontAwesomeIcon icon={faPlus} />
						</button>
					</div>
				</div>
			</CSSTransition>
		</div>
	);
}

export default ManageEmployeeList;