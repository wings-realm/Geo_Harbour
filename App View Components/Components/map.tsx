import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Button, TextInput } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { LatLng, LeafletView, MapShapeType } from 'react-native-leaflet-view';
import { kml } from '@tmcw/togeojson';
const { DOMParser } = require('xmldom');
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import JSZip from 'jszip';

const DEFAULT_COORDINATE: LatLng = {
  lat: 28.382795,
  lng: 77.303428,
};

const DEFAULT_LOCATION= {
  shapeType: MapShapeType.CIRCLE,
  color: "#0000FF",
  id: "1",
  center: DEFAULT_COORDINATE,
  radius: 7
};

const Map: React.FC<{
  route: RouteProp<RootStackParamList, 'Map'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Map'>;
}> = ({ route }) => {
  const { selectedDocument } = route.params;
  const [markers, setMarkers] = useState<any[]>([]);
  const [filteredMarkers, setFilteredMarkers] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [showShapes, setShowShapes] = useState(false);
  const [radius, setRadius] = useState(1000); // Default radius
  const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);

  useEffect(() => {
    const readAndParseFile = async () => {

      try {
        const selectedDocumentUri = selectedDocument.uri;

        if (selectedDocument.type === 'application/vnd.google-earth.kml+xml') {
          // Parse KML to GeoJSON
          
          const fileContent = await RNFS.readFile(selectedDocumentUri ? selectedDocumentUri : '');
          const theKml = new DOMParser().parseFromString(fileContent, 'text/xml');
          const converted = kml(theKml);
          const newMarkers = converted.features.map((feature: any) => ({
            position: {
              lat: feature.geometry.coordinates[1],
              lng: feature.geometry.coordinates[0],
            },
            icon: '📍',
            size: [32, 32],
            title: feature.properties.name ||feature.properties.Name,
          }));

          setMarkers(newMarkers);
        } else if (selectedDocument.type === 'application/octet-stream') {
          // Parse GeoJSON
          const fileContent = await RNFS.readFile(selectedDocumentUri ? selectedDocumentUri : '');
          const converted = JSON.parse(fileContent);
          
          const newMarkers = converted.features.map((feature: any) => ({
            position: {
              lat: feature.geometry.coordinates[1],
              lng: feature.geometry.coordinates[0],
            },
            icon: '📍',
            size: [32, 32],
            title: feature.properties.Name,
            
          }));

          setMarkers(newMarkers);
        } else if (selectedDocument.type === 'application/vnd.google-earth.kmz') {
          // Handle KMZ files
          const zipContent = await RNFS.readFile(selectedDocumentUri ? selectedDocumentUri : '', 'base64');
          const zip = new JSZip();
          const zipFile = await zip.loadAsync(zipContent, { base64: true });
          
          // Extract KML file from KMZ
          const kmlFile = Object.values(zipFile.files).find((file) => file.name.endsWith('.kml'));
          if (kmlFile) {
            const kmlContent = await kmlFile.async('text');
            const theKml = new DOMParser().parseFromString(kmlContent, 'text/xml');
            const converted = kml(theKml);
            const newMarkers = converted.features.map((feature: any) => ({
              position: {
                lat: feature.geometry.coordinates[1],
                lng: feature.geometry.coordinates[0],
              },
              icon: '📍',
              size: [32, 32],
              title: feature.properties.name || feature.properties.Name || 'Unknown',
            }));

            setMarkers(newMarkers);
          } else {
            console.warn('No KML file found in the KMZ archive');
          }
        }

        console.log(selectedDocument.type);
      } catch (error) {
        console.error('Error reading/parsing file:', error);
      }
    };

    readAndParseFile();
  }, [selectedDocument]);

  useEffect(() => {
    // Initially, filtered markers are the same as all markers
    setFilteredMarkers(markers);
  }, [markers]);

 const handleInputChange = (text) => {
    setInputText(text);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const newTimeout = setTimeout(() => {
      filterMarkers(text);
    }, 500); // 500ms debounce time
    setDebounceTimeout(newTimeout);
  };

  const filterMarkers = (filterText) => {
    if (filterText.trim() === '') {
      setFilteredMarkers(markers);
    } else {
      const filtered = markers.filter(marker =>
        marker.title.toLowerCase().includes(filterText.toLowerCase())
      );
      setFilteredMarkers(filtered);
    }
  };

  const toggleShapes = () => {
    setShowShapes(!showShapes);
  };

  const handleRadiusChange = (newRadius) => {
    setRadius(parseInt(newRadius, 10) || 0);
  };

  return (
    <View style={styles.root}>
      <View style={styles.controls}>
        <Button title={showShapes ? 'Hide Buffer (mtrs)' : 'Show Buffer (mtrs)'} onPress={toggleShapes} />
        {showShapes && (
          <TextInput
            style={styles.input}
            onChangeText={handleRadiusChange}
            value={radius.toString()}
            keyboardType="numeric"
            placeholder="Enter radius"
            placeholderTextColor="#808080"
          />
        )}
        <TextInput
          style={styles.input}
          onChangeText={handleInputChange}
          value={inputText}
          placeholder="Filter by name"
          placeholderTextColor="#808080"
        />
      </View>

      {filteredMarkers.length > 0 && (

        <LeafletView 
          mapMarkers={filteredMarkers} 
          mapCenterPosition={DEFAULT_COORDINATE}
          mapShapes={showShapes ? [{
            shapeType: MapShapeType.CIRCLE,
            color: "#123123",
            id: "1",
            center: DEFAULT_COORDINATE,
            radius: radius
          }, DEFAULT_LOCATION] : [ DEFAULT_LOCATION]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    top: 5,
    left: 50,
    zIndex: 1000,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    color:'black',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5,
  },
});

export default Map;









