import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './AddCat.css';
import AddCatMap from '../components/AddCatMap';
import TestMap from '../components/TestMap';
import {setPolygonCoordinates} from '../components/TestMap';

const AddCat = () => {
  // State variables for form fields
  const [cname, setCname] = useState('');
  const [age, setAge] = useState('');
  const [cat_aliases, setCatAliases] = useState('');
  const [geographical_area, setPolygonCoordinates] = useState([]);
  // const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [microchipped, setMicrochipped] = useState('Unsure');
  const [chipID, setChipID] = useState('');
  const [hlength, setHairLength] = useState('');
  const [photo, setPhoto] = useState(null);
  const [gender, setGender] = useState('');
  const [feral, setFeral] = useState('');
  // Define other state variables for the remaining fields

  // Event handlers to update state variables
  const handleCnameChange = (e) => {
    setCname(e.target.value);
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };

  const handleAliasChange = (e) => {
    setCatAliases(e.target.value);
  };

  const handleGeoChange = (coordinates) => {
    console.log("Geographical Area Coordinates:", coordinates);
    // setPolygonCoordinates(coordinates);
    setPolygonCoordinates(coordinates);
};

  const handleMicrochippedChange = (e) => {
    setMicrochipped(e.target.value);
  };

  const handleChipIDChange = (e) => {
    setChipID(e.target.value);
  };

  const handleHairLengthChange = (e) => {
    setHairLength(e.target.value);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleFeralChange = (e) => {
    setFeral(e.target.value);
  };
  // Implement event handlers for other fields

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    //Basic Information
    const formData = new FormData();
    formData.append('cname', cname);
    formData.append('age', age);
    formData.append('cat_aliases', cat_aliases);
    formData.append('geographical_area', JSON.stringify(geographical_area));
    // formData.append('geographical_area', geographical_area);
    formData.append('microchipped', microchipped);
    formData.append('chipID', chipID);
    formData.append('hlength', hlength);
    formData.append('photo', photo);
    formData.append('gender', gender);
    formData.append('feral', feral);

    //Health Information (TODO)

    const jsonFormData = {};
    for (const [key, value] of formData.entries()) {
        jsonFormData[key] = value;
    }

    try {
      const response = await fetch('http://localhost:4000/addcat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonFormData),
      });
    console.log("Form Data: ", jsonFormData);


    
        if (response.ok) {
          console.log('Cat added successfully');
          const responseData = await response.json(); // Parse response body
          const catID = responseData.catID; // Extract catID from response
          console.log('Response Data:', responseData);
          console.log('Cat ID:', catID, "Poly:", geographical_area);
          //Photos associated with new cat

          const photoData = new FormData();
          photoData.append('catID', catID);
          photoData.append('photo', photo);
          const response2 = await fetch('http://localhost:4000/addcat/photo', {
            method: 'POST',
            body: photoData,
          });
          console.log("Photo Data: ", photoData);
        } else {
          console.error('Failed to add cat');
        //   // Handle error cases

        }
      } catch (error) {
        console.error('Error adding cat:', error.message);
        // Handle network errors or other exceptions
      }
    // Call a function to submit the form data to the backend
    for (const entry of formData.entries()) {
      console.log(entry[0], ':', entry[1]);
    }  };

  return (
    <>
    <div class="addCat">
      <h1>Add a Cat</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Cat Name: 
          <input type="text" value={cname} required="true" onChange={handleCnameChange} />
        </label>
        <br />
        <label>
          Age: <br/>
          <select value={age} onChange={handleAgeChange} defaultValue="blank">
            <option value="">Select Option</option>
            <option value="Kitten">Kitten (less than 1 year)</option>
            <option value="Adult">Adult (Between 1 and 10 years)</option>
            <option value="Senior">Senior (10+ years)</option>
          </select>
        </label>
        <br />
        <label>
          Aliases: 
          <input type="text" value={cat_aliases} onChange={handleAliasChange}/>
        </label>
        <br />
        <label>
          Geographical Area: 
          {/* <input type="text" value={handleGeoChange} onChange={handleGeoChange} /> */}
          {/* <AddCatMap setPolygonCoordinates={handleGeoChange} /> */}
          <TestMap setPolygonCoordinates={handleGeoChange} />

        </label>
        {/* <TestMap setPolygonCoordinates={handleGeoChange} /> */}
        <br />
        <label>
          Microchipped: <br/>
          <select value={microchipped} onChange={handleMicrochippedChange}>
            <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Unsure">Unsure</option>
          </select>
        </label>
        <br />
        <label>
          Microchip ID: 
          <input type="text" value={chipID} onChange={handleChipIDChange} />
        </label>
        <br />
        <label>
          Hair Length: <br/>
          <select value={hlength} onChange={handleHairLengthChange}>
            <option value="">Select Option</option>
            <option value="DLH">Long-haired (DLH)</option>
            <option value="DSH">Short-haired (DSH)</option>
          </select>
        </label>
        <br />
        <label>
          Photo: 
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </label>
        <br/>
        <label>
          Gender: <br/>
          <select value={gender} onChange={handleGenderChange}>
            <option value="">Select Option</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Unsure">Unsure</option>
          </select>
        </label>
        <br />
        <label>
          Is this cat feral? <br/>
          <select value={feral} onChange={handleFeralChange}>
            <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Unsure">Unsure</option>
          </select>
        </label>
        <br />
        <button type="submit">Add Cat</button>
      </form>
    </div>
    </>
  );
};

export default AddCat;
