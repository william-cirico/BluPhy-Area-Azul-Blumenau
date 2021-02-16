import React, { useContext, useReducer } from 'react';
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity, View } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios';

import Button from '../components/Button';
import Input from '../components/Input';
import { AuthContext } from '../contexts/AuthContext';
import { licensePlateRegex } from '../utils/regExp';
import commonStyles from '../theme/commonStyles';
import { server, showErrorMessage } from '../utils/common';

export default ({ navigation }) => {
    const { authContext } = useContext(AuthContext);

    const reducer = (prevState, action) => {
        switch(action.type) {
            case 'LICENSE_PLATE':                
                if (licensePlateRegex.test(action.licensePlate)) {                    
                    return {
                        ...prevState,
                        licensePlate: action.licensePlate,
                        isLicensePlateValid: true,
                    }
                } else {
                    return {
                        ...prevState,
                        licensePlate: action.licensePlate,
                        isLicensePlateValid: false,
                    }
                }
        }
    }

    const initialState = {
        licensePlate: '',
        isLicensePlateValid: false,        
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const licensePlateConsult = async () => {
        try {
            res = await axios(`${server}/vehicles/${state.licensePlate}`);
            const { license_plate, model, vehicle_type, end_time } = res.data;
            navigation.navigate('VehicleInformationScreen', {license_plate, model, vehicle_type, end_time})
        } catch(e) {
            showErrorMessage(e);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}                
        >
            <TouchableOpacity 
                style={{alignSelf: 'flex-end'}}
                onPress={authContext.signOut}
            >
                <Icon 
                    size={30}
                    name='times'
                    color={commonStyles.colors.mainColor}
                />
            </TouchableOpacity>
            <View style={{flex: 1, justifyContent: 'center'}}>                    
                <Input 
                    isValid={state.isLicensePlateValid}
                    style={{ colors: '#1a73e9', borderLeftColor: '#1a73e9'}}
                    autoCapitalize='characters'
                    placeholder='Digite a placa'
                    onChangeText={text => dispatch({ 
                        type: 'LICENSE_PLATE', 
                        licensePlate: text.toUpperCase(),
                    })}                    
                />
                <Button 
                    title='Consultar'                    
                    validForm={state.isLicensePlateValid} 
                    disabled={!state.isLicensePlateValid}   
                    onPress={licensePlateConsult}            
                />
            </View>   
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30, 
        backgroundColor: '#e5e5e5',       
    },
});