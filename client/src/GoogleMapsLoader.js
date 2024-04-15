import { Wrapper, Status } from "@googlemaps/react-wrapper";
import LoadingSpinner from "./components/Loading/LoadingSpinner";
import CatMap from "./components/CatMap";
import MapComponent from "./components/MapComponent";
import { useLocation } from "react-router-dom";

const GoogleMapsLoader = ({cats, setPolygonCoordinates}) => {
  const location = useLocation();

  const renderMapComponent = () => {
    // Determine which map component to render based on the current location
    if (location.pathname === "/addcat") {
      return <MapComponent setPolygonCoordinates={setPolygonCoordinates}/>;
    } else if (location.pathname === "/home") {
      return <CatMap cats={cats}/>;
    } else {
      return null; // Render nothing if the location doesn't match any map component
    }
  };

  const render = (status) => {
    switch (status) {
      case Status.LOADING:
        return <LoadingSpinner />;
      case Status.FAILURE:
        return <div>Failed to load Google Maps</div>;
      case Status.SUCCESS:
        console.log('rendering component at location.pathname:', location.pathname);
        return renderMapComponent();
      default:
        return null;
    }
  };

  return <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={['places', 'drawing']} render={render} />;
};

export default GoogleMapsLoader;