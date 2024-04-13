import React, { useRef, useState, useEffect } from 'react';
import { Autocomplete, DrawingManager, GoogleMap, Polygon, useJsApiLoader} from '@react-google-maps/api';
import { AdvancedMarker} from "@vis.gl/react-google-maps";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCat } from '@fortawesome/free-solid-svg-icons'

const libraries = ['places', 'drawing'];
const CatMap = ({ cats }) => {

    // const mapRef = useRef();
    // const polygonRefs = useRef([]);
    // const activePolygonIndex = useRef();
    // const autocompleteRef = useRef();
    // const drawingManagerRef = useRef();
    //const [polygonCoordinates, setPolygonCoordinates] = useState([]);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries    
    });

    const [center, setCenter] = useState(null);

    useEffect(() => {
      if (cats) {

        const cats = cats.filter((cat) => cat.geographical_data)
        
        // Calculate the center of each cat's geographical area
        const catCenters = cats.map((cat) => {
          console.log("CAT: ", cat.geographical_data);
          const coordinates = JSON.parse(cat.geographical_data);
          const latSum = coordinates.reduce((sum, coord) => sum + coord.lat, 0);
          const lngSum = coordinates.reduce((sum, coord) => sum + coord.lng, 0);
          const latAvg = latSum / coordinates.length;
          const lngAvg = lngSum / coordinates.length;
          return { lat: latAvg, lng: lngAvg };
        });
  
        // Set the center of the map to the average center of all cats
        const latSum = catCenters.reduce((sum, center) => sum + center.lat, 0);
        const lngSum = catCenters.reduce((sum, center) => sum + center.lng, 0);
        const latAvg = latSum / catCenters.length;
        const lngAvg = lngSum / catCenters.length;
        setCenter({ lat: latAvg, lng: lngAvg });
      }
    }, [cats]);
  
    const containerStyle = {
      width: '100%',
      height: '400px',
    };
  
    const mapOptions = {
      disableDefaultUI: true,
    };
  
    return (
      isLoaded && (
        <div className="map-container">
          <GoogleMap
            zoom={15}
            center={center}
            options={mapOptions}
            mapContainerStyle={containerStyle}
          >
            {cats.map((cat) => {
              try {
                if (!cat.geographical_data) {
                  return null; // Skip cats without geographical data
                }
              } catch (error) {
                console.error('Error parsing geographical data:', error);
              }

              const coordinates = JSON.parse(cat.geographical_data);
              const catCenter = coordinates.reduce(
                (sum, coord) => {
                  return {
                    lat: sum.lat + coord.lat,
                    lng: sum.lng + coord.lng,
                  };
                },
                { lat: 0, lng: 0 }
              );
              const latAvg = catCenter.lat / coordinates.length;
              const lngAvg = catCenter.lng / coordinates.length;
              const catURL = `/cats/${cat.catID}`;
  
              return (
                <div key={cat.catID}>
                  <a href={catURL}>
                    <FontAwesomeIcon
                      icon={faCat}
                      style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'blue',
                        cursor: 'pointer',
                      }}
                    />
                  </a>
                </div>
              );
            })}
          </GoogleMap>
        </div>
      )
    );
}

export default CatMap; 