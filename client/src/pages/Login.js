import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/images/Projectivity.png";
import { useMutation } from '@apollo/react-hooks';
import { LOGIN } from "../utils/mutations"
import Auth from "../utils/auth";

const Login = (props) => {
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [login, { error }] = useMutation(LOGIN);

    const handleFormSubmit = async event => {
        event.preventDefault();
        try {
          const mutationResponse = await login({ variables: { email: formState.email, password: formState.password } })
          const token = mutationResponse.data.login.token;
          Auth.login(token);
        } catch (e) {
          console.log(e)
        }
    };
    
      const handleChange = event => {
        const { name, value } = event.target;
        setFormState({
          ...formState,
          [name]: value
        });
    };

    return (
        <div className="logInContainer">
            <div className="logInBody">
                <div className="flex align-center"><img src={logo} alt="Projectivity Logo" className="logo-img"/><h1 className="logo-title">Projectivity</h1></div>
                <div className="card">
                    <div className="cardTitle">
                        <h3>Log In to Projectivity</h3>
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
                                <label htmlFor="password">Password:</label>
                                <input
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