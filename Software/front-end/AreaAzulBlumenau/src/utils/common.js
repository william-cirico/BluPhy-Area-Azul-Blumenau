import { Alert, Platform } from 'react-native'
// http://10.0.2.2:8000
const server = Platform.OS === 'ios' ?
    'http://localhost:3000' : 'http://localhost:3333';

const showErrorMessage = e => {
    if (e.response && e.response.data && e.response.data.detail)
        Alert.alert('Erro', `${e.response.data.detail}`);
    else {
        console.log(e);
    }
}

export {server, showErrorMessage};