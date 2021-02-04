import React, { createContext, useReducer, useEffect, useMemo } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { server, showErrorMessage } from '../utils/common';


const AuthContext = createContext();

export default ({ children }) => {
    const initialState = {
        isLoading: true,        
        userToken: null,
        userData: null,
    };
    
    const reducer = (prevState, action) => {
        switch(action.type) {
            case 'RESTORE_TOKEN':
                return {
                    ...prevState,
                    isLoading: false,                    
                    userToken: action.userToken,
                    userData: action.userData,
                };
            case 'SIGN_IN':
                return {
                    ...prevState,                
                    userToken: action.userToken,
                    userData: action.userData,
                };
            case 'SIGN_OUT':
                return {
                    ...prevState,                 
                    userToken: null,
                    userData: null,
                };
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {        
        const loadStorageData = async () => { 
            let userToken = null
            let userData = null

            try {
                // Obtendo o token de autenticação do AsyncStorage
                userToken = await AsyncStorage.getItem('@auth_token');
                // Validando o token e obtendo os dados do usuário
                userData = await axios(
                    `${server}/users/`,
                    {headers: {'Authorization': `bearer ${userToken}`}}
                ); 
                // Definindo o header de Authorization para as próximas requisições
                axios.defaults.headers.common['Authorization'] = `bearer ${userToken}`;                                              
            } catch(e) {                
                console.log(`Não foi possível restaurar o Token: ${e}`);
            } 

            // Salvando o estado
            dispatch({ 
                type: 'RESTORE_TOKEN', 
                userToken: userToken, 
                userData: userData
            }); 
        }

        loadStorageData();
    }, []);

    const authContext = useMemo(() => ({
        signIn: async ({ username, password }) => {
            try {
                // Utilizando o QS para mandar um x-www-form-urlencoded
                const qs = require('qs');
                // Fazendo a requisição
                const res = await axios.post(
                    `${server}/auth/login`,
                    qs.stringify({
                        username: username,
                        password: password,
                        scope: 'user',
                    })
                );

                const userToken = res.data.access_token
                
                // Salvando o token recebido no AsyncStorage
                AsyncStorage.setItem('@auth_token', userToken);                
                // Obtendo os dados do usuário
                const userData = await axios(
                    `${server}/users/`,
                    {headers: {'Authorization': `bearer ${userToken}`}}
                );
                // Definindo o header de Authorization para as próximas requisições
                axios.defaults.headers.common['Authorization'] = `bearer ${userToken}`;
                // Salvando o estado
                dispatch({
                    type: 'SIGN_IN',
                    userToken: userToken,
                    userData: userData,
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
        }
    }), []);

    return (
        <AuthContext.Provider value={[state.userData, state.isLoading, authContext]}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };