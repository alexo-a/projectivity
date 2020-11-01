import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from '@apollo/react-hooks';
import Auth from "../utils/auth";
import { ADD_USER } from "../utils/mutations";
import logo from "../assets/images/Projectivity.png";

function Signup(props)  {
    const [formState, setFormState] = useState({ 
        email: '', username: '', password: '', passwordCheck: '', 
        passwordsMatch: 'true' 
    });
    const [addUser, { error }] = useMutation(ADD_USER);

    const handleFormSubmit = async event => {
        event.preventDefault();
        console.log('submit');
        try {
            const { data } = await addUser({
              variables: { ...formState }
            });
            console.log(data); 
            Auth.login(data.addUser.token);
        } catch (e) {
            console.error(e);
        }
    };

    const handleChange = event => {
        const { name, value } = event.target;
        setFormState({
          ...formState,
          [name]: value
        });
    };

    const passCheckStatus =
        formState.passwordCheck === '' ? ''
        : formState.passwordCheck === formState.password ? 'passCheckTrue'
        : 'passCheckFalse'

    return (
        <div className="logInContainer">
            <div className="logInBody">
                <div className="flex align-center"><img src={logo} alt="Projectivity Logo" className="logo-img"/><h1 className="logo-title">Projectivity</h1></div>
                <div className="card">
                    <div className="cardTitle">
                        <h3>Sign Up Today!</h3>
                    </div>
                    <div className="cardBody">
                        <form className="form" onSubmit={handleFormSubmit}>
                            <div className="formItem">
                                <label htmlFor="email">Email:</label>
                                <input
                                    name='email'
                                    type='email'
                                    id='email'
                                    value={formState.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="formItem">
                                <label htmlFor="username">Username:</label>
                                <input
                                    name='username'
                                    type='username'
                                    id='username'
                                    value={formState.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="formItem">
                                <label htmlFor="password">Password:</label>
                                <input className={passCheckStatus}
                                    name='passwordCheck'
                                    type='password'
                                    id='passwordCheck'
                                    value={formState.passwordCheck}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="formItem">
                                <label htmlFor="password">Re-type password:</label>
                                <input className={passCheckStatus}
                                    name='password'
                                    type='password'
                                    id='password'
                                    value={formState.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="buttonGroup">
                                <Link to="/login" className="switchFormLink">
                                Already have an account? &nbsp;Log in 
                                </Link>
                                <button className='success' type='submit'>
                                    Sign Up
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>  
        </div>
    );
}

export default Signup;