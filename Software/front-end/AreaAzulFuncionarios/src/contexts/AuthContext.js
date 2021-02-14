import React, { createContext, useReducer, useEffect, useMemo } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Loading from '../components/Loading';
import { server, showErrorMessage } from '../utils/common';


const AuthContext = createContext();

export default ({ children }) => {
    const initialState = {        
        isLoading: true,        
        userToken: null,
    };
    
    const reducer = (prevState, action) => {
        switch(action.type) {
            case 'RESTORE_TOKEN':
                return {
                    ...prevState,
                    isLoading: false,                    
                    userToken: action.userToken,
                };
            case 'SIGN_IN':
                return {
                    ...prevState,                
                    userToken: action.userToken,
                };
            case 'SIGN_OUT':
                return {
                    ...prevState,                 
                    userToken: null,
                };
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {        
        const loadStorageData = async () => {                         
            try {
                // Obtendo o token de autenticação do AsyncStorage
                const userToken = await AsyncStorage.getItem('@auth_token');                                
                // Definindo o header de Authorization para as próximas requisições
                axios.defaults.headers.common['Authorization'] = `bearer ${userToken}`;                
                dispatch({ 
                    type: 'RESTORE_TOKEN', 
                    userToken: userToken, 
                });           
            } catch(e) {  
                await AsyncStorage.removeItem('@auth_token');
                dispatch({ 
                    type: 'RESTORE_TOKEN', 
                    userToken: null, 
                });           
            }               
        }
        loadStorageData();
    }, []);

    const authContext = useMemo(() => ({
        signIn: async ({ username, password }) => {
            try {
                // Utilizando o QS para mandar um x-www-form-urlencoded
                const qs = require('qs');
                // Fazendo a requisição
                const resToken = await axios.post(
                    `${server}/auth/login`,
                    qs.stringify({
                        username: username,
                        password: password,
                        scope: 'traffic_warden',
                    })
                );

                const userToken = resToken.data.access_token
                
                // Salvando o token recebido no AsyncStorage
                AsyncStorage.setItem('@auth_token', userToken);                
                // Definindo o header de Authorization para as próximas requisições
                axios.defaults.headers.common['Authorization'] = `bearer ${userToken}`;
                // Salvando o estado
                dispatch({
                    type: 'SIGN_IN',
                    userToken: userToken                    
                });
            } catch(e) {
                showErrorMessage(e);
            }
        },
        signOut: () => {
            try {
                // Apagar o token do AsyncStorage
                AsyncStorage.removeItem('@auth_token');
                // Apagar o header de Authorization do axios
                delete axios.defaults.headers.common['Authorization'];
                // Modificar o estado
                dispatch({type: 'SIGN_OUT'})
            } catch(e) {
                showErrorMessage(e);
            }
        },
    }), []);

    if (state.isLoading) {
        return <Loading />
    }

    return (
        <AuthContext.Provider value={{userToken: state.userToken, authContext: authContext}}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };