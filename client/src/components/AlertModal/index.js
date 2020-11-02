import React, { useState } from "react";

import { useStoreContext } from '../../utils/GlobalState';
import { CLEAR_ALERT_MODAL } from "../../utils/actions";

import "./style.css";

function AlertModal() {
	const [{ modal }, dispatch] = useStoreContext();

	const canClickOff = ((!modal) || (!modal.buttons) || (!!Object.entries(modal.buttons).find(button => {
		return !button[1];
	})));

	const clickOff = function(event) {
		if ((canClickOff) && (event.target.className.indexOf("modalBG") > -1)) {
			dispatch({ type: CLEAR_ALERT_MODAL });
		}
	}

	const handleButtonClick = function(event) {
		const buttonKey = event.target.getAttribute("data-key");
		const callback = ((modal.buttons) ? modal.buttons[buttonKey] : undefined);

		if (callback) {
			callback();
		}

		dispatch({ type: CLEAR_ALERT_MODAL });
	}

	function addButtonList(buttonList) {
		let buttonItems = Object.entries(buttonList);

		return buttonItems.map(curButton => {
			return <button type="button" key={curButton[0]} onClick={handleButtonClick} data-key={curButton[0]}>{curButton[0]}</button>
		})
	}

	if (modal) {
		return (
			<div className="modalBG" onClick={clickOff}>
				<div>
					{ modal.title && <h2>{modal.title}</h2>}
					<p>{modal.text}</p>
					<div className="buttonHolder">
						{ addButtonList(modal.buttons || { Ok: undefined }) }
					</div>
				</div>
			</div>
		)
	} else {
		return <></>;
	}
}

export default AlertModal;