import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { LatLng, LeafletView } from 'react-native-leaflet-view';
import { kml } from '@tmcw/togeojson';
const { DOMParser } = require('xmldom');
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import { unzip } from 'react-native-zip-archive'; // Add this for handling KMZ files
import charsetDetector from 'charset-detector';

const DEFAULT_COORDINATE: LatLng = {
  lat: 37.78825,
  lng: -122.4324,
};

const Map: React.FC<{
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

        const selectedDocumentUri = result.at(0)?.uri;

        if (selectedDocumentUri) {
          const fileExtension = selectedDocumentUri.split('.').pop();
          let fileContent;

          if (fileExtension === 'kmz') {
            const targetPath = `${RNFS.DocumentDirectoryPath}/extracted`;
      await RNFS.mkdir(targetPath);
      const unzippedPath = await unzip(selectedDocumentUri, targetPath);

      // You may need to adjust this to find the correct KML file
      const kmlFilePath = `${unzippedPath}/doc.kml`;

      // Read the file into a buffer
      const fileBuffer = await RNFS.readFile(kmlFilePath, 'base64');
      // Convert the buffer to a string
      const fileContent = Buffer.from(fileBuffer, 'base64').toString('utf8');
          } else {
            // For KML files, read directly
            fileContent = await RNFS.readFile(selectedDocumentUri);
          }

          const theKml = new DOMParser().parseFromString(fileContent, 'text/xml');
          const converted = kml(theKml);

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
        }
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

export default Map;
