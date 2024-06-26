import {React, useState} from 'react';
import { GoogleMap, useJsApiLoader, Marker, DrawingManager } from '@react-google-maps/api';

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
    //setMap(map);
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
    <>
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={15}
      center={center}
      onLoad={onLoad}
      keyboardShortcuts={false}
      drawingManager={{dmOptions}}
      onPolygonComplete={onPolygonComplete}>
    {/* {polygonComplete && map && <Polygon path={polygonCoordinates} map={map} />} */}
      <Marker position={center} />
      {/* <DrawingManager 
        options={dmOptions} 
        // onLoad={onLoad}
        onPolygonComplete={onPolygonComplete}/> */}
    </GoogleMap>
    </>
  );
};

export default TestMap;

// import React from 'react';
// import { GoogleMap, useJsApiLoader, DrawingManager } from '@react-google-maps/api';

// const libraries = ['places', 'drawing'];
// const mapContainerStyle = {
//   width: '100%',
//   height: '400px',
//   maxWidth: '800px'
// };

// const center = {
//   lat: 29.6516,
//   lng: -82.3248
// };

// const TestMap = ({ setPolygonCoordinates }) => {
//   const { isLoaded, loadError } = useJsApiLoader({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   const onPolygonComplete = (polygon) => {
//     const polygonCoordinates = polygon.getPath().getArray().map(latLng => ({
//       lat: latLng.lat(),
//       lng: latLng.lng()
//     }));
//     console.log("POLYGON COORDINATES:", polygonCoordinates);
//     setPolygonCoordinates(polygonCoordinates);
//   };

//   return (
//     <>
//       {loadError && <div>Error loading maps</div>}
//       {!isLoaded && <div>Loading maps</div>}
//       {isLoaded && (
//         <GoogleMap
//           mapContainerStyle={mapContainerStyle}
//           zoom={15}
//           center={center}
//         >
//           <DrawingManager
//             drawingControlOptions={{
//               position: window.google.maps.ControlPosition.TOP_CENTER,
//               drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
//             }}
//             options={{
//               drawingControl: true,
//               drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
//               polygonOptions: {
//                 fillColor: '#3f7c7c',
//                 fillOpacity: 0.5,
//                 strokeWeight: 5,
//                 clickable: true,
//                 editable: true,
//                 zIndex: 1
//               }
//             }}
//             onPolygonComplete={onPolygonComplete}
//           />
//         </GoogleMap>
//       )}
//     </>
//   );
// };

// export default TestMap;
