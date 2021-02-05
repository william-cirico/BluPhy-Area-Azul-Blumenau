import React, { createContext, useReducer, useEffect, useMemo } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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
                // Validando o token
                await axios(
                    `${server}/users/`,
                    {headers: {'Authorization': `bearer ${userToken}`}}
                ); 
                // Definindo o header de Authorization para as próximas requisições
                axios.defaults.headers.common['Authorization'] = `bearer ${userToken}`;
                    // Salvando o estado
                dispatch({ 
                    type: 'RESTORE_TOKEN', 
                    userToken: userToken, 
                }); 
            } catch(e) {                
                console.log(`Não foi possível restaurar o Token: ${e}`);
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
                        scope: 'user',
                    })
                );

                const userToken = resToken.data.access_token
                
                // Salvando o token recebido no AsyncStorage
                AsyncStorage.setItem('@auth_token', userToken);                
                // Obtendo os dados do usuário
                await axios(
                    `${server}/users/`,
                    {headers: {'Authorization': `bearer ${userToken}`}}
                );

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

    return (
        <AuthContext.Provider value={{userToken: state.userToken, isLoading: state.isLoading, authContext: authContext}}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };