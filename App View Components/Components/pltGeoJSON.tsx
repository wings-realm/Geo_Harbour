import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { LatLng, LeafletView } from 'react-native-leaflet-view';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';

const DEFAULT_COORDINATE: LatLng = {
  lat: 37.78825,
  lng: -122.4324,
};

const PltGeoJSON: React.FC<{
  route: RouteProp<RootStackParamList, 'Map'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Map'>;
}> = ({ route }) => {
  const { selectedDocument } = route.params;
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    const readAndParseFile = async () => {
      try {
        // Open the document picker
        const result = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });

        // Get the URI of the selected document
        const selectedDocumentUri = result.at(0)?.uri;

        // Read the file content
        const fileContent = await RNFS.readFile(selectedDocumentUri ? selectedDocumentUri : "");

        // Parse GeoJSON
        const converted = JSON.parse(fileContent);

        // Extract information from GeoJSON features and create markers
        const newMarkers = converted.features.map((feature: any) => ({
          position: {
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0],
          },
          icon: '📍', // You can customize the icon based on your requirements
          size: [32, 32],
          title: feature.properties.Name, // Adjust this based on your GeoJSON structure
        }));

        setMarkers(newMarkers);
      } catch (error) {
        console.error('Error reading/parsing file:', error);
      }
    };

    readAndParseFile();
  }, [selectedDocument]);

  return (
    <View style={styles.root}>
      {markers.length > 0 && (
        <LeafletView
          mapMarkers={markers}
          mapCenterPosition={DEFAULT_COORDINATE}
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
});

export default PltGeoJSON;
