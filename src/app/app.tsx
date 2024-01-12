/* eslint-disable */


import React from 'react';
import { NavigationContainer} from '@react-navigation/native'
import AppMainDrawer from '@routes/drawer';
import VocabPandaGame from '@game/gamestack';

import { createNativeStackNavigator } from '@react-navigation/native-stack';


const MainAppContainer = createNativeStackNavigator()


const VocabPandaApp: React.FC = props => { 
    
    return(

                <NavigationContainer>
                    <MainAppContainer.Navigator screenOptions={{headerShown:false}}>
                        <MainAppContainer.Screen name="main" component={AppMainDrawer}/>
                        <MainAppContainer.Screen name="game" component={VocabPandaGame}/>
                    </MainAppContainer.Navigator>
                </NavigationContainer>

    )

}

export default VocabPandaApp