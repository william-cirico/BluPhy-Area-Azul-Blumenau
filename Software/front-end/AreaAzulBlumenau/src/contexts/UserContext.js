import React, { createContext, useEffect, useReducer } from 'react';

import axios from 'axios';

import Loading from '../screens/LoadingScreen';
import { server, showErrorMessage } from '../utils/common';

export const UserContext = createContext();


export default ({ children }) => {
    const reducer = (prevState, action) => {
        switch(action.type) {
            case 'RESTORE_USER':
                return {
                    ...prevState,
                    isLoading: false,
                    userData: action.userData,
                }
            case 'CHANGE_USER':
                return {
                    ...prevState,
                    userData: action.userData,
                }
            case 'SIGN_OUT':
                return {
                    ...prevState,
                    userData: null,
                }
        }
    };

    const initialState = {
        isLoading: true,
        userData: null,
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    const loadUser = async () => {
        try {
            res = await axios(`${server}/users/`);                            
            dispatch({type: 'RESTORE_USER', userData: res.data})
        } catch(e) {
            showErrorMessage(e);
        }            
    };

    useEffect(() => {        
        loadUser();
    }, []);
    
    if (state.isLoading) {
        return <Loading />
    }

    return (
        <UserContext.Provider value={{
            userData: state.userData, 
            loadUser, 
            clearUser: () => dispatch({ type: 'SIGN_OUT'})
        }}>
            {children}
        </UserContext.Provider>
    )
};
