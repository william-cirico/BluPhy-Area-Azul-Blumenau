import React from 'react';

import { ActivityIndicator, View } from 'react-native';

import commonStyles from '../theme/commonStyles';


export default () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color={commonStyles.colors.mainColor} />
    </View>
);