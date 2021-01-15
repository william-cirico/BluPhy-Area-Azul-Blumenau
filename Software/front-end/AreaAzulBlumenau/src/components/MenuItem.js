import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import commonStyles from '../commonStyles';

export default props => {
    return (
        <TouchableHighlight
            onPress={props.onPress}            
        >
            <View style={styles.container}>
                <Icon 
                    name={props.iconName} 
                    size={30} 
                    color='black' 
                    style={styles.icon}    
                />
                <Text style={styles.label}>{props.label}</Text>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    container: {        
        flexDirection: 'row',
        height: 50,
        backgroundColor: 'white',
        borderColor: '#DDD',
        borderTopWidth: 2,
        alignItems: 'center'
    },
    icon: {
        flex: 1,
        textAlign: 'center'
    },
    label: {
        flex: 4,        
        fontSize: 20,        
    }
});