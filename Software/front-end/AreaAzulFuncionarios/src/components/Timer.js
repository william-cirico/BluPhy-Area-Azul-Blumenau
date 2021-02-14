import React from 'react';
import { Text } from 'react-native';

import { useTimer } from 'react-timer-hook';

export default ({ expiryTimestamp, style }) => {        
    const {
        seconds,
        minutes,
        hours,
    } = useTimer({ 
        expiryTimestamp, 
        onExpire: () => console.log('Expirou!')
    });

    return (
        <Text style={style}>{hours}:{minutes}:{seconds}</Text>
    );
}