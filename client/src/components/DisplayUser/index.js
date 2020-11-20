import React from "react";
import Auth from "../../utils/auth";
import { useStoreContext } from '../../utils/GlobalState';
import { SHOW_ALERT_MODAL, QUEUE_CONVERSATION } from "../../utils/actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faComments
} from "@fortawesome/free-solid-svg-icons";

function DisplayUser({ user }) {
    const [, dispatch] = useStoreContext();

    const handleClick = function() {
        if (Auth.loggedIn()) {
            queueConversation();
        } else {
            dispatch({
				type: SHOW_ALERT_MODAL,
				modal: {
					title: "Sign Up Required",
                    text: "You need an account to message other users.  Proceed to signup?",
                    buttons: {
                        Ok: () => {
                            window.location.assign('/signup');
                            queueConversation();
                        },
                        Cancel: null
                    }
				}
			});
        }
    }

    const queueConversation = function() {
        dispatch({
            type: QUEUE_CONVERSATION,
            participants: [ user ]
        });
    }

    return (<span className="displayUser" title="Click to send a message to this user." onClick={handleClick}>
        {user.username}
        <FontAwesomeIcon icon={faComments} />
    </span>);
}

export default DisplayUser;