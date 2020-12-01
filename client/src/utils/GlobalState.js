import React, { createContext, useContext } from "react";
import { useProjectivityReducer } from './reducers';

const StoreContext = createContext();
const { Provider } = StoreContext;

const StoreProvider = ({ value = [], ...props }) => {
	// Set default state here.
	const [state, dispatch] = useProjectivityReducer({
		employeeModalOpen: false,
        employeeModalTask: {},
		dashboardTasks: [],
		toDoCount: 0,
	  });
	return <Provider value={[state, dispatch]} {...props} />;
};

const useStoreContext = () => {
	return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };