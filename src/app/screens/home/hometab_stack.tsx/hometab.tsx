/* eslint-disable */

import React from 'react';
import {
    View
} from 'react-native';

import HomeScreen from './homescreen';
import GameSettings from './gamesettings';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const BottomTab = createBottomTabNavigator();

const HomeTab = ()=>{

    return(
        <BottomTab.Navigator screenOptions= {{headerShown:false}}>
            <BottomTab.Screen name="home screen" component={HomeScreen}/>
            <BottomTab.Screen name="game settings" component={GameSettings}/>
        </BottomTab.Navigator>

    )
}

export default HomeTab;