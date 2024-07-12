import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import ApiCallGet from "../action/ApiCallGet";
import TransCoorAddr from "./TransCoorAddr.jsx";
import axios from "axios";
import "./Map.css";

const SimpleMapPage = ({
    selectedParkingMap,
    currentLocation,
    recenter,
    setLSelectedListingId,
    selectedSearch,
    selectedFavorite,
}) => {
    const mapContainer = useRef(null);
    const [map, setMap] = useState(null);
    const [allListingTidied, setAllListingTidied] = useState([]);
    const zoom = 14; // Adjust zoom level based on your preference
    const [locationMarker, setLocationMarker] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [allListing, setAllListing] = React.useState([]);
    const [markers, setMarkers] = useState({});
    console.log(markers);
    const [favoriteLocations, setFavoriteLocations] = useState([]);

    // Fetch favorite locations
    const fetchFavoriteLocations = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/user/fav/all"
            );
            const data = JSON.parse(response.data);
            console.log("Favorite locations:", data);
            setFavoriteLocations(data);
        } catch (error) {
            console.error("Failed to fetch favorite locations:", error);
        }
    };

    React.useEffect(() => {
        console.log("Fetching favorite locations...");
        fetchFavoriteLocations();
        get_all_listing();
    }, []);

    /* get all listing info from backend (GET) */
    const get_all_listing = async () => {
        const data = await ApiCallGet("parking/all/", {}, "", false);
        if (data) {
            const json_data = JSON.parse(data);
            setAllListing([...json_data]);
        }
    };

    /* map over all listing info and asynchronously fetch coordinates for each item */
    React.useEffect(() => {
        const fetchCoordinates = async () => {
            const promises = allListing.map(async (item) => {
                const id = item["pk"];
                const add = item["fields"]["location"];
                const price = item["fields"]["price_hourly"];
                const coor = await TransCoorAddr(add, "address_to_coor");
                const data = {
                    id: id,
                    price: price,
                    coor: coor,
                    location: item["fields"]["location"],
                    price_daily: item["fields"]["price_daily"],
                    price_hourly: item["fields"]["price_hourly"],
                    price_monthly: item["fields"]["price_monthly"],
                    latitude: item["fields"]["latitude"],
                    longitude: item["fields"]["longitude"],
                };
                return data;
            });
            const resolvedData = await Promise.all(promises); // Wait for all promises to resolve
            setAllListingTidied(resolvedData);
        };

        fetchCoordinates();
    }, [allListing]);

    useEffect(() => {
        const mapInstance = new maplibregl.Map({
            container: mapContainer.current,
            style: "https://tiles.locationiq.com/v3/streets/vector.json?key=pk.504d44009c3f2a304b814266e5430e4c",
            center: [currentLocation.lng, currentLocation.lat],
            zoom: zoom,
        });

        // Add geolocate control to the map.
        mapInstance.addControl(
            new maplibregl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                trackUserLocation: true,
            })
        );
        setMap(mapInstance);

        // Cleanup on component unmount
        return () => mapInstance.remove();
    }, [currentLocation.lat, currentLocation.lng]); // Removed currentLocation dependency to initialize map only once

    useEffect(() => {
        if (map && selectedSearch) {
            // Fly to the selected location
            map.flyTo({
                center: [selectedSearch.coord.lng, selectedSearch.coord.lat],
                zoom: zoom,
                screenSpeed: 7,
                speed: 4,
            });

            if (selectedLocation) {
                selectedLocation.remove();
            }

            var popup = new maplibregl.Popup().setHTML(
                "<b>Searched Location</b>"
            );

            // Create a new custom marker with a custom image
            // const el = document.createElement("div");
            // el.className = "marker";
            // el.style.backgroundImage =
            //     "url(https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png)";
            // el.style.width = "50px";
            // el.style.height = "50px";

            
            var airport = new maplibregl.Marker({
                color: "black",
            })
            .setLngLat([selectedSearch.coord.lng, selectedSearch.coord.lat])
            .setPopup(popup)
                .addTo(map);

            setSelectedLocation(airport);
        }
    }, [map, selectedSearch, selectedLocation]);

    useEffect(() => {
        if (map && currentLocation.lat && currentLocation.lng) {
            map.flyTo({
                center: [currentLocation.lng, currentLocation.lat],
                zoom: zoom,
                screenSpeed: 7,
                speed: 4,
            });

            // Remove previous marker if it exists
            if (locationMarker) {
                locationMarker.remove();
            }
            var popup = new maplibregl.Popup().setHTML("<b>Your Location</b>");

            // Create a new marker and add it to the map
            const newMarker = new maplibregl.Marker({
                color: "red",
            })
                .setLngLat([currentLocation.lng, currentLocation.lat])
                .setPopup(popup)
                .addTo(map);
            newMarker.setPopup(popup); // sets a popup on this marker

            setLocationMarker(newMarker);
        }
    }, [currentLocation, map]);

    // Display favorite locations on the map
    useEffect(() => {
        if (map) {
            favoriteLocations.forEach((favorite) => {
                const { latitude, longitude, name } = favorite.fields;

                // Check if latitude and longitude are available
                if (latitude && longitude) {
                    const popup = new maplibregl.Popup().setHTML(
                        `<b>${name}</b>`
                    );

                    new maplibregl.Marker({ color: "orange" })
                        .setLngLat([longitude, latitude])
                        .setPopup(popup) // sets a popup on this marker
                        .addTo(map);
                }
            });
        }
    }, [map, favoriteLocations]);

    useEffect(() => {
        if (map) {
            allListingTidied.forEach((listing, i) => {
                let lat = listing.latitude;
                let lng = listing.longitude;
                // if address not exist .... set a random coor
                // to-do: dealt with it by checking address upon creating
                if (!lat || !lng) {
                    lat = -33.922478808044254 + i;
                    lng = 151.2232630211781 - i;
                }

                var popup = new maplibregl.Popup().setHTML(
                    `<b>${listing.location}</b>
          <br />
          <b>Price:</b>
          ${listing.price_hourly}/h 
          ${listing.price_daily}/d
          ${listing.price_monthly}/m`
                );

                const newMarker = new maplibregl.Marker()
                    .setLngLat([lng, lat])
                    .setPopup(popup)
                    .addTo(map);
                newMarker.setPopup(popup);
                newMarker.getElement().addEventListener("click", () => {
                    setLSelectedListingId(listing.id);
                });

                setMarkers((prevMarkers) => ({
                    ...prevMarkers,
                    [listing.id]: newMarker,
                }));
            });
        }
    }, [map, allListingTidied, setLSelectedListingId]);

    useEffect(() => {
        allListingTidied.forEach((listing, i) => {
            let lat = null;
            let lng = null;
            if (listing.id === selectedParkingMap) {
                lat = listing.latitude;
                lng = listing.longitude;
            }
            if (selectedParkingMap && lat && lng && map) {
                map.flyTo({
                    center: [lng, lat],
                    essential: true, // this animation is considered essential with respect to prefers-reduced-motion
                    zoom: zoom,
                    screenSpeed: 7,
                    speed: 4,
                });
            }
        });
    }, [selectedParkingMap, map, allListingTidied]);

    useEffect(() => {
        if (
            selectedFavorite &&
            selectedFavorite.lat &&
            selectedFavorite.lng &&
            map
        ) {
            map.flyTo({
                center: [selectedFavorite.lng, selectedFavorite.lat],
                essential: true,
                zoom: zoom,
                screenSpeed: 7,
                speed: 4,
            });
        }
    }, [selectedFavorite, map]);

    // Your existing functions for fetching and processing listings remain unchanged

    return (
        <>
            {/* <div className="recenter-btn" onClick={recenter}>
        <MyLocationIcon />
      </div> */}
            <div ref={mapContainer} style={{ height: "100%", width: "100%" }} />
        </>
    );
};

export default SimpleMapPage;