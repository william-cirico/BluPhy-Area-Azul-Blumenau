import { Alert, Platform } from 'react-native'

const server = Platform.OS === 'ios' ?
    'http://localhost:3000' : 'http://10.0.2.2:8000';

const showErrorMessage = e => {
    // if (e.reponse && e.response.data) {
        Alert.alert('Ops! Ocorreu um problema:', `${e.response.data.detail}`);
    // } else {
    //     Alert.alert('Ops! Ocorreu um problema:', `${e}`);
    // }
}

export {server, showErrorMessage};