import React, { useState } from 'react';
import '../App.css';
import Home from './Home';
//import '../components/Authentication/Authentication.css';
import { useNavigate } from 'react-router-dom';

const SignUp = ({ handleSignUpSuccess }) => {
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    console.log('Type of handleLoginSuccess:',typeof handleLoginSuccess);

    event.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newEmail,
          pw: newPassword,
        }),
      });

      if (response.ok) {
        // Handle success, e.g., redirect to another page
        handleSignUpSuccess();
        navigate('/home');
        console.log('User signed up successfully!');
      } else {
        // Handle errors, e.g., display an error message
        console.error('Failed to sign up. Please try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error.message);
    }

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newEmail,
          pw: newPassword,
        }),
      });

      if (response.ok) {
        // Handle success, e.g., redirect to another pag
        handleSignUpSuccess();
        console.log('User logged in successfully!');
      } else {
        // Handle errors, e.g., display an error message
        console.error('Failed to sign up. Please try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error.message);
    }
  
  };

  return (
    <div className='Home'>
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <label>
          Email:
          <input
            name="email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            name="password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <button type="submit">Sign Up</button>
        {/* <div className="returningUser">
        Returning user? <a href="/home">Log in</a> here.
        </div> */}
      </form>
    </div>
    </div>
  );
};

export default SignUp;
