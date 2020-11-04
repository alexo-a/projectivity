import React, { createContext, useContext } from "react";
import { useProjectivityReducer } from './reducers';

const StoreContext = createContext();
const { Provider } = StoreContext;

const StoreProvider = ({ value = [], ...props }) => {
	// Set default state here.
	const [state, dispatch] = useProjectivityReducer({
		timeSheetTask: {
            _id: "5fa099f5a8cd115d30f478ce",
			title: "Promote Synergy",
			description: "This is test data.  It should be removed from utils/GlobalState.js once a method for selecting tasks is created.",
		}
	  });
	return <Provider value={[state, dispatch]} {...props} />;
};

const useStoreContext = () => {
	return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };