import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import commonStyles from '../theme/commonStyles.js';

export default props => {    
    return (
    <View style={[styles.inputContainer, props.style]}>
        <TextInput {...props} style={styles.input} />
        {props.isValid &&             
            <Icon 
                color='#eb0e42'
                name='check-circle'
                size={20}
                style={{ marginHorizontal: 10 }}
            />
        }
    </View>
    )
};

const styles = StyleSheet.create({
    inputContainer: {        
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderLeftColor: commonStyles.colors.colorBorder,
        borderLeftWidth: 15,
        borderRadius: 10,
        marginVertical: 10,         
    },
    input: {  
        flex: 1,
        paddingLeft: 20,
        color: commonStyles.colors.mainColor,     
        fontSize: 16,
    },
});

