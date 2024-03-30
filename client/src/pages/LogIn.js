import '../App.css';
//import '../components/Authentication/Authentication.css';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import SignUp from './SignUp';

const LogIn = ({ handleLoginSuccess }) => {
  const [email, checkEmail] = useState('');
  const [password, checkPassword] = useState('');

  const handleLogIn = async (event) => {
    console.log('Type of handleLoginSuccess:',typeof handleLoginSuccess);
    event.preventDefault();
    // Handle login logic (e.g., send data to a server)

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          pw: password,
        }),
        credentials: 'include', // Include cookies in the request and response
      });

      if (response.ok) {
        // Handle success, e.g., redirect to another page
        if (typeof handleLoginSuccess === 'function') {
          await handleLoginSuccess();
          console.log('User logged in successfully!', response);
        } else {
          console.log('Type of handleLoginSuccess:', typeof handleLoginSuccess);
          console.error('handleLoginSuccess is not a function!');
        }
      } else {
        // Handle errors, e.g., display an error message
        console.error('Failed to login. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  return (
    <div className='Home'>
    <div className="container">
      <h2>Log In</h2>
      <form onSubmit={handleLogIn}>
        <div className='email'>
            <label>
            Email:
            </label>
            <input
                type="text"
                value={email}
                onChange={(e) => checkEmail(e.target.value)}
            />
        </div>
        <div className='password'>
            <label>
            Password:
            </label>
            <input
                type="password"
                value={password}
                onChange={(e) => checkPassword(e.target.value)}
            />
        </div>
        <button type="submit">Log In</button>
        {/* <div className="newUser">
        New user? <a href="/home">Sign up</a> here.
        </div> */}
      </form>
    </div>
    </div>
  );
};

export default LogIn;
