import React, { useState } from 'react';
import User from '../../pages/User';
import './Users.css';

const EditUser = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    feeder: user.feeder,
    trapper: user.trapper,
    catAdmin: user.catAdmin,
    blurb: user.blurb,
    displayPersonalInfo: user.displayPersonalInfo
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('USER ID: ', user[0]);
        const response = await fetch(`/users/${user[0]}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            console.log('User data updated successfully');
        } else {
            throw new Error('Failed to update user data');
        }
    } catch (error) {
        console.error('Error updating user data:', error);
    }
};

  return (
    // <form onSubmit={handleSubmit}>
    //   <label>
    //     Display Name:
    //     <input type="text" name="uname" value={formData.uname} onChange={handleChange} />
    //   </label>
    //   <label>
    //     Email:
    //     <input type="email" name="email" value={formData.email} onChange={handleChange} />
    //   </label>
    //   <label>
    //     Feeder:
    //     <input type="checkbox" name="feeder" checked={formData.feeder} onChange={handleChange} />
    //   </label>
    //   <label>
    //     Trapper:
    //     <input type="checkbox" name="trapper" checked={formData.trapper} onChange={handleChange} />
    //   </label>
    //   <label>
    //     Cat Admin:
    //     <input type="checkbox" name="catAdmin" checked={formData.catAdmin} onChange={handleChange} />
    //   </label>
    //   <label>
    //     Blurb:
    //     <textarea name="blurb" value={formData.blurb} onChange={handleChange} />
    //   </label>
    //   <label>
    //     Display Personal Info:
    //     <input type="checkbox" name="displayPersonalInfo" checked={formData.displayPersonalInfo} onChange={handleChange} />
    //   </label>
    //   <button type="submit">Update</button>
    // </form>
    <div className="editUser">
      <h2>Please fill out any fields you wish to edit in the form below. If you do not wish to edit a field, </h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="uname" value={formData.uname} onChange={handleChange} placeholder="Display Name" required />
        <br />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <br />
        <p>Please choose any applicable labels that describe your relationship to community cats:</p>
        <br />
        <div className="status-bar-container">
          
          
          <label className={formData.feeder ? 'selected' : ''}>
            <input type="checkbox" name="feeder" checked={formData.feeder} onChange={handleChange} default={user.feeder} style={{ display: 'none' }}
 />
            <div className="status-bar status feeder">Feeder</div>
          </label>
          <label className={formData.trapper ? 'selected' : ''}>
            <input type="checkbox" name="trapper" checked={formData.trapper} onChange={handleChange} default={user.trapper} style={{ display: 'none' }}
/>
            <div className="status-bar status trapper">Trapper</div>
          </label>
          <label className={formData.catAdmin ? 'selected' : ''}>
            <input type="checkbox" name="catAdmin" checked={formData.catAdmin} onChange={handleChange} style={{ display: 'none' }}
 />
            <div className="status-bar status catAdmin">Cat Admin</div>
          </label>
        </div>
        <br />
        <textarea name="blurb" value={formData.blurb} onChange={handleChange} placeholder="Blurb" />
        <br />
        <div className="displayInfo">
          
          <input type="checkbox" name="displayPersonalInfo" checked={formData.displayPersonalInfo} onChange={handleChange} />
          <label className={formData.displayPersonalInfo ? 'selected' : ''}>
          <div> Would you like to display your personal information in your profile page so that other users can contact you?</div>
          <p>NOTE: Checking this box will reveal your personal details on your profile page that is publicly available. </p>

          </label>
        </div>
        <br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditUser;