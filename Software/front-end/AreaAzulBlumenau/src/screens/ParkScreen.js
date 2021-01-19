import React, { useEffect, useReducer } from 'react';
import { 
    ActivityIndicator,
    Dimensions, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    PermissionsAndroid, 
    View,    
} from 'react-native';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation, { getCurrentPosition } from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/FontAwesome';

import commonStyles from '../commonStyles';
import Button from '../components/Button';

export default ({ navigation }) => {
    const reducer = (prevState, action) => {
        switch(action.type) {
            case 'MAP':                
                return {
                    ...prevState,
                    initialPosition: action.initialPosition,
                    markerPosition: action.markerPosition,
                    isLoading: false,                    
                }
            case 'PARKING_TIME':
                return {
                    ...prevState,
                    parkingTime: action.parkingTime,
                }
        }
    };

    initialState = {
        initialPosition: null,
        markerPosition: {
            latitude: 0,
            longitude: 0
        },
        isLoading: true,
        parkingTime: 1,
    }

    const [state, dispatch] = useReducer(reducer, initialState);    

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {                
                getCurrentPosition();
            }
        } catch(e) {
            console.log(e);
        }
    };

    const getCurrentPosition = () => {
        Geolocation.getCurrentPosition(
            position => {                                   
                let initialPosition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.0090,
                    longitudeDelta: 0.0090,
                };

                let markerPosition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                
                dispatch({ type: 'MAP', initialPosition: initialPosition, markerPosition: markerPosition });
            },
            error => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
        );
    };

    const confirmParking = () => {
        // TODO: Implementar        
        console.log(state.markerPosition.latitude);
        // navigation.navigate('MainScreen');
    };

    useEffect(() => {            
        requestLocationPermission();
    }, []);

    if (state.isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator 
                    size='large' 
                    animating={true} 
                    color={commonStyles.colors.mainColor}                   
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>                
                <MapView
                    provider={PROVIDER_GOOGLE}                
                    style={styles.map}
                    initialRegion={state.initialPosition}
                >
                    <Marker
                        draggable
                        coordinate={state.markerPosition}
                        onDragEnd={(e) => console.log(e.nativeEvent.coordinate)}                
                    />
                </MapView>                
            </View>
            <View style={styles.body}>
                <View style={styles.radioButton}>
                    <TouchableOpacity
                        onPress={() => dispatch({ type: 'PARKING_TIME', parkingTime: 1 })}
                        style={
                            [styles.button, state.parkingTime === 1 ? 
                            {backgroundColor: commonStyles.colors.mainColor} : 
                            {
                                backgroundColor: 'white',
                                borderColor: commonStyles.colors.mainColor,
                                borderWidth: 3,
                            }]
                        }
                    >
                        <Icon 
                            name='history' 
                            size={30} 
                            color={
                                state.parkingTime === 1 ? 'white' : commonStyles.colors.mainColor
                            } 
                        />
                        <Text 
                            style={                                
                                state.parkingTime === 1 ? {color: 'white'} : {color: commonStyles.colors.mainColor}
                            }
                        >1 Hora</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => dispatch({ type: 'PARKING_TIME', parkingTime: 2 })}
                        style={
                            [styles.button, state.parkingTime === 2 ? 
                            {backgroundColor: commonStyles.colors.mainColor} : 
                            {
                                backgroundColor: 'white',
                                borderColor: commonStyles.colors.mainColor,
                                borderWidth: 3,
                            }]
                        }
                    >
                        <Icon 
                            name='history' 
                            size={30} 
                            color={
                                state.parkingTime === 2 ? 'white' : commonStyles.colors.mainColor
                            } 
                        />
                        <Text
                            style={                                
                                state.parkingTime === 2 ? {color: 'white'} : {color: commonStyles.colors.mainColor}
                            }
                        >2 Horas</Text>
                    </TouchableOpacity>                
                </View>
                <View style={styles.buttonContainer}>
                    <Button 
                        title='Estacionar Veículo'
                        disabled={false}
                        onPress={confirmParking}
                    />
                </View>     
            </View>                   
        </View>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
    },
    container: {
      flex: 1,
      backgroundColor: commonStyles.colors.backgroundColor,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    mapContainer: {
        flex: 3,
    },
    body: {
        flex: 2,
        padding: 30,        
        justifyContent: 'center'
    },
    button: {
        width: Dimensions.get('window').width / 4,
        height: Dimensions.get('window').width / 4,        
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginHorizontal: 5,       
    },
    radioButton: {
        flex: 1,        
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    }
});
