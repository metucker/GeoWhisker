import {React, useState} from 'react';
import { GoogleMap, useLoadScript, Marker, useJsApiLoader} from '@react-google-maps/api';
import { AdvancedMarker} from "@vis.gl/react-google-maps";
import { faCat } from '@fortawesome/free-solid-svg-icons'

const libraries = ['marker', 'maps'];
const mapContainerStyle = {
  width: '100%',
  height: '400px',
  maxWidth: '800px'
};

const center = {
  lat: 29.6516, 
  lng: -82.3248 
};

const CatMap = ({catCoordinates}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [map, setMap] = useState(null);
  console.log("MAAP API was loaded");
  // const [polygonCoordinates, setPolygonCoordinates] = useState([]); 


  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  } 

  const onLoad = (map) => {
    setMap(map);
  };

  console.log("LOGO.svg",require('../logo.svg')); // Check if the SVG file is correctly imported
  console.log("LOGO.svg",btoa(require('../logo.svg'))); // Check the Base64 string
console.log("CAT COORDINATES", catCoordinates);

  return (
    <>
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={15}
      center={center}
      onLoad={onLoad}
      mapID={process.env.REACT_APP_GOOGLE_MAPS_ID}
      //needs mapID for AdvancedMArker to work
    
    >
        {catCoordinates.map((coordinate, index) => (
            <AdvancedMarker
            key={index}
            lat={coordinate.lat}
            lng={coordinate.lng}
            // options={{ 
            //     marker: {
            //         icon: {
            //           url: 'data:image/svg+xml;base64,' + btoa(require('../logo.svg')),
            //           scaledSize: { width: 32, height: 32 } // Adjust the size as needed
            //         }
            //       }
            //  }} // Replace 'cat-icon.png' with your actual cat icon image URL
            />
            
        ))}
    
    {catCoordinates.map((coordinate, index) => (
    <Marker
      key={index}
      position={{ lat: coordinate.lat, lng: coordinate.lng }}
    />
  ))}
    </GoogleMap>
    </>
  );
};

export default CatMap;
