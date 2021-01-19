import React from 'react';
import { Text } from 'react-native';

export default ({ navigation, route }) => {
    return (
        <Text>{route.params && route.params.value}</Text>
    );
}