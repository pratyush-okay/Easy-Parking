import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const SimpleMapPage = ({ coor }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const zoom = 14; 
  const [locationMarker, setLocationMarker] = useState(null);

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
  
      var popup = new maplibregl.Popup().setHTML("<b>Displayed Location</b>");
        const newMarker = new maplibregl.Marker({
        color: "red",
      })
        .setLngLat([coor.lng, coor.lat])
        .setPopup(popup)
        .addTo(map);
  
      setLocationMarker(newMarker);
    }
  }, [coor, map, locationMarker]); 

  return (
    <>
      <div ref={mapContainer} style={{ height: "95%", width: "100%" }} />
    </>
  );
};

export default SimpleMapPage;
