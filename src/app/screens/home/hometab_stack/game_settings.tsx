/* eslint-disable */

import * as types from '@customTypes/types.d'

import React from 'react';
import {
    View,
    ViewStyle
} from 'react-native';
import CoreStyles from '@styles/core_styles';
import AppSwitch from '@shared/switch';
import AppSlider from '@shared/slider';

const GameSettings: React.FC = ({navigation})=>{

return (
    <View style={[CoreStyles.defaultScreen, additionalStyles]}>
        <AppSwitch/>
        <AppSlider/>
        
    </View>
)
}

const additionalStyles: ViewStyle = {
    justifyContent: "center",
    alignItems: "center"
}

export default GameSettings;