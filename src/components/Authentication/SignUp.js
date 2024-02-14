import React, { useState } from 'react';
import './Authentication.css';

const SignUp = () => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSignUp = (event) => {
    event.preventDefault();
    // Handle sign-up logic (e.g., send data to a server)
    console.log('Sign Up - Username:', newUsername);
    console.log('Sign Up - Password:', newPassword);
    // Reset form fields
    setNewUsername('');
    setNewPassword('');
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <label>
          New Username:
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </label>
        <label>
          New Password:
          <input
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
