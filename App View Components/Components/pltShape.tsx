// import React, { useEffect, useState } from 'react';
// import { StyleSheet, View } from 'react-native';
// import { RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from './types';
// import { LatLng, LeafletView, MapMarker } from 'react-native-leaflet-view';
// import { parseFolder } from 'rn-shp-to-geojson';
// import DocumentPicker from 'react-native-document-picker';

// const DEFAULT_COORDINATE: LatLng = {
//   lat: 37.78825,
//   lng: -122.4324,
// };

// const PltGeoJSON: React.FC<{
//   route: RouteProp<RootStackParamList, 'Map'>;
//   navigation: NativeStackNavigationProp<RootStackParamList, 'Map'>;
// }> = ({ route }) => {
//   const { selectedDocument } = route.params;
//   const [geoJson, setGeoJson] = useState<any>(null);

//   useEffect(() => {
//     const readAndParseFile = async () => {
//       try {
//         const result = await DocumentPicker.pick({
//           type: [DocumentPicker.types.allFiles],
//         });

//         const selectedFolderPath = result.at(0)?.uri;
//         if (selectedFolderPath) {
//           const converted = await parseFolder(selectedFolderPath);
//           setGeoJson(converted);
//         }
//       } catch (error) {
//         console.error('Error converting shapefile:', error);
//       }
//     };

//     readAndParseFile();
//   }, [selectedDocument]);

//   const renderGeoJsonLayer = () => {
//     if (!geoJson) return null;

//     return geoJson.features.map((feature, index) => {
//       if (feature.geometry.type === 'Point') {
//         const [lng, lat] = feature.geometry.coordinates;
//         return (
//           <MapMarker
//             key={index}
//             coordinate={{ lat, lng }}
//             title={feature.properties.name} // Adjust based on your GeoJSON properties
//             description={feature.properties.description} // Adjust based on your GeoJSON properties
//           />
//         );
//       }
//       return null;
//     });
//   };

//   return (
//     <View style={styles.root}>
//       <LeafletView
//         mapCenterPosition={DEFAULT_COORDINATE}
//       >
//         {renderGeoJsonLayer()}
//       </LeafletView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default PltGeoJSON;
