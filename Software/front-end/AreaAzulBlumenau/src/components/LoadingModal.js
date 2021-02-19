import React from 'react';

import { ActivityIndicator, Modal, View, StyleSheet } from 'react-native';

import commonStyles from '../theme/commonStyles';


export default ({isVisible}) => (
    <Modal
        animationType='none'
        transparent={true}
        visible={isVisible}
    >
        <View style={styles.container}>
            <ActivityIndicator size='large' color={commonStyles.colors.mainColor} />
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    }
});