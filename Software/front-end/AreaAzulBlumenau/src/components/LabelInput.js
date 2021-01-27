import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import commonStyles from '../theme/commonStyles';

export default props => {
    return (
        <View style={styles.container}>
            <View style={styles.containerLabel}>
                <Text style={styles.label}>{props.label}</Text>
            </View>            
            <View style={styles.inputContainer}>
                <TextInput
                    {...props}                                                            
                    style={styles.input}
                />
                <View style={styles.iconContainer}>
                    {props.isValid &&             
                        <Icon 
                            color='#25cc30'
                            name='check-circle'
                            size={20}                        
                        />
                    }
                </View>  
            </View>
                      
        </View>
    );
}

const styles = StyleSheet.create({
    container: {                
        flexDirection: 'row',        
        marginTop: 15,                            
    },
    containerLabel: {
        flex: 3,
        backgroundColor: commonStyles.colors.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
    },
    label: {
        color: 'white',
    },  
    inputContainer: {
        flex: 7,
        backgroundColor: 'white',        
        flexDirection: 'row',        
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
    },
    input: {        
        flex: 10,        
        fontSize: 20,
        color: commonStyles.colors.textColor,
        fontWeight: 'bold',        
        paddingLeft: 15,        
    },
    iconContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'                
    }
});