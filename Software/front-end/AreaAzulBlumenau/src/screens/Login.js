import React, { useReducer } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import commonStyles from '../commonStyles';

function reducer(state, action) {
    switch (action.type) {
        case 'cpfEmail':
            return { ...state, cpfEmail: action.value }
        case 'password':
            return { ...state, password: action.value }
    }
}

const initialState = {
    cpfEmail: '110.814.329-23',
    password: '123456',
}

export default () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.logo}/>
            </View>
            <View style={styles.body}>
                <Text style={styles.text}>CPF / EMAIL</Text>
                <TextInput style={styles.input}
                    defaultValue={state.cpfEmail}
                    onChangeText={text => {
                        dispatch({ type: 'cpfEmail', value: text });
                    }}
                    keyboardType='email-address'
                />
                <Text style={styles.text}>Senha</Text>
                <TextInput style={styles.input}
                    defaultValue={state.password}
                    onChangeText={text => {
                        dispatch({ type: 'password', value: text });
                    }}
                    secureTextEntry={true}
                />
                <TouchableOpacity>
                    <Text style={[styles.text, {fontWeight: 'bold'}]}>Esqueceu a senha?</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.button}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.register}>
                    <Text style={styles.text}>Não tem conta ainda?</Text>
                    <Text style={[styles.text, {fontWeight: 'bold', fontSize: 17}]}> Cadastre-se!</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: commonStyles.colors.backgroundColor,
    },
    header: {
        height: 170,
        backgroundColor: commonStyles.colors.mainColor,
        borderBottomRightRadius: 130,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    body: {
        flex: 1,        
        justifyContent: 'center',        
        padding: 30,
        marginTop: 70
    },  
    logo: {
        position: 'relative',
        top: 100,
        height: 200,
        width: 200,
        backgroundColor: 'white',
        borderRadius: 100,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 10,      
        height: 40,
        marginBottom: 15,
        paddingLeft: 10,
        color: commonStyles.colors.textColor,        
    },
    text: {
        color: commonStyles.colors.textColor,
        fontSize: 16
    },
    register: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    button: {
        color: 'white',
        backgroundColor: commonStyles.colors.mainColor,
        padding: 20,
        borderRadius: 10,
        marginVertical: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    }
});