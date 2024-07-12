const TransCoorAddr = async (value, type) => {
    if (type === "address_to_coor") {
        /* address ---> latitude & longitude */
        const address = value;
        const url_addr = encodeURIComponent(address);
        
        const data_url = `https://us1.locationiq.com/v1/search?key=pk.504d44009c3f2a304b814266e5430e4c&q=${url_addr}&format=json&`;
        // const data_url = `https://nominatim.openstreetmap.org/search?q=${url_addr}&format=geojson`;
        const response = await fetch(data_url, {
        method: "GET",
        });
        const data = await response.json();
        if (data.length > 0) {
            const lat = data[0].lat;
            const lng = data[0].lon;
            return { lat: lat, lng: lng };
        } else {
            console.log(`address '${value}' not found.`);
            return { lat: null, lng: null };
        }
    } else if (type === "coor_to_address") {
        /* latitude & longitude ---> address */
        const coor = value;
        const lat = coor.lat;
        const lng = coor.lng;
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${lat}&lon=${lng}`,
            {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                },
            }
        );
        const data = await response.json();
        if (data.features.length > 0) {
            const address = data.features[0].properties.display_name;
            return address;
        } else {
            console.log(`coordinates '${value}' not found.`);
            return null;
        }
    } else {
        return 'error';
    }
}

export default TransCoorAddr;
