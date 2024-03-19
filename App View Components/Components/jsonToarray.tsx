// jsonToarray.js

const jsonToarray = (geoJsonData) => {
    // Ensure that geoJsonData is not empty or undefined
    if (!geoJsonData || !geoJsonData.features || geoJsonData.features.length === 0) {
      return [];
    }
  
    // Process GeoJSON features and create an array of markers
    const markersArray = geoJsonData.features.map((feature) => {
      const { coordinates } = feature.geometry;
  
      return {
        position: {
          lat: coordinates[1],
          lng: coordinates[0],
        },
        icon: '📍',
        size: [32, 32],
      };
    });
  
    return markersArray;
  };
  
  export default jsonToarray;
  