import React, 
{ 
    createContext, 
    useEffect, 
    useMemo, 
    useReducer 
} from 'react';
import { Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'

import { server, showErrorMessage } from '../utils/common';


const AuthContext = createContext({isLoading: true, userToken: null});

export const AuthProvider = ({ navigation }) => {
    const initialState = {
        isLoading: true,        
        userToken: null,
    };
    
    const signInReducer = (prevState, action) => {
        switch(action.type) {
            case 'RESTORE_DATA':
                return {
                    ...prevState,
                    isLoading: false,                    
                    userToken: action.token,
                };
            case 'SIGN_IN':
                return {
                    ...prevState,
                    isLoading: false,                    
                    userToken: action.token,
                };
            case 'SIGN_OUT':
                return {
                    ...prevState,
                    isLoading: false,                    
                    userToken: null,
                };
            case 'REGISTER':
                return {
                    ...prevState,                                        
                    isLoading: false,
                };
        }
    };

    const [signInState, dispatch] = useReducer(signInReducer, initialState);


    useEffect(() => {        
        const loadStorageData = async () => {
            let userToken;

            try {
                userToken = await AsyncStorage.getItem('@auth_Token');
                userData = await AsyncStorage.getItem('@user_Data');

                dispatch({ type: 'RESTORE_DATA', token: userToken, 'user': userData })
            } catch(e) {
                console.log(e);
            }       
        }

        loadStorageData();
    }, []);

    const authContext = useMemo(() => ({
        isLoading: signInState.isLoading,
        userToken: !!signInState.userToken,
        signIn: async data => {
            try {
                const qs = require('qs');

                const response = await axios.post(
                    `${server}/auth/login`,
                    qs.stringify({
                        username: data.username,
                        password: data.password,
                        scope: 'user'
                    })
                );

                const { token, tokenType } = await JSON.parse(response)
                
                
                await AsyncStorage.setItem('@auth_Token', token);
                axios.defaults.headers.common['Authorization'] = `${tokenType} ${token}`;          

                dispatch({ type: 'SIGN_IN', userToken: token }); 
            } catch(e) {
                showErrorMessage(e);
            }
        },
        signOut: async () => {
            try {
                await AsyncStorage.removeItem('@auth_Token');
                axios.defaults.headers.common['Authorization'] = '';
                dispatch({ type: 'SIGN_OUT' });
            } catch(e) {
                showErrorMessage(e);
            }
        },
        signUp: async data => {
            try {
                response = await axios.post(
                    `${server}/users/`,
                    {
                        name: data.name, 
                        email: data.email,
                        phone: data.phone, 
                        document_number: data.document_number,
                        password: data.password
                    }
                );
                dispatch({ type: 'REGISTER' });
                Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
                navigation.navigate('SignInScreen');
            } catch(e) {
                showErrorMessage(e);
            }
        },
    }), []);
    
    return (            
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;