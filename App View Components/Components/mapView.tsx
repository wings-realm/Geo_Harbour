import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { LatLng, LeafletView } from 'react-native-leaflet-view';

const Mapv = () => {

    return (

      <View style={styles.container}>
        <LeafletView mapCenterPosition={ {lat: 28.385331, lng: 77.306881} } />
        <Text style={styles.text}>Renedered from map</Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    map:{
      width:'100%',
      height:'100%',
    },
  });
  
  export default Mapv;