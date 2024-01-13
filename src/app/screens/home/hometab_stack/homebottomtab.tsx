/* eslint-disable */

import * as types from '@customTypes/types.d'

import React from 'react';
import HomeScreen from '@screens/home/hometab_stack/homescreen';
import GameSettings from '@screens/home/hometab_stack/game_settings';

import {BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {default as MaterialIcon} from 'react-native-vector-icons/MaterialIcons'
import {default as MaterialCommunityIcon} from 'react-native-vector-icons/MaterialCommunityIcons'
import appColours from '@styles/app_colours';
import windowDimensions from '@context/dimensions';


const BottomTab = createBottomTabNavigator();

const HomeTab = ()=>{

    return(
        <BottomTab.Navigator screenOptions= {bottomTabScreenOptions}>
            <BottomTab.Screen name="home screen" component={HomeScreen} options={bottomTabHomeScreenOptions}/>
            <BottomTab.Screen name="game settings" component={GameSettings} options={bottomTabGameSettingsScreenOptions}/>
        </BottomTab.Navigator>

    )
};

const bottomTabScreenOptions:BottomTabNavigationOptions = {

    headerShown: false,
    tabBarStyle:{
        height: (windowDimensions.HEIGHT*0.078),
        margin: 10,
        borderRadius: 30,
        elevation:5,
        backgroundColor: appColours.white,
        borderColor: appColours.black,
        borderWidth: 1,
        marginBottom: 10



    },
    tabBarActiveTintColor: appColours.black,
    tabBarActiveBackgroundColor: "rgba(217, 254, 217, 1)"

}

const bottomTabHomeScreenOptions:BottomTabNavigationOptions = {

    title: "Play",
    tabBarIcon: ({focused})=>{

        const iconName = !focused ? "play-circle-outline" : "play-circle"
        const color = !focused ? appColours.black: appColours.darkGreen

        return(
            <MaterialIcon name={iconName} size={32} color={color}/>
        )
    },
    tabBarLabelStyle: {
        fontFamily: "Exo2-Medium",
        fontSize: 14
    },
    tabBarItemStyle: {
        margin: 2,
        borderBottomLeftRadius: 30,
        borderTopLeftRadius: 30,
        height: 50
    },

}

const bottomTabGameSettingsScreenOptions:BottomTabNavigationOptions = {

    title: "Game Settings",
    tabBarIcon: ({focused})=>{

        const iconName = !focused ? "cog-play-outline" : "cog-play"
        const color = !focused ? appColours.black: appColours.darkGreen

        return(
            <MaterialCommunityIcon name={iconName} size={32} color={color}/>
        )
    },
    tabBarLabelStyle: {
        fontFamily: "Exo2-Medium",
        fontSize:14
    },
    tabBarItemStyle: {
        margin: 2,
        borderBottomRightRadius: 30,
        borderTopRightRadius: 30,
        height: 50
    },
}


export default HomeTab;