import React, { useReducer } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import commonStyles from '../commonStyles';

function reducer(state, action) {
    switch (action.type) {
        case 'name':
            return { ...state, name: action.value }
        case 'email':
            return { ...state, email: action.value }
        case 'cpfCnpj':
            return { ...state, cpfCnpj: action.value }
        case 'phone':
            return { ...state, phone: action.value }
        case 'password':
            return { ...state, password: action.value }
        case 'confirmPassword':
            return { ...state, confirmPassword: action.value }
    }
}

const initialState = {
    name: '',
    email: '',
    cpfCnpj: '',
    phone: '',
    password: '',
    confirmPassword: '',
}

export default () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    const validations = [];
    validations.push(state.email && state.email.includes('@'));
    validations.push(state.password && state.password.length >= 6);
    validations.push(state.confirmPassword && state.password == state.confirmPassword);

    const validForm = validations.reduce((t, a) => t && a);

    return (
        <View style={styles.container}>
            <TextInput style={styles.input}
                onChangeText={text => {
                    dispatch({ type: 'name', value: text });
                }} 
                placeholder='Nome'
            />
            <TextInput style={styles.input} 
                onChangeText={text => {
                    dispatch({ type: 'email', value: text });
                }}
                placeholder='E-mail'
                keyboardType='email-address'
            />
            <TextInput style={styles.input} 
                onChangeText={text => {
                    dispatch({ type: 'cpfCnpj', value: text });
                }}
                placeholder='CPF / CNPJ'
            />
            <TextInput style={styles.input} 
                onChangeText={text => {
                    dispatch({ type: 'phone', value: text });
                }}
                placeholder='Telefone'
                keyboardType='numeric'
            />
            <TextInput style={styles.input} 
                onChangeText={text => {
                    dispatch({ type: 'password', value: text });
                }}
                placeholder='Senha'
                secureTextEntry={true}
            />
            <TextInput style={styles.input} 
                onChangeText={text => {
                    dispatch({ type: 'confirmPassword', value: text });
                }}
                placeholder='Confirmar senha'
                secureTextEntry={true}
            />
            <TouchableOpacity
                disabled={!validForm}
            >
                <Text style={[styles.button, validForm ? {} : { backgroundColor: '#AAA' }]}>Cadastre-se</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: commonStyles.colors.backgroundColor,
        padding: 30,
        justifyContent: 'center'
    },
    input: {                
        backgroundColor: 'white',
        borderLeftColor: commonStyles.colors.mainColor,
        borderLeftWidth: 15,
        borderRadius: 10,
        paddingLeft: 20,
        marginVertical: 10, 
    },
    button: {
        color: 'white',
        backgroundColor: commonStyles.colors.mainColor,
        padding: 20,
        borderRadius: 10,
        marginTop: 40,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    }
});