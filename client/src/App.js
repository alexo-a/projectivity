import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import Auth from "./utils/auth";

import { StoreProvider } from './utils/GlobalState';
import Nav from './components/Nav';
import TimeTracker from './components/TimeTracker';
import AlertModal from './components/AlertModal';
import Timesheet from './pages/Timesheet';
import Reports from './pages/Reports';
import Projects from './pages/Projects';
import Login from './pages/Login';
import Signup from './pages/Signup';

const client = new ApolloClient({
  request: (operation) => {
    const token = localStorage.getItem('id_token')
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    })
  },
  uri: '/graphql',
})

if (Auth.loggedIn()) {
  
}

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <StoreProvider>
            {Auth.loggedIn() ? (
              <>
                <Nav></Nav>
                <TimeTracker></TimeTracker>
                <AlertModal></AlertModal>
              </>
            ) : (<></>)}
            <div className="container">
              <Route exact path="/login" component={Login}/>
              <Route exact path="/signup" component={Signup}/>
              <Route exact path="/">
                {!Auth.loggedIn() ? <Redirect to="/login" /> : <Timesheet />}
              </Route>
              <Route exact path="/reports">
                {!Auth.loggedIn() ? <Redirect to="/login" /> : <Reports />}
              </Route>        
              <Route exact path="/projects">
                {!Auth.loggedIn() ? <Redirect to="/login" /> : <Projects />}
              </Route>
            </div>
          </StoreProvider>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
