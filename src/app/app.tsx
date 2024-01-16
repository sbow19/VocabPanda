/* eslint-disable */


import React, { useEffect } from 'react';
import { NavigationContainer} from '@react-navigation/native'
import AppMainDrawer from '@routes/drawer';
import GameStack from './game/gamestack';
import SearchResults from '@screens/home/hometab_stack/search_results/search_results';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoggedInStatus from './context/loggedIn';
import LoadingStatus from './context/loading';
import LastActivity, {lastActivityObject} from './context/last_activity';

import LoadingScreen from '@screens/login/loading_screen';
import LoginStack from 'app/routes/login_stack';

import FlashMessage from 'react-native-flash-message';
import CoreStyles from './shared_styles/core_styles';


const MainAppContainer = createNativeStackNavigator()


const VocabPandaApp: React.FC = props => { 

    /* Splash Screen --> loading screen --> sign in screen or main app */

    const [isLoggedIn, setIsLoggedIn] = React.useContext(LoggedInStatus);

    const [isLoading, setIsLoading] = React.useContext(LoadingStatus);

    const [lastActivityData, setLastActivityData] = React.useState(lastActivityObject)

    const lastActivitySet = [lastActivityData, setLastActivityData]

    

    React.useEffect(()=>{

        if(isLoading){

            /* Async function to fetch last activity data */

            /* async function to link up to account database if possible
            - if no connection, skip this step, and render an alert to inform user of lack of connection
            - if connection then either:
              - Download entire content table, if none on local --> inform user that this is taking place on loading screen.
              - Update local content table with changes if already  occured.
              - Make sure that there are built in safeguards for: 
                - too much data on local device
                - dropping of internet connection mid-update
            
            */
            
            /* Replace timeout with login check function */
            
            setTimeout(()=>{

                setIsLoading(false);
                setLastActivityData({
                    lastActivity: true,
                    lastActivityData: {
                        projects: [],
                        noOfAdditions: []
                    }
                })

            }, 10000)
        }
    })
    
    return(
    
    
        <LastActivity.Provider value={lastActivitySet}>
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
        </LastActivity.Provider>


    )

}

const MainApp: React.FC = props=>{

    const myRef = React.useRef("mine")

    return(<>

                <MainAppContainer.Navigator screenOptions={{headerShown:false}}>
                    <MainAppContainer.Screen name="main" component={AppMainDrawer}/>
                    <MainAppContainer.Screen name="game" component={GameStack} options={{presentation: "modal"}}/>
                    <MainAppContainer.Screen name="results" component={SearchResults}  options={{presentation: "modal"}}/>
                </MainAppContainer.Navigator>

                <FlashMessage 
                    position="center"
                    ref={myRef}
                    animationDuration={100}
                    duration={900}
                    titleStyle={CoreStyles.contentText}
                />

            </>
           
    )
}


export default VocabPandaApp