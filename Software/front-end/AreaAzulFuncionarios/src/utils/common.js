import { Alert, Platform } from 'react-native'

const server = Platform.OS === 'ios' ?
    'http://localhost:3000' : 'http://localhost:3333';

const showErrorMessage = e => {
    Alert.alert('Erro', `${e.response.data.detail}`);
}

export {server, showErrorMessage};