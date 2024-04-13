import React, { useRef, useState, useEffect } from 'react';
import { Autocomplete, DrawingManager, GoogleMap, Polygon, useJsApiLoader, OverlayView} from '@react-google-maps/api';
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
    const [catsWithLocs, setCatsWithLocs] = useState([]);
    const [center, setCenter] = useState(null);

    useEffect(() => {
      if (cats) {

        const catLocs = cats.filter((cat) => !!cat.geographical_area && cat.geographical_area !== '[]');
        setCatsWithLocs(catLocs);
        console.log("REDUCED LIST ",  cats);
        
        // Calculate the center of each cat's geographical area
        const catCenters = catLocs.map((cat) => {
          console.log("CAT: ", cat.geographical_area);
          const coordinates = JSON.parse(cat.geographical_area);
          console.log("COORDINATES: ", coordinates);
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

        const latLngBounds = new window.google.maps.LatLngBounds();
        catLocs.map((cat) => {
          const coordinates = JSON.parse(cat.geographical_area);
          coordinates.forEach((coord) => {
            latLngBounds.extend(coord);
          });
        });
        setCenter(latLngBounds.getCenter());
      }
    }, [cats]);
  
    const containerStyle = {
      width: '100%',
      height: '400px',
    };
  
    const mapOptions = {
      disableDefaultUI: true,
    };

    const [map, setMap] = useState(null);

    const onMapLoad = map => {
        setMap(map);
    };

    const calculateCenter = coordinates => {
        const latSum = coordinates.reduce((sum, coord) => sum + coord.lat, 0);
        const lngSum = coordinates.reduce((sum, coord) => sum + coord.lng, 0);
        return { lat: latSum / coordinates.length, lng: lngSum / coordinates.length };
    };
  
    return (
      isLoaded && (
        <div className="map-container">
          <GoogleMap
            zoom={9}
            center={center}
            options={mapOptions}
            mapContainerStyle={containerStyle}
          >
            {catsWithLocs.map((cat) => {
              try {
                if (!cat.geographical_area) {
                    return null; // Skip cats without geographical data
                }
            } catch (error) {
                console.error('Error parsing geographical data:', error);
            }
        
            const coordinates = JSON.parse(cat.geographical_area);
        
            // Calculate the center of the cat's geographical area
            const latAvg = coordinates.reduce((sum, coord) => sum + coord.lat, 0) / coordinates.length;
            const lngAvg = coordinates.reduce((sum, coord) => sum + coord.lng, 0) / coordinates.length;
            
            const catURL = `/cats/${cat.catID}`;
            console.log("COORDINATES ABOUT TO BE REDUCED FOR ICON: ", "lat: ", latAvg, "lng: " , lngAvg);

        
            return (
                <div key={cat.catID}>
                    <a href={catURL}>
                        {/* <FontAwesomeIcon
                            icon={faCat}
                            style={{
                                position: {lat: latAvg, lng: lngAvg},
                                // lat: `${latAvg}%`, // Use latAvg directly for the top position
                                // lng: `${lngAvg}%`, // Use lngAvg directly for the left position
                                //transform: 'translate(-50%, -50%)',
                                color: '#1e8c94',
                                border: "1px solid black",
                                background: "white",
                                cursor: 'pointer',
                            }}
                        /> */}
                         <OverlayView
                    key={cat.catID}
                    position={{ lat: latAvg, lng: lngAvg/* longitude of cat's center */ }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                    <div
                        style={{
                            position: 'absolute',
                            transform: 'translate(-50%, -50%)',
                            cursor: 'pointer'
                        }}
                    >
                        <FontAwesomeIcon icon={faCat} src={catURL} style={{ 
                          color: '#1e8c94',fontSize: '48px',  onMouseOver: 'cursor: pointer',}}
                           />
                    </div>
                </OverlayView>
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