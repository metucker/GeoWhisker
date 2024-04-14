import React from 'react';
import './Users.css';

const DisplayUser = ({ user }) => {
  return (
    <div className="userProfile">
        { user ? (
         <>
            <h1>{user.uname ? (user.uname) : (`User${user.ID}`)}</h1>
            <div className="status-bar">
                {user.feeder === 1 && <div className="status feeder">Feeder</div>}
                {user.trapper === 1 && <div className="status trapper">Trapper</div>}
                {user.catAdmin === 1 && <div className="status catAdmin">Cat Admin</div>}
            </div>
            {user.displayPersonalInfo ? <p>Email: {user.email}</p> : <p>No Email available.</p>}
        </>
        )
        :
        (<p>No User Information Available</p>)}
    </div>
  );
};

export default DisplayUser;
