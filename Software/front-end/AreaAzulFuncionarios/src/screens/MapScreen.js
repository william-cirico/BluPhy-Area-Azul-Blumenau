import React from 'react';
import { StyleSheet, View } from 'react-native';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

export default ({route}) => {           
    return (
        <View style={styles.mapContainer}>
            <MapView
                provider={PROVIDER_GOOGLE}                
                style={styles.map}
                initialRegion={{
                    latitude: route.params.location.latitude,
                    longitude: route.params.location.longitude,
                    latitudeDelta: 0.0090,
                    longitudeDelta: 0.0090,
                }}
            >
                <Marker
                    draggable
                    coordinate={{
                        latitude: route.params.location.latitude,
                        longitude: route.params.location.longitude,
                    }}                                        
                />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    mapContainer: {
        flex: 1,
    }
})