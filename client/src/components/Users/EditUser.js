import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit}>
      <label>
        Display Name:
        <input type="text" name="uname" value={formData.uname} onChange={handleChange} />
      </label>
      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </label>
      <label>
        Feeder:
        <input type="checkbox" name="feeder" checked={formData.feeder} onChange={handleChange} />
      </label>
      <label>
        Trapper:
        <input type="checkbox" name="trapper" checked={formData.trapper} onChange={handleChange} />
      </label>
      <label>
        Cat Admin:
        <input type="checkbox" name="catAdmin" checked={formData.catAdmin} onChange={handleChange} />
      </label>
      <label>
        Blurb:
        <textarea name="blurb" value={formData.blurb} onChange={handleChange} />
      </label>
      <label>
        Display Personal Info:
        <input type="checkbox" name="displayPersonalInfo" checked={formData.displayPersonalInfo} onChange={handleChange} />
      </label>
      <button type="submit">Update</button>
    </form>
  );
};

export default EditUser;