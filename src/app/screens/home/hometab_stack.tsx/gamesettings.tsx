/* eslint-disable */

import React from 'react';
import {
    View,
} from 'react-native';
import { appColours } from '../../../shared_styles/core_styles';
import CoreStyles from '../../../shared_styles/core_styles';
import AppSwitch from '../../../shared/switch';
import AppSlider from '../../../shared/slider';

const GameSettings = ({navigation})=>{

return (
    <View style={[CoreStyles.defaultScreen, additionalStyles]}>
        <AppSwitch/>
        <AppSlider/>
        
    </View>
)
}

const additionalStyles = {
    justifyContent: "center",
    alignItems: "center"
}

export default GameSettings;