import React from 'react';
import { TouchableOpacity } from 'react-native';

export default {
    colors: {
        backgroundColor: '#dcdcdc',
        mainColor: '#0950ad',
        textColor: '#dcdcdc',
        colorBorder: 'lightgray',
        backgroundDefault: '#1a73e9',
    
    },
    screenOptionsLayout : {
        headerStyle: {
            backgroundColor: 'white',
        },
        headerTintColor: '#0a51ad',
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 25,
        },
        headerTitleAlign: 'center' ,
        headerLeft: props => (
            <TouchableOpacity
                {...props}
            >
                <Icon 						
                    name='angle-left' 
                    size={45}  
                    color='#084cad'
                    style={{marginLeft: 30}}						
                />
            </TouchableOpacity>
        )
    },
}