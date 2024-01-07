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

const BasicTabStyles = {
    tabBarStyle:{
        height:50,
    },
    tabBarLabelStyle:{
        fontFamily: "Exo2-Black",
        color: "blue",
        padding:0,
        margin: 0

    },
    tabBarContentContainerStyle:{
        justifyContent: "flex-start",
        backgroundColor: "powderblue",
        padding: 0,
        margin: 0,
    },
    tabBarGap: 5,
    tabBarBounces: true,
    tabBarIndicatorStyle: {
        backgroundColor: "blue",
        borderRadius: 10
    },
    tabBarIndicatorContainerStyle: {
        backgroundColor: "powderblue",
        opacity:0.5
    }
}

export default HomeStack;