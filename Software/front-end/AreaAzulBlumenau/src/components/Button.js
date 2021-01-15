import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import commonStyles from '../commonStyles';

export default props => (
    <TouchableOpacity {...props} activeOpacity={0.7}>
        <Text 
            style={[styles.button, props.disabled ? {backgroundColor: '#AAA'} : {}]}
        >
            {props.title}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {        
        color: 'white',
        backgroundColor: commonStyles.colors.mainColor,
        padding: 15,
        borderRadius: 10,
        marginVertical: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 25,        
    },
});

