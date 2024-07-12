import React from "react";

const SimpleMapPage = ({ coor }) => {
  if (!coor) {
    return null;
  }

  const { lat, lng } = coor;
  const apiKey = "pk.504d44009c3f2a304b814266e5430e4c"; // Add your LocationIQ API key here
  const imageUrl = `https://maps.locationiq.com/v3/staticmap?key=${apiKey}&center=${lat},${lng}&zoom=14&size=300x300&format=png&markers=icon:small-red%7C${lat},${lng}`;

  // Marker icon URL
  const markerUrl = `https://maps.locationiq.com/v3/staticmap?key=${apiKey}&icon:marker-red|${lng},${lat}`;

  return (
    <img
      src={`${imageUrl}&markers=${markerUrl}`}
      alt="Static Map"
      style={{ width: "100%", height: '40%', objectFit: 'cover' }}
    />
  );
};

export default SimpleMapPage;