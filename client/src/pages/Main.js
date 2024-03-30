import React from 'react';
import '../App.css';
import '../components/Authentication/Authentication.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCat, faUser, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import LoadingSpinner from '../components/Loading/LoadingSpinner'; // Import a loading spinner component



const Main = () => {
    const navigate = useNavigate();


  return (
    <>
    <div className='homePage'>
        <p>Welcome!</p>
        {/* Buttons for logged-in users */}
        <div className='options'>
            <button onClick={() => navigate('/browse')}>Browse Cats <FontAwesomeIcon icon={faMagnifyingGlass}/></button>
            <button onClick={() => navigate('/addcat')}>Add Cat <FontAwesomeIcon icon={faCat}/></button>
            <button onClick={() => navigate('/user')}>Edit Profile <FontAwesomeIcon icon={faUser}/></button>
        </div>

        {/* Section for Your Cats and Your Cat Map */}
        <div className='columns'>
            {/* Left column - Your Cats */}
            <div className='yourCats'>
                <h2>Your Cats</h2>
                {/* Add content for Your Cats */}
            </div>
                {/* Right column - Your Cat Map */}
            <div className='catMap'>
                <h2>Your Cat Map</h2>
                {/* Add content for Your Cat Map */}
            </div>
        </div>
    </div>
</>
  );
};

export default Main;