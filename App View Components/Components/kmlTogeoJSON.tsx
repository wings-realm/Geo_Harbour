import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import toGeoJSON from 'togeojson';

const KMLtoGeoJSONConverter = () => {
  useEffect(() => {
    // Function to convert KML to GeoJSON
    const convertKMLtoGeoJSON = async () => {
      try {
        // Replace 'your-kml-file-url.kml' with the actual URL of your KML file
        const kmlUrl = '../js/';
        const response = await fetch(kmlUrl);
        const kmlText = await response.text();

        // Convert KML to GeoJSON
        const kmlDoc = new DOMParser().parseFromString(kmlText, 'text/xml');
        const geoJson = toGeoJSON.kml(kmlDoc);

        // Log the converted GeoJSON
        console.log('Converted GeoJSON:', JSON.stringify(geoJson, null, 2));
      } catch (error) {
        console.error('Error converting KML to GeoJSON:', error);
      }
    };

    // Call the conversion function
    convertKMLtoGeoJSON();
  }, []);

  return (
    <View>
      <Text>KML to GeoJSON Converter</Text>
      <Button title="Convert" onPress={() => {}} />
    </View>
  );
};

export default KMLtoGeoJSONConverter;
