import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';

import commonStyles from '../theme/commonStyles';
import Button from '../components/Button';
import Input from '../components/Input';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default props => {
    return (
        <KeyboardAvoidingView style={styles.container}
        
            behavior='height'
        >
            <View style={{flex: 1, justifyContent: 'center', backgroundColor: '#e5e5e5', marginBottom: 50}}>    

                <Input 
                    style={{ Colors: '#1a73e9', borderLeftColor: '#1a73e9'}}
                    placeholder='Digite a placa'
                />
                <Button 
                    title='Consultar'                
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