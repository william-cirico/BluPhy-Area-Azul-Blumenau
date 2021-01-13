import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import commonStyles from  '../commonStyles';

export default props => {
    return (
        <View styles={styles.container}>
            <View styles={styles.vehicleContainer}>
                <TouchableWithoutFeedback                     
                    onPress={() => console.log('clique')}
                >
                    <View styles={styles.vehicleButton}>
                        <Icon name='motorcycle' size={50} color='red' />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: commonStyles.colors.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    vehicleContainer: {
        flex: 1,
        flexDirection: 'row',        
    },
    vehicleButton: {
        flex: 1,
        height: 30,
        width: 30,        
        backgroundColor: commonStyles.colors.mainColor,
    }
});