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
import AddVocab from '@screens/home/add_vocab';

import { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import CoreStyles from '@styles/core_styles';

import TabSwipeStatus from '@context/swipe_toggle';


const HomeStackNav = createMaterialTopTabNavigator();

const HomeStack: React.FC = props=>{

    const [swipeStatus, setSwipeStatus] = useState(true);   

    return (

        <TabSwipeStatus.Provider value={setSwipeStatus}>
            <View style={{ flex:1 }}>
                <HomeStackNav.Navigator 
                    initialRouteName="game" 
                    initialLayout={{width: Dimensions.get('window').width}} 
                    screenOptions={{...DefaultTabStyles, swipeEnabled:swipeStatus}}
                >
                    <HomeStackNav.Screen name="play" component={HomeTab}/>
                    <HomeStackNav.Screen name="vocab search" component={VocabSearch}/>
                    <HomeStackNav.Screen name="add vocab" component={AddVocab}/>
                </HomeStackNav.Navigator>
            </View>
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