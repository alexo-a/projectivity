import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

import Nav from './components/Nav'
import Timesheet from './pages/Timesheet'
import Reports from './pages/Reports'
import Projects from './pages/Projects'
import Login from './pages/Login'
import Signup from './pages/Signup'

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


function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <Nav></Nav>
          <div className="container">
            <Route exact path="/login" component={Login}/>
            <Route exact path="/signup" component={Signup}/>
            <Route exact path="/" component={Timesheet}/>
            <Route exact path="/reports" component={Reports}/>         
            <Route exact path="/projects" component={Projects}/>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
