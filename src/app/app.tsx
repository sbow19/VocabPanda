/* eslint-disable */

import React, {useState} from 'react';
import { NavigationContainer} from '@react-navigation/native'
import AppMainDrawer from './routes/drawer';
import VocabPandaGame from './game/gamestack';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WindowDimensions from './context/context';
import { useWindowDimensions } from 'react-native';

const MainAppContainer = createNativeStackNavigator()


const VocabPandaApp: React.FC = () => { 

    const myDimensions = useWindowDimensions();

    return(
    <WindowDimensions.Provider value={myDimensions} >
        <NavigationContainer>
            <MainAppContainer.Navigator screenOptions={{headerShown:false}}>
                <MainAppContainer.Screen name="main" component={AppMainDrawer}/>
                <MainAppContainer.Screen name="game" component={VocabPandaGame}/>
            </MainAppContainer.Navigator>
        </NavigationContainer>
    </WindowDimensions.Provider>
    )

}

export default VocabPandaApp