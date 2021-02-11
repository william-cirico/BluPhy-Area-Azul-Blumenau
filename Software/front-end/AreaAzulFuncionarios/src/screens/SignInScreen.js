import React from 'react';
import { KeyboardAvoidingView, Image, StyleSheet, Text, TextInput, View  } from 'react-native'; 

import commonStyles from '../theme/commonStyles';
import Button from '../components/Button';
import Input from '../components/Input';

export default () => {
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior='padding'
        >
            <View style={styles.boxLogo}>
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logo}
                        source={require('../img/logoFuncionarios.png')}
                    />
                </View>
            </View>
            <View style={styles.containerView}>
                <View style={styles.box}>
                    <Text style={styles.text}>E-mail</Text>
                    <Input/>
                    <Text style={styles.text}>Senha</Text>
                    <Input/>
                    <Button
                        title="Entrar"
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: commonStyles.colors.backgroundColor, 
    },
    containerView: {        
        borderTopRightRadius: 95,    
        backgroundColor: commonStyles.colors.mainColor, 
    },
    box: {
        padding: 30,
    },
    boxLogo: {
        justifyContent: 'center',
        flex: 1,   
    },
    logoContainer: { 
        alignItems: 'center',  
    },
    logo: { 
        height: 200,
        width: 200,               
        backgroundColor: 'white',      
        borderRadius: 100,
        marginVertical: 10,               
    }, 
    text: {
        color: commonStyles.colors.textColor,
        fontSize: 16
    }
});