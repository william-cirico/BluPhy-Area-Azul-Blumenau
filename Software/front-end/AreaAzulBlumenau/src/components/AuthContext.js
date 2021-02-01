import { createContext } from 'react';

export const AuthContext = createContext({isLoading: true, userToken: null});
