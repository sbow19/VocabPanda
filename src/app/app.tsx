/* eslint-disable */


import React, { useEffect } from 'react';
import { CurrentRenderContext, NavigationContainer} from '@react-navigation/native'
import AppMainDrawer from '@routes/drawer';
import GameStack from './game/gamestack';
import SearchResults from '@screens/home/hometab_stack/search_results/search_results';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoggedInStatus from './context/loggedIn';
import LoadingStatus from './context/loading';
import LastActivity, {lastActivityObject} from './context/last_activity';
import CurrentUserContext from './context/current_user';

import LoadingScreen from '@screens/login/loading_screen';
import LoginStack from 'app/routes/login_stack';

import FlashMessage from 'react-native-flash-message';
import CoreStyles from './shared_styles/core_styles';

import GameSettings from './storage/game_settings_storage';
import DefaultGameSettingsContext from './context/default_game_settings_context';
import AppLoginDetails from './storage/user_profile_details';


const MainAppContainer = createNativeStackNavigator()


const VocabPandaApp: React.FC = props => { 

    /* loading screen --> sign in screen or main app */

    const [isLoggedIn, setIsLoggedIn] = React.useContext(LoggedInStatus);

    const [isLoading, setIsLoading] = React.useContext(LoadingStatus);

    const [lastActivityData, setLastActivityData] = React.useState(lastActivityObject)

    const lastActivitySet = [lastActivityData, setLastActivityData]

    /* Current user state */

    const [currentUser, setCurrentUser] = React.useState("")

    const currentUserSet = [currentUser, setCurrentUser] 

    const myRef = React.useRef("mine")

    React.useEffect(()=>{

        const onStartUpLoad = async()=>{

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
    
                /* Sets object defining login details */
                await AppLoginDetails.setInitial()

    
                setIsLoading(false);
            }

            
        }

        onStartUpLoad()
        
    }, [isLoggedIn])



    
    return(
    
        <CurrentUserContext.Provider value={currentUserSet}>
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
            <FlashMessage 
                    position="center"
                    ref={myRef}
                    animationDuration={100}
                    duration={1000}
                    titleStyle={CoreStyles.contentText}
                />
        </LastActivity.Provider>
        </CurrentUserContext.Provider>
    )

}

const MainApp: React.FC = props=>{

    /* Code for handling default game settings globally */

    const [gameSettings, setGameSettings] = React.useState({})

    const myDefaultGameSettings = [gameSettings, setGameSettingsHandler]

    const [currentUser, setCurrentUser] = React.useContext(CurrentUserContext)

    
    function setGameSettingsHandler(timerOn: boolean|null, noOfTurns: number|null, setsDefault: boolean|null){

    
        if(timerOn == true || timerOn == false){
            gameSettings.timerOn = timerOn
        }

        if(typeof(noOfTurns)==="number"){
            gameSettings.noOfTurns = noOfTurns
        }

        if(setsDefault==true){
            GameSettings.setDefaultSettings(gameSettings, currentUser)
        }

        setGameSettings(gameSettings)

    }
 

    React.useEffect(()=>{

        const gameSettingsLoad = async ()=>{

            /* Check whether */
            let result = await GameSettings.newSettings(currentUser)

            const gameSettings = await GameSettings.getDefaultSettings(currentUser)
            setGameSettings(gameSettings)

        }
        
        gameSettingsLoad()

    }, [currentUser])


    return(<>

            
            <DefaultGameSettingsContext.Provider value={myDefaultGameSettings}>
                <MainAppContainer.Navigator screenOptions={{headerShown:false}}>
                    <MainAppContainer.Screen name="main" component={AppMainDrawer}/>
                    <MainAppContainer.Screen name="game" component={GameStack} options={{presentation: "modal"}}/>
                    <MainAppContainer.Screen name="results" component={SearchResults}  options={{presentation: "modal"}}/>
                </MainAppContainer.Navigator>
            </DefaultGameSettingsContext.Provider>
            

            </>
           
    )
}


export default VocabPandaApp