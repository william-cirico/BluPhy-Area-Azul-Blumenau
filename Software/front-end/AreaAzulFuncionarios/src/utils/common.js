import { Alert } from 'react-native';

const server = 'http://15.228.15.40:8080';
// const server = 'http://10.0.2.2:8000';

const showErrorMessage = e => {
    if (e.response && e.response.data && e.response.data.detail)
        Alert.alert('Erro', `${e.response.data.detail}`);
    else {
        console.log(e);
    }
}

export {server, showErrorMessage};