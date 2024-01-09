/* eslint-disable */

import React, {useState} from 'react';
import {
    Dimensions,
    View
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import HomeTab from './hometab_stack.tsx/homebottomtab';
import VocabSearch from './vocab_search';
import AddVocab from './add_vocab';

import { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import CoreStyles from '../../shared_styles/core_styles';

import TabSwipeStatus from '../../context/swipe_toggle';


const HomeStackNav = createMaterialTopTabNavigator();

const HomeStack: React.FC = props=>{

    const [swipeStatus, setSwipeStatus] = useState(true);

   

    return (

        <TabSwipeStatus.Provider value={setSwipeStatus}>
            <View style={{ flex:1 }}>
                <HomeStackNav.Navigator 
                    initialRouteName="game" 
                    initialLayout={{width: Dimensions.get('window').width}} 
                    screenOptions={{...BasicTabStyles, swipeEnabled:swipeStatus}}
                >
                    <HomeStackNav.Screen name="play" component={HomeTab}/>
                    <HomeStackNav.Screen name="vocab search" component={VocabSearch}/>
                    <HomeStackNav.Screen name="add vocab" component={AddVocab}/>
                </HomeStackNav.Navigator>
            </View>
        </TabSwipeStatus.Provider>
    )
}

const BasicTabStyles: MaterialTopTabNavigationOptions = {
    tabBarGap: 5,
    tabBarBounces: true,
    tabBarStyle: CoreStyles.homeTabBarStyle,
    tabBarLabelStyle: CoreStyles.homeTabBarLabelStyle,
    tabBarContentContainerStyle: CoreStyles.homeTabBarContentContainerStyle,
    tabBarIndicatorStyle: CoreStyles.homeTabBarIndicatorStyle,
    tabBarIndicatorContainerStyle: CoreStyles.homeTabBarIndicatorContainerStyle,
};

export default HomeStack;