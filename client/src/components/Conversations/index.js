import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Auth from "../../utils/auth";
import { CSSTransition } from "react-transition-group";
//import moment from "moment";

import { MY_CONVERSATIONS } from "../../utils/queries";
import {
	START_CONVERSATION,
//	JOIN_CONVERSATION,
//	LEAVE_CONVERSATION,
	SEND_CONVERSATION_MESSAGE,
	MARK_CONVERSATION_READ
} from "../../utils/mutations";
import { SHOW_ALERT_MODAL, UNQUEUE_CONVERSATION } from "../../utils/actions";
import { useStoreContext } from '../../utils/GlobalState';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faChevronLeft, faChevronRight, faCommentAlt, faComments, faTimes
} from "@fortawesome/free-solid-svg-icons";

import "./style.css";

function Conversations() {
	const [state, dispatch] = useStoreContext();
	const [openState, setOpenState] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);
	const [activeConvo, setActiveConvo] = useState('');
	const [currentConvo, setCurrentConvo] = useState({ participants: [], messages: []});
	const [showMessageList, setShowMessageList] = useState(false);
	//const [editingUsers, setEditingUsers] = useState(false);
	const [curMessage, setCurMessage] = useState('');

	const { data } = useQuery(MY_CONVERSATIONS, { pollInterval: 5000 });
	const [ startConversation ] = useMutation(START_CONVERSATION);
	//const [ addToConversation ] = useMutation(JOIN_CONVERSATION);
	//const [ leaveConversation ] = useMutation(LEAVE_CONVERSATION);
	const [ sendMessage ] = useMutation(SEND_CONVERSATION_MESSAGE);
	const [ markConversationRead ] = useMutation(MARK_CONVERSATION_READ);

	const messageListRef = useRef(null);
	const messageHistoryRef = useRef(null);
	const messageInputRef = useRef(null);
	const myId = Auth.getUserInfo()._id;
	const conversations = data?.myConversations || [];

	// Controls activeConvo and related settings.
	useEffect(() => {
		const determineCurrentConversation = function() {
			if (state.conversation) {
				setOpenState(true);
				setShowMessageList(true);
				setActiveConvo('');
	
				return {
					participants: state.conversation,
					messages: []
				}
			} else {
				let myConvo = data?.myConversations.find(convo => convo._id === activeConvo) || { participants: [], messages: []};
				setActiveConvo(myConvo._id);
				return myConvo;
			}
		}

		setCurrentConvo(determineCurrentConversation());
	}, [ activeConvo, state.conversation, data?.myConversations]);

	// When we get back conversation info, set active convo to the newest one if user isn't currently using the widget.
	useEffect(() => {
		if(data?.myConversations) {
			setUnreadCount(data.myConversations.filter(convo => !convo.read.find(myRead => myRead._id === myId)).length);

			if (!openState) {
				let selectedConvo = -1;
				let selectedDate = 0;
				for(let i = 0; i < data.myConversations.length; i++) {
					if (data.myConversations[i].messages[data.myConversations[i].messages.length - 1].sent > selectedDate) {
						selectedConvo = i;
					}
				}

				setActiveConvo(selectedConvo < 0 ? '' : data.myConversations[selectedConvo]._id);
			}
		}
	}, [data?.myConversations, myId, openState]);

	useEffect(() => {
		async function doUpdate() {
			if (openState) {
				if (messageHistoryRef.current) {
					messageHistoryRef.current.scrollTop = messageHistoryRef.current.scrollHeight;
					messageInputRef.current.focus();
				}

				if ((currentConvo._id) && (!currentConvo.read.find(myRead => myRead._id === myId))) {
					try {
						await markConversationRead({variables: { conversationId: currentConvo._id } });
						currentConvo.read.push({ _id: myId });
						setUnreadCount(data.myConversations.filter(convo => !convo.read.find(myRead => myRead._id === myId)).length);
					} catch (e) {
						console.log(e.toString());
					}
				}
			}
		}

		doUpdate();
	}, [data?.myConversations, currentConvo, openState, myId, markConversationRead]);

	const toggleOpenState = function() {
		setOpenState(!openState);

		if (state.conversation) {
			dispatch({ type: UNQUEUE_CONVERSATION });
		}
	}

	const modalClick = function(event) {
		if (event.target.className === "conversationModalBG") {
			toggleOpenState();
		}
	}

	const changeActiveConvo = async function(convo) {
		//setEditingUsers(!convo);
		setActiveConvo(convo);
		setShowMessageList(false);
		setCurMessage('');

		if (convo) {
			// Navigated away from a pending conversation, so kill it.
			if (state.conversation) {
				dispatch({ type: UNQUEUE_CONVERSATION });
			}
		}
	}

	const toggleShowMessageList = function() {
		setShowMessageList(!showMessageList);
	}

/*	const toggleEditingUsers = function() {
		setEditingUsers(!editingUsers);
	}*/

	const handleMessageChange = function(event) {
		setCurMessage(event.target.value);
	}

	const sendMessageButton = async function(event) {
		event.preventDefault();

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
				const variables = {
					participants: currentConvo.participants.map(user => user._id),
					initialMessage: curMessage
				};
				variables.participants.push(myId);

				const result = await startConversation({ variables });

				conversations.push(result.data.startConversation);
				changeActiveConvo(result.data.startConversation._id);
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

	if ((!conversations?.length) && (!currentConvo?.participants?.length)) {
		return <></>;
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
						<div onClick={toggleShowMessageList}>Select Conversation <FontAwesomeIcon icon={faChevronLeft} /></div>
						<ul>
							{conversations.map(convo => (<li key={convo._id} className={(convo._id === activeConvo ? 'active' : '')} onClick={() => { changeActiveConvo(convo._id); }}>
								{convo.participants.filter(curUser => curUser._id !== myId).map(curUser => curUser.username).join(', ')}
								<FontAwesomeIcon icon={faChevronRight} />
							</li>))}
						</ul>
					</div>
					<div className="conversationModalDiscussion">
						<div></div>
						<div className="conversationModalChat">
							<div className="conversationModalMessages" ref={messageHistoryRef}>
								{(currentConvo) ? <> 
									{(currentConvo.messages.length) ? currentConvo.messages.map((message, index, arr) =>
									<div key={message._id} className={(message.sender._id === myId) ? 'sent' : ''}>
										{((index === 0) || (arr[index - 1].sender._id.toString() !== message.sender._id.toString())) && <span>{message.sender.username}</span>}
										<p>{message.message}</p>
									</div>
									) :
									<div>
										<span>Start a conversation with {currentConvo.participants.map(user => user.username).join(', ')}:</span>
									</div>
								}
								</> : <></>}
							</div>
							<form className="conversationModalInputs">
								<input type="text" onChange={handleMessageChange} value={curMessage} ref={messageInputRef}></input>
								<button type="submit" className="redButton" onClick={sendMessageButton}><FontAwesomeIcon icon={faCommentAlt} /></button>
							</form>
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

	/*	UNUSED MARKUP TO ENABLE CREATION OF NEW CONVERSATION:
		<li className={!activeConvo ? 'active' : ''} onClick={() => { changeActiveConvo(''); }}>
			Create new...
			<FontAwesomeIcon icon={faChevronRight} />
		</li>
	*/
}

export default Conversations;