import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

import commonStyles from '../theme/commonStyles';
import { server, showErrorMessage } from '../utils/common';

export default ({ navigation, route }) => {
    const [link, setLink]= useState();

    const paymentByBillet = async () => {
        try {
            res = await axios.post(`${server}/recharges/?amount=${10}`);

            setLink(res.data.link);
        } catch(e) {
            showErrorMessage(e);
        }
    };

    if (link) {
        return <WebView source={{ uri: link }} />        
    }

    return (
        <View style={styles.container}>            
            <Text style={styles.title}>Escolha a forma de pagamento:</Text>
            <TouchableOpacity 
                style={styles.paymentForm}
                onPress={paymentByBillet}
            >
                <Icon
                    name='barcode'
                    size={30}  
                    style={styles.icon}              
                />
                <Text style={styles.paymentText}>Boleto bancário</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.paymentForm, {borderColor: '#ccc'}]}
                disabled={true}
            >
                <Icon
                    name='credit-card'
                    size={30}  
                    style={styles.icon}              
                />
                <Text style={styles.paymentText}>Cartão de crédito</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    paymentForm: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 50,
        borderColor: commonStyles.colors.mainColor,
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        marginVertical: 5,
        marginHorizontal: 30,
    },
    paymentText: {
        fontSize: 18,
        flex: 3,
        paddingLeft: 40,
    },
    icon: {
        flex: 1,                        
        textAlign: 'center'
    }
});