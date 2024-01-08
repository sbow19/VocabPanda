/* eslint-disable */

import React from 'react';
import {
    Dimensions,
    View
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import HomeTab from './hometab_stack.tsx/hometab';
import VocabSearch from './vocab_search';
import AddVocab from './add_vocab';

import { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import CoreStyles from '../../shared_styles/core_styles';


const HomeStackNav = createMaterialTopTabNavigator();

const HomeStack: React.FC = ()=>{

    return (

        <View style={{ flex:1 }}>
            <HomeStackNav.Navigator initialRouteName="game" initialLayout={{width: Dimensions.get('window').width}} screenOptions={BasicTabStyles}>
                <HomeStackNav.Screen name="play game" component={HomeTab}/>
                <HomeStackNav.Screen name="vocab search" component={VocabSearch}/>
                <HomeStackNav.Screen name="add vocab" component={AddVocab}/>
            </HomeStackNav.Navigator>
        </View>
    )
}

const BasicTabStyles: MaterialTopTabNavigationOptions = {
    tabBarGap: 5,
    tabBarBounces: true,

    tabBarStyle: CoreStyles.homeTabBarStyle,
    tabBarLabelStyle: CoreStyles.homeTabBarLabelStyle,
    tabBarContentContainerStyle: CoreStyles.homeTabBarContentContainerStyle,
    tabBarIndicatorStyle: CoreStyles.homeTabBarIndicatorStyle,
    tabBarIndicatorContainerStyle: CoreStyles.homeTabBarIndicatorContainerStyle
}

export default HomeStack;