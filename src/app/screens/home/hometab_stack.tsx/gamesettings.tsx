/* eslint-disable */

import React from 'react';
import {
    View,
    Button
} from 'react-native';

const GameSettings = ({navigation})=>{

return (
    <View>
        <Button title="Play" onPress={()=>{navigation.navigate('game', {screen: "MyModal"})
    console.log("hello")}}>

        </Button>
        
    </View>
)
}

export default GameSettings;