import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import logo from "../assets/images/Projectivity.png";
import { useMutation } from '@apollo/react-hooks';
import { LOGIN } from "../utils/mutations"
import Auth from "../utils/auth";

const Login = (props) => {
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [errorState, setErrorState] = useState({ email: false, password: false });
    const [login] = useMutation(LOGIN);

    const handleFormSubmit = async event => {
        event.preventDefault();
        try {
          const mutationResponse = await login({ variables: { email: formState.email, password: formState.password } })
          const token = mutationResponse.data.login.token;
          Auth.login(token);
        } catch (e) {
            if (e.message === 'GraphQL error: Incorrect Password') {
                setErrorState({
                    email: false,
                    password: true
                });
            }
            if (e.message === 'GraphQL error: No User') {
                setErrorState({
                    email: true,
                    password: false
                });
            }
        }
    };

    
    const handleChange = event => {
        const { name, value } = event.target;
        setFormState({
          ...formState,
          [name]: value
        });
    };

    if (Auth.loggedIn()) {
        return <Redirect to="/" />
    }

    return (
        <div className="logInContainer">
            <div className="logInBody">
                <div className="flex align-center"><img src={logo} alt="Projectivity Logo" className="logo-img"/><h1 className="logo-title">Projectivity</h1></div>
                <div className="card">
                    <div className="cardTitle">
                        <h3>Log In to Projectivity</h3>
                        { errorState.email ? (
                            <p className="logInErrorMessage">No user found with that email address.</p>
                        ) : (
                            <></>
                        ) }
                        { errorState.password ? (
                            <p className="logInErrorMessage">Incorrect Password</p>
                        ) : (
                            <></>
                        ) }
                    </div>    
                    <div className="cardBody">
                        <form className="form" onSubmit={handleFormSubmit}>
                            <div className="formItem">
                                <label htmlFor="email">Email:</label>
                                <input className={`${ errorState.email ? 'warning' : ''}`}
                                    name='email'
                                    type='email'
                                    id='email'
                                    value={formState.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="formItem">
                                <label htmlFor="password">Password:</label>
                                <input className={`${ errorState.password ? 'warning' : ''}`}
                                    name='password'
                                    type='password'
                                    id='password'
                                    value={formState.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="buttonGroup">
                                <Link to="/signup" className="switchFormLink">
                                Not a member? &nbsp;Sign Up  
                                </Link>
                                <button className='success' type='submit'>
                                    Log In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>  
        </div>
    );
}

export default Login;