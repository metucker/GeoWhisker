import React, { useState } from 'react';
//import './Authentication.css';

const LogIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogIn = (event) => {
    event.preventDefault();
    // Handle login logic (e.g., send data to a server)
    console.log('LogIn - Username:', username);
    console.log('LogIn - Password:', password);
    // Reset form fields
    setUsername('');
    setPassword('');
  };

  return (
    <div className="container">
      <h2>Log In</h2>
      <form onSubmit={handleLogIn}>
        <div className='username'>
            <label>
            Username:
            </label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
        </div>
        <div className='password'>
            <label>
            Password:
            </label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <button type="submit">Log In</button>
        <div className="newUser">
        New user? <a href="/signup">Sign up</a> here.
        </div>
      </form>
    </div>
  );
};

export default LogIn;
