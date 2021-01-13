import React, 
{ 
    createContext, 
    useEffect, 
    useMemo, 
    useReducer 
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as auth from '../services/authServices';

const AuthContext = createContext({ isLoading: false, userToken: null });

export const AuthProvider = ({ children }) => {
    const initialSignInState = {
        isLoading: true,
        user: null,
        userToken: 'aaa',
    };
    
    const signInReducer = (prevState, action) => {
        switch(action.type) {
            case 'RESTORE_DATA':
                return {
                    ...prevState,
                    isLoading: false,
                    user: action.user,
                    userToken: action.token,
                };
            case 'SIGN_IN':
                return {
                    ...prevState,
                    isLoading: false,
                    user: action.user,
                    userToken: action.token,
                };
            case 'SIGN_OUT':
                return {
                    ...prevState,
                    isLoading: false,
                    user: null,
                    userToken: null,
                };
            case 'REGISTER':
                return {
                    ...prevState,
                    user: action.user,
                    userToken: action.token,
                    isLoading: false,
                };
        }
    };

    const [signInState, dispatch] = useReducer(signInReducer, initialSignInState);


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
                const res = await auth.signIn(data);
                const {token, user} = res;
                
                await AsyncStorage.setItem('@auth_Token', token);
                await AsyncStorage.setItem('@user_Data', JSON.stringify(user));

                dispatch({ type: 'SIGN_IN', token: token, user: user }); 
            } catch(e) {
                console.log(e);
            }
        },
        signOut: async () => {
            try {
                await AsyncStorage.removeItem('@auth_Token');
                await AsyncStorage.removeItem('@user_Data');
                
                dispatch({ type: 'SIGN_OUT' });
            } catch(e) {
                console.log(e);
            }
        },
        signUp: async data => {
            // Implementar
        },
    }), []);
    
    return (            
        <AuthContext.Provider value={authContext, {isLoading: signInState.isLoading, userToken: !!signInState.userToken}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;