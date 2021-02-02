import 'react-native-gesture-handler';
import React, 
{ 
    useEffect, 
    useMemo, 
    useReducer 
} from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { server, showErrorMessage } from './utils/common';
import { AuthContext } from './components/AuthContext';
import AppRoutes from './routes/AppRoutes';
import AuthRoutes from './routes/AuthRoutes';


export default () => {    
    const initialState = {
        isLoading: true,
        isSignout: false,
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
                    isSignout: false,                  
                    userToken: action.userToken,
                };
            case 'SIGN_OUT':
                return {
                    ...prevState,
                    isSignout: true,                   
                    userToken: null,
                };
            case 'REGISTER':
                return {
                    ...prevState,                    
                    userToken: action.userToken,
                    isLoading: false,
                };
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);


    useEffect(() => {        
        const loadStorageData = async () => {            
            try {
                const userToken = await AsyncStorage.getItem('@auth_Token');                

                dispatch({ type: 'RESTORE_TOKEN', userToken: userToken })
            } catch(e) {
                console.log(e);
            }       
        }

        loadStorageData();
    }, []);

    const authContext = useMemo(() => ({        
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
                console.log(response.data.access_token)
                console.log(JSON.stringify(response.data.access_token))
                await AsyncStorage.setItem('@auth_Token', JSON.stringify(response.data.access_token));                
                axios.defaults.headers.common['Authorization'] = `${response.data.token_type} ${response.data.access_token}`;
                dispatch({ type: 'SIGN_IN', userToken: response.data.access_token});                
            } catch(e) {
                showErrorMessage(e);
            }
        },
        signOut: async () => {
            try {
                await AsyncStorage.removeItem('@auth_Token');                
                delete axios.defaults.headers.common['Authorization'];
                dispatch({ type: 'SIGN_OUT' });
            } catch(e) {
                showErrorMessage(e);
            }
        },
        signUp: async data => {
            try {
                await axios.post(
                    `${server}/users/`,
                    {
                        name: data.name,
                        password: data.password,
                        email: data.email
                    }
                );                                
            } catch(e) {
                console.log(e);
            }
        
        },
	}), []);
	
	if (state.isLoading) {	
		return (
			<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
				<ActivityIndicator size="large"/>
			</View>
		);
	}

	return (		
		<AuthContext.Provider value={authContext}>
			<NavigationContainer>
				{state.userToken ? <AppRoutes /> : <AuthRoutes />}
			</NavigationContainer>
		</AuthContext.Provider>		
	);    
};
