import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Auth from "../../utils/auth";
import { CSSTransition } from "react-transition-group";
import moment from "moment";

import { MY_CONVERSATIONS } from "../../utils/queries";
import {
	START_CONVERSATION,
	JOIN_CONVERSATION,
	LEAVE_CONVERSATION,
	SEND_CONVERSATION_MESSAGE,
	MARK_CONVERSATION_READ
} from "../../utils/mutations";
import { SHOW_ALERT_MODAL } from "../../utils/actions";
import { useStoreContext } from '../../utils/GlobalState';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faChevronRight, faCommentAlt, faComments, faTimes
} from "@fortawesome/free-solid-svg-icons";

import "./style.css";

function Conversations() {
	const [state, dispatch] = useStoreContext();
	const [openState, setOpenState] = useState(false);
	const [activeConvo, setActiveConvo] = useState('');
	const [showMessageList, setShowMessageList] = useState(false);
	const [editingUsers, setEditingUsers] = useState(false);
	const [curMessage, setCurMessage] = useState('');

	const { loading, data } = useQuery(MY_CONVERSATIONS, { pollInterval: 5000 });
	const [ startConversation, { startError } ] = useMutation(START_CONVERSATION);
	const [ addToConversation, { joinError } ] = useMutation(JOIN_CONVERSATION);
	const [ leaveConversation, { leaveError } ] = useMutation(LEAVE_CONVERSATION);
	const [ sendMessage, { sendError } ] = useMutation(SEND_CONVERSATION_MESSAGE);
	const [ markConversationRead, { readError } ] = useMutation(MARK_CONVERSATION_READ);

	const messageListRef = useRef(null);
	const myId = Auth.getUserInfo()._id;
	const conversations = data?.myConversations || [];
	let unreadCount = conversations.filter(convo => !convo.read.find(myRead => myRead._id === myId)).length;
	const currentConvo = conversations.find(convo => convo._id === activeConvo) || { participants: [], messages: []};

	// When we get back conversation info, set active convo to the newest one if user isn't currently using the widget.
	useEffect(() => {
		unreadCount = conversations.filter(convo => !convo.read.find(myRead => myRead._id === myId)).length;

		if(conversations) {
			if (!openState) {
				let selectedConvo = -1;
				let selectedDate = 0;
				for(let i = 0; i < conversations.length; i++) {
					if (conversations[i].messages[conversations[i].messages.length - 1].sent > selectedDate) {
						selectedConvo = i;
					}
				}

				setActiveConvo(selectedConvo < 0 ? '' : conversations[selectedConvo]._id);
			}
		}
	}, [conversations]);

	const toggleOpenState = function() {
		setOpenState(!openState);
	}

	const modalClick = function(event) {
		if (event.target.className === "conversationModalBG") {
			toggleOpenState();
		}
	}

	const changeActiveConvo = async function(convo) {
		setEditingUsers(!convo);
		setActiveConvo(convo);
		setShowMessageList(false);

		if ((convo) && (conversations.find(tmpConvo => tmpConvo._id === convo).read.indexOf(myId) > -1)) {
			try {
				await markConversationRead({variables: { conversationId: convo } });
				conversations.find(tmpConvo => tmpConvo._id === convo).read.push(myId);
			} catch (e) {
				console.log(e.toString());
			}
		}
	}

	const toggleShowMessageList = function() {
		setShowMessageList(!showMessageList);
	}

	const toggleEditingUsers = function() {
		setEditingUsers(!editingUsers);
	}

	const handleMessageChange = function(event) {
		setCurMessage(event.target.value);
	}

	const sendMessageButton = async function() {
		if (!curMessage) return;

		try
		{
			if (!currentConvo.participants.length) {
				dispatch({
					type: SHOW_ALERT_MODAL,
					modal: {
						title: "Error",
						text: "You must select someone to send your message to."
					}
				});
			} else if (currentConvo._id) {
				const result = await sendMessage({variables: {
					conversationId: currentConvo._id,
					message: curMessage
				}});

				conversations.find(convo => convo._id === currentConvo._id).messages = result.data.sendConversationMessage.messages;
				setCurMessage('');
			} else {
				const result = await startConversation({variables: {
					participants: currentConvo.participants,
					initialMessage: curMessage
				}});

				conversations.push(result.data.startConversation);
			}
		}
		catch (e) {
			dispatch({
				type: SHOW_ALERT_MODAL,
				modal: {
					title: "Error",
					text: e.toString()
				}
			});
		}
	}

	return <>
	{openState && (<div className="conversationModalBG" onClick={modalClick}>
		<div className="conversationModal">
			<div className="conversationModalHeader">
				<div />
				<h3>Conversations</h3>
				<FontAwesomeIcon icon={faTimes} onClick={toggleOpenState} />
			</div>
			<CSSTransition
				nodeRef={messageListRef}
				in={showMessageList}
				timeout={500}
				classNames="show-message"
			>
				<div className="conversationModalBody" ref={messageListRef}>
					<div className="conversationModalList">
						<div onClick={toggleShowMessageList}>Select Conversation...</div>
						<ul>
							{conversations.map(convo => (<li key={convo._id} className={(convo._id === activeConvo ? 'active' : '')} onClick={() => { changeActiveConvo(convo._id); }}>
								{convo.participants.filter(curUser => curUser._id !== myId).map(curUser => curUser.username).join(', ')}
								<FontAwesomeIcon icon={faChevronRight} />
							</li>))}
							<li className={!activeConvo ? 'active' : ''} onClick={() => { changeActiveConvo(''); }}>
								Create new...
								<FontAwesomeIcon icon={faChevronRight} />
							</li>
						</ul>
					</div>
					<div className="conversationModalDiscussion">
						<div></div>
						<div className="conversationModalChat">
							<div className="conversationModalMessages">
								{currentConvo && currentConvo.messages.map((message, index, arr) =>
								<div key={message._id} className={(message.sender._id === myId) ? 'sent' : ''}>
									{((index === 0) || (arr[index - 1].sender._id.toString() !== message.sender._id.toString())) && <span>{message.sender.username}</span>}
									<p>{message.message}</p>
								</div>
								)}
							</div>
							<div className="conversationModalInputs">
								<input type="text" onChange={handleMessageChange} value={curMessage}></input>
								<button type="button" className="redButton" onClick={sendMessageButton}><FontAwesomeIcon icon={faCommentAlt} /></button>
							</div>
						</div>
					</div>
				</div>
			</CSSTransition>
		</div>
	</div>)}
	<div className="conversationAlert" onClick={toggleOpenState}>
		<div>
			<FontAwesomeIcon icon={faComments} />
			{!!unreadCount && <p>{unreadCount}</p>}
		</div>
	</div>
	</>;
}

export default Conversations;