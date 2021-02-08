import React, { useContext } from 'react';
import { Text } from 'react-native';

import { useTimer } from 'react-timer-hook';

import { VehicleContext } from '../contexts/VehicleContext';

export default ({ expiryTimestamp, style }) => {
    const { loadVehicles } = useContext(VehicleContext); 

    const {
        seconds,
        minutes,
        hours,
        pause
    } = useTimer({ 
        expiryTimestamp, 
        onExpire: loadVehicles
    });


    return (
        <Text style={style}>{hours}:{minutes}:{seconds}</Text>            
    );
}