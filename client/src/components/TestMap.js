import {React, useState} from 'react';
import { GoogleMap, useLoadScript, Marker, DrawingManager } from '@react-google-maps/api';

const libraries = ['places', 'drawing'];
const mapContainerStyle = {
  width: '100%',
  height: '400px',
  maxWidth: '800px'
};

const center = {
  lat: 29.6516, 
  lng: -82.3248 
};

const TestMap = ({setPolygonCoordinates}) => {
  const { isLoaded, loadError } = useLoadScript({
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

  const dmOptions = {
    drawingControl: true,
    drawingControlOptions: {
      position: window.google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
    },
    polygonOptions: {
      fillColor: '#3f7c7c',
      fillOpacity: 0.5,
      strokeWeight: 5,
      clickable: true,
      editable: true,
      zIndex: 1
    },
    keyboardShortcuts: false
  }

  const onLoad = (map) => {
    setMap(map);
    const drawingManager = new window.google.maps.drawing.DrawingManager(dmOptions);
    drawingManager.setMap(map);
  };

  const onPolygonComplete = (polygon) => {
    // Do something with the completed polygon, e.g., save its coordinates
    const polygonCoordinates = polygon.getPath().getArray().map(latLng => ({
        lat: latLng.lat(),
        lng: latLng.lng()
    }));
    console.log("POLYGON COORDINATES:", polygonCoordinates);
    setPolygonCoordinates(polygonCoordinates);
};
  

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={15}
      center={center}
      onLoad={onLoad}
      keyboardShortcuts={false}
    >
      <Marker position={center} />
      <DrawingManager 
        options={dmOptions} 
        onPolygonComplete={onPolygonComplete}/>
    </GoogleMap>
  );
};

export default TestMap;
