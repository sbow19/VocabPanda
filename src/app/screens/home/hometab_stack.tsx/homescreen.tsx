/* eslint-disable */

import React from 'react';
import {
    View,
} from 'react-native';

import CoreStyles from '../../../shared_styles/core_styles';
import PlayButton from '../../../shared/playButton';

const HomeScreen = props=>{

    const navDestination = {
        screen: "game",
        screenParams: {
            screen: "MyModal"
        }
    }

return (
    <View style={[CoreStyles.defaultScreen, {justifyContent: "center", alignItems:"center"}]}>
        <PlayButton {...props} dest={navDestination}/>
    </View>
)
}

export default HomeScreen;