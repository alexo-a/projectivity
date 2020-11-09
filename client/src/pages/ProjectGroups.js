import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faPlus
} from "@fortawesome/free-solid-svg-icons";
import { CSSTransition } from "react-transition-group";
import ManageProjectGroup from "../components/ManageProjectGroup";
import ProjectList from "../components/ProjectList";

import { MY_GROUPS } from "../utils/queries";
import { CREATE_PROJECT_GROUP } from "../utils/mutations";
import { SHOW_ALERT_MODAL } from "../utils/actions";
import { useStoreContext } from '../utils/GlobalState';

import "./ProjectGroup.css";

function ProjectGroups() {
    const [state, dispatch] = useStoreContext();
    const { loading, data } = useQuery(MY_GROUPS);
    const [ showAddGroup, setShowAddGroup ] = useState(false);
    const [createProjectGroup, { error }] = useMutation(CREATE_PROJECT_GROUP);

    const groups = data?.myGroups;

    const toggleAddingGroup = function() {
        document.querySelector("input[name='newGroupName']").value = "";
        setShowAddGroup(!showAddGroup);
    }

    const submitNewGroup = async function(event) {
        event.preventDefault();

        const newTitle = document.querySelector("input[name='newGroupName']").value;

        if (!newTitle) {
            dispatch({
				type: SHOW_ALERT_MODAL,
				modal: {
					title: "Error",
					text: "You must enter a name."
				}
            });
            return;
        }

        try {
			const groupResult = await createProjectGroup(
				{
					variables: {
						title: newTitle
					}
				}
            );
            
            groups.administrator.push(groupResult.data.addProjectGroup);
		} catch (e) {
			dispatch({
				type: SHOW_ALERT_MODAL,
				modal: {
					title: "Error",
					text: e
				}
			});
        }

        toggleAddingGroup();
    }

    if (loading) {
        return <></>;
    }

    return(
        <div className="groupListing">
            { (groups.administrator.length) ? (
                <>
                    <h2>Groups You Own:</h2>
                    <div className="groupContainer">
                        {
                            groups.administrator.map(curGroup =>{
                                return (<ManageProjectGroup
                                    key={curGroup.id}
                                    group={curGroup}
                                />);
                            })
                        }
                    </div>
                </>
            ) : <></> }
            <CSSTransition
                in={showAddGroup}
                timeout={500}
                classNames="open"
		    >
                <div className="addGroupForm">
                    <h3>
                        { (showAddGroup) ?
                            "Adding a Group" :
                            (<button type="button" className="redButton" onClick={toggleAddingGroup}>
                                <FontAwesomeIcon icon={faPlus} />
                                Add a Group
                            </button>)
                        }
                    </h3>
                    <form>
                        <div>
                            <label htmlFor="newGroupName">Name:</label>
                            <input name="newGroupName"></input>
                        </div>
                        <div>
                            <button type="submit" className="redButton" onClick={submitNewGroup}>Add</button>
                            <button type="button" className="redButton" onClick={toggleAddingGroup}>Cancel</button>
                        </div>
                    </form>
                </div>
            </CSSTransition>
            { (groups.member.length) ? (
                <>
                    <h2>Groups You Belong To:</h2>
                    <div className="groupContainer">
                        {
                            groups.member.map(curGroup => {
                                return (<div key={curGroup._id} className="projectGroup card">
                                    <h3>{curGroup.title}</h3>
                                    <p>
                                        <strong>Administrator: </strong>
                                        {curGroup.administrator.username}
                                    </p>
                                    <ProjectList projects={curGroup.projects} />
                                </div>);
                            })
                        }
                    </div>
                </>
            ): <></> }
        </div>
    );
}

export default ProjectGroups;