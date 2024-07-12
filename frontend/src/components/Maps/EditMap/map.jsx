import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
const SimpleMapPage = ({ coor, currentLocation,setCurrentCoord }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const zoom = 14; // Adjust zoom level based on your preference
  const [locationMarker, setLocationMarker] = useState(null);

  const [updatedCoor, setUpdatedCoor] = useState({lat: null, lng: null});
  console.log(updatedCoor);
  useEffect(() => {
      if (coor) {
        const mapInstance = new maplibregl.Map({
          container: mapContainer.current,
          style:
            "https://tiles.locationiq.com/v3/streets/vector.json?key=pk.504d44009c3f2a304b814266e5430e4c",
          center: [coor.lng, coor.lat],
          zoom: zoom,
        });
        setMap(mapInstance);
    
        return () => mapInstance.remove();
      }
    }, [coor]); 

  useEffect(() => {
    if (map && coor) {
      map.flyTo({
        center: [coor.lng, coor.lat],
        zoom: zoom,
        screenSpeed: 7,
        speed: 4
      });
  
      if (locationMarker) {
        locationMarker.remove();
      }
  
      var popup = new maplibregl.Popup().setHTML("<b>Your Location</b>");
        const newMarker = new maplibregl.Marker({
        color: "red",
        draggable: true, 
      })
        .setLngLat([coor.lng, coor.lat])
        .setPopup(popup)
        .addTo(map);
  
      newMarker.on('dragend', () => {
        const lngLat = newMarker.getLngLat();
        setUpdatedCoor({lat: lngLat.lat, lng: lngLat.lng});
        setCurrentCoord({lat: lngLat.lat, lng: lngLat.lng});
        console.log(`New Coordinates: ${lngLat.lat}, ${lngLat.lng}`);
      });
  
      setLocationMarker(newMarker);
    }
  }, [coor, map, setCurrentCoord, locationMarker]); 



  return (
    <>
      <div ref={mapContainer} style={{ height: "100%", width: "100%" }} />
    </>
  );
};

export default SimpleMapPage;
