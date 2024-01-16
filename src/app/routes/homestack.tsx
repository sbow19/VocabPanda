/* eslint-disable */

import * as types from '@customTypes/types.d'

import React, {useState} from 'react';
import {
    Dimensions,
    View
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import HomeTab from '@screens/home/hometab_stack/homebottomtab'
import VocabSearch from '@screens/home/vocab_search';
import TranslateVocab from '@screens/home/translate';

import { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import CoreStyles from '@styles/core_styles';

import TabSwipeStatus from '@context/swipe_toggle';


const HomeStackNav = createMaterialTopTabNavigator();

const HomeStack: React.FC = props=>{

    const [swipeStatus, setSwipeStatus] = useState(true);   

    return (

        <TabSwipeStatus.Provider value={setSwipeStatus}>
                <HomeStackNav.Navigator 
                    initialRouteName="game" 
                    initialLayout={{width: Dimensions.get('window').width}} 
                    screenOptions={{...DefaultTabStyles, swipeEnabled:swipeStatus}}
                >
                    <HomeStackNav.Screen name="play" component={HomeTab}/>
                    <HomeStackNav.Screen name="vocab search" component={VocabSearch}/>
                    <HomeStackNav.Screen name="translate" component={TranslateVocab}/>
                </HomeStackNav.Navigator>
        </TabSwipeStatus.Provider>
    )
}

const DefaultTabStyles: MaterialTopTabNavigationOptions = {
    tabBarGap: 5,
    tabBarBounces: true,
    tabBarStyle: CoreStyles.homeTabNavBarStyles.homeTabBarStyle,
    tabBarLabelStyle: CoreStyles.homeTabNavBarStyles.homeTabBarLabelStyle,
    tabBarIndicatorStyle: CoreStyles.homeTabNavBarStyles.homeTabBarIndicatorStyle,
    tabBarItemStyle: CoreStyles.homeTabNavBarStyles.homeTabBarItemStyle,
};

export default HomeStack;