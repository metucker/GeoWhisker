import React from 'react';

const DisplayUser = ({ user }) => {
  return (
    <div>
        <h2>Profile Information</h2>
        <p>Name: {user.uname ? (user.uname) : (`User${user.ID}`)}</p>
        <p>Email: {user.email}</p>
        <div className="status-bar">
            {user.feeder === 1 && <div className="status feeder">Urgent</div>}
            {user.trapper === 1 && <div className="status trapper">Help Needed</div>}
            {user.catAdmin === 1 && <div className="status catAdmin">Update</div>}
        </div>
    </div>
  );
};

export default DisplayUser;
