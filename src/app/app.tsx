/* eslint-disable */


import React, { useEffect } from 'react';
import { NavigationContainer} from '@react-navigation/native'
import AppMainDrawer from '@routes/drawer';
import VocabPandaGame from '@game/gamestack';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoggedInStatus from './context/loggedIn';
import LoadingStatus from './context/loading';

import LoadingScreen from '@screens/login/loading_screen';
import LoginStack from '@screens/login/login_stack';
import { 
    StatusBar 
} from 'react-native';


const MainAppContainer = createNativeStackNavigator()


const VocabPandaApp: React.FC = props => { 

    /* Splash Screen --> loading screen --> sign in screen or main app */

    const [isLoggedIn, setIsLoggedIn] = React.useContext(LoggedInStatus)

    const [isLoading, setIsLoading] = React.useContext(LoadingStatus)

    React.useEffect(()=>{

        if(isLoading){
            
            /* Replace timeout with login check function */
            
            setTimeout(()=>{

                setIsLoading(false);

            }, 10000)
        }
    })
    
    return(
    
    
        <NavigationContainer>
            {(()=>{
                if(isLoading){
                    return <LoadingScreen/>

                    
                } else if(!isLoggedIn){

                    return <LoginStack/>

                } else if (isLoggedIn){

                    return <MainApp/>
                }

            })()}
         </NavigationContainer>


    )

}

const MainApp: React.FC = props=>{

    return(

                <MainAppContainer.Navigator screenOptions={{headerShown:false}}>
                    <MainAppContainer.Screen name="main" component={AppMainDrawer}/>
                    <MainAppContainer.Screen name="game" component={VocabPandaGame}/>
                </MainAppContainer.Navigator>
           
    )
}


export default VocabPandaApp