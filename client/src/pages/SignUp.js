import React, { useState } from 'react';
import './components/Authentication.css';

const SignUp = () => {
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSignUp = async (event) => {
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
        console.log('User signed up successfully!');
      } else {
        // Handle errors, e.g., display an error message
        console.error('Failed to sign up. Please try again.',email, pw);
      }
    } catch (error) {
      console.error('Error during signup:', error.message);
    }
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <label>
          New Email:
          <input
            name="email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </label>
        <label>
          New Password:
          <input
            name="password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
