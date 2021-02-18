import { Alert, Platform } from 'react-native'

const server = 'http://15.228.15.40:8080';

const showErrorMessage = e => {
    Alert.alert('Erro', `${e.response.data.detail}`);
}

export {server, showErrorMessage};