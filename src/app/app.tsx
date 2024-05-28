/* eslint-disable */

import * as types from '@customTypes/types.d'
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import AppMainDrawer from '@routes/drawer';
import GameStack from './game/gamestack';
import SearchResults from '@screens/home/hometab_stack/search_results/search_results';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoggedInStatus from './context/loggedIn';
import LoadingStatusInitial from './context/loadingInitial';
import LastActivity from './context/last_activity';
import CurrentUserContext from './context/current_user';

import LoadingScreen from '@screens/login/loading_screen';
import LoginStack from 'app/routes/login_stack';

import FlashMessage, { showMessage } from 'react-native-flash-message';
import CoreStyles from './shared_styles/core_styles';

import DefaultAppSettingsContext from './context/default_app_settings_context';

import LocalDatabase from './database/local_database';
import BackendAPI from 'app/api/backend';
import UserDetails from './database/user_profile_details';

import InternetStatus from './context/internet';
import NetInfo from "@react-native-community/netinfo";
import LoadingStatusInGame from './context/loadingInGame';
import ActivityIndicatorStatus from './context/activity_indicator_context';
import windowDimensions from './context/dimensions';
import BufferFlushingContext from './context/buffer_flushing';
import BufferManager from './api/buffer';
import axios from 'axios';


const MainAppContainer = createNativeStackNavigator()


const VocabPandaApp: React.FC = () => { 

    /* loading screen --> sign in screen or main app */

    const [isLoggedIn,] = React.useContext(LoggedInStatus);

    const [isLoadingInitial, setIsLoadingInitial] = React.useContext(LoadingStatusInitial);

    /* Internet Status */

    const [isOnline, setIsOnline] = React.useState();

    const isOnlineSet = [isOnline, setIsOnline];

    /* Current user state */

    const [currentUser, setCurrentUser] = React.useState("")

    const currentUserSet = [currentUser, setCurrentUser];

    /* Buffer flush state */

    const [bufferFlushState, setBufferFlushingState] = React.useContext(BufferFlushingContext);

    //Get in game activity indicator

    const [activityIndicator, setActivityIndicator] = React.useContext(ActivityIndicatorStatus);
    

    React.useEffect(()=>{

        const onStartUpLoad = async()=>{

            if(isLoadingInitial){
                try{

                    /* FOR DEVELOPMENT: reset local database code here to prompt user*/

                    await LocalDatabase.resetDatabase();

                    /*
                        Configures local database on the first load 
                    */

                    await BufferManager.createBufferStorage();

                    //Create new database schema / check whether db is accessible

                    await LocalDatabase.createDatabaseSchema();

                    //Set global headers in database

                    await BackendAPI.setGlobalHeaders(bufferFlushState);

                    /* Set API key in local storage / request new API key on first startup*/
                    await LocalDatabase.setAPIKey();

                    /*
                        Check for internet connection
                    */
                    
                    const isUserOnline = await NetInfo.fetch();

                    setIsOnline(isUserOnline.isInternetReachable);

                   
            
                    //If all loading actions completed successfully, then no issues.
                    setIsLoadingInitial(false);


                }catch(err){

                    //Error while loading application
                    console.log(err);

                    //Show error depending on type of error which occured.
                    showMessage({
                        type: "warning",
                        message: "Error while loading"
                    })
            
                }
            }
        }
        onStartUpLoad()
        
    }, [isLoggedIn]);

    React.useEffect(()=>{

        axios.defaults.bufferStatus = bufferFlushState;

    }, [bufferFlushState])

    
    return(

        <InternetStatus.Provider value={isOnlineSet}>
        <CurrentUserContext.Provider value={currentUserSet}>
            <NavigationContainer>
                {(()=>{
                    if(isLoadingInitial){

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
                    animationDuration={100}
                    duration={1000}
                    titleStyle={CoreStyles.contentText}
                    style={
                        {
                            zIndex: 99
                        }
                    }
                />
            {activityIndicator ? <ActivityIndicator size={"large"} style={{
                position: "absolute",
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                height: windowDimensions.HEIGHT + 50,
                width: windowDimensions.WIDTH

            }}/> : null}
        </CurrentUserContext.Provider>
        </InternetStatus.Provider>

        
    )

}

const MainApp: React.FC = ()=>{
    
    /* Setting current user */

    const [currentUser,] = React.useContext(CurrentUserContext);

    /* Getting last activity data on sign in */

    const [lastActivityObject, setLastActivityData] = React.useState({});

    //Get in game loading handler

    const [isLoadingInGame, setIsLoadingInGame] = React.useContext(LoadingStatusInGame);

    //Get in game activity indicator

    const [activityIndicator, setActivityIndicator] = React.useContext(ActivityIndicatorStatus);

    /* Code for handling default game settings globally  */

    const [appSettings, setAppSettings] = React.useState<types.AppSettingsObject>({});

    /* Get buffer flushing context */

    const [bufferFlushState, setBufferFlushingState] = React.useContext(BufferFlushingContext);

    /*is user online status */

    const [isOnline, setIsOnline] = React.useContext(InternetStatus);

    const sendSettingsInfoTimeout = React.useRef("");

    const sendUserSettings = ()=>{

        clearTimeout(sendSettingsInfoTimeout.current);

        sendSettingsInfoTimeout.current = setTimeout(async()=>{

            try{

                //Get user id 
                const userId = await LocalDatabase.getUserId(currentUser);

                //Get user settings
                const userSettingsRaw = await UserDetails.getUserSettings(userId);

                //Get user settings object
                const userSettings = UserDetails.convertUserSettingsObject(userSettingsRaw);

                //
                BackendAPI.sendSettingsInfo(userSettings)
                .then((settingsAPIResponse)=>{
                    console.log(settingsAPIResponse);
                })
                .catch((settingsAPIResponse)=>{
                    console.log(settingsAPIResponse);
                })

            }catch(e){

                console.log(e, "Some error setting timeout");

            }
            

        }, 5000)

    }
    
    const setAppSettingsHandler = async(value, valueType: string) =>{
        

        console.log(value, valueType)

        const newSettings = { ...appSettings}

        //User settings fields 
        if(valueType === "timerOn"){

            clearTimeout(sendSettingsInfoTimeout.current);

            //Update database
            UserDetails.updateTimerValue(currentUser, value)
            .then(()=>{

                console.log("Timer val update successfully.");
                //send to backend
                sendUserSettings();
            })
            .catch((e)=>{

                console.log(e);
                showMessage({
                    message: "Unable to update timer value.",
                    type: "warning"
                })
            });

            //Update app settings

            newSettings.userSettings.timerOn = value;
        };

        if(valueType === "noOfTurns"){

            clearTimeout(sendSettingsInfoTimeout.current);

            //Update database
            UserDetails.updateTurnsValue(currentUser, value)
            .then(()=>{

                //send to backend
                sendUserSettings();

            })
            .catch((e)=>{

                console.log(e);
                showMessage({
                    message: "Unable to update no of turns value.",
                    type: "warning"
                })
            })

            //UPdate app settings

            newSettings.userSettings.noOfTurns = value;
        };

        if(valueType === "defaultProject"){
            //TODO This is more relevant from the Chrome Extension
        };

        if(valueType === "defaultTargetLang"){

            clearTimeout(sendSettingsInfoTimeout.current);

            //Update database
            UserDetails.updateTargetLangDefault(currentUser, value)
            .then(()=>{

                //send to backend
                sendUserSettings();
                
            })
            .catch((e)=>{

                console.log(e);
                showMessage({
                    message: "Unable to update default target language.",
                    type: "warning"
                })
            })


            //Update app settings
            newSettings.userSettings.targetLanguage = value;
        };

        if(valueType === "defaultOutputLang"){

            clearTimeout(sendSettingsInfoTimeout.current);

            //update database
            UserDetails.updateOutputLangDefault(currentUser, value)
            .then(()=>{

                //send to backend
                sendUserSettings();
                
            })
            .catch((e)=>{

                console.log(e);
                showMessage({
                    message: "Unable to update default output language.",
                    type: "warning"
                })
            })


            //Update app settings
            newSettings.userSettings.outputLanguage = value; 
        };

        //User content fields
        if(valueType === "addProject"){

            //Project object is pushed into array of projects
            newSettings.projects.push(value);
        };

        if(valueType === "deleteProject"){

            //FIlter out deleted project from dropdowns.

            const newList = newSettings.projects.filter(item => item.projectName !== value);

            newSettings.projects = newList
        };


        //User game details fields
        if(valueType === "subtractTranslation"){

            try{

                await UserDetails.setTranslationsLeft(currentUser, value.translationsLeft);
                await UserDetails.setTranslationsRefreshTimeLeft(currentUser, value.translationsRefreshTime);

            }catch(e){

                console.log(e);

            }

            //Update app settings - NOTE translations left and refresh are handled in the backend when translation call is made. 
            newSettings.translationsLeft = value.translationsLeft;
            
            newSettings.translationsRefreshTime = value.translationsRefreshTime;
        };

        if(valueType === "subtractPlay"){

            try{
                const playsLeft = value - 1;

                await UserDetails.setPlaysLeft(currentUser, playsLeft);
                const playsRefreshTime = await UserDetails.setPlaysRefreshTimeLeft(currentUser);


                //Update app settings
                newSettings.playsLeft = playsLeft; 

                newSettings.playsRefreshTime = playsRefreshTime;

                //Send info to backend

                const userId = await LocalDatabase.getUserId(currentUser);

                BackendAPI.updatePlaysLeft(userId, playsLeft, playsRefreshTime);

            }catch(e){

                console.log(e);

            }
            
        };

        setAppSettings(newSettings)
    };

    const myDefaultAppSettings:types.StateHandlerList<types.AppSettingsObject, Function> = [appSettings, setAppSettingsHandler];

    // Loads global variables such as datrabase objects and app settings once on sign in
    React.useEffect(()=>{

        if(isLoadingInGame && currentUser){
            //Set activity indicator while loading
            setActivityIndicator(true);

            const appSettingsLoad = async ()=>{

                /* 
                - if no connection, skip this step, and render an alert to inform user of lack of connection
                - if connection then either:
                  - Download entire content table, if none on local --> inform user that this is taking place on loading screen.
                  - Update local content table with changes if already  occured.
                  - Make sure that there are built in safeguards for: 
                    - too much data on local device
                    - dropping of internet connection mid-update

                /* Set axios current suer header*/

                const userId = await UserDetails.getUserId(currentUser);

                axios.defaults.userId = userId;
                

                /*
                    Set event listener for internet connection
                */

                NetInfo.addEventListener((state)=>{
                    setIsOnline(state.isInternetReachable);

                    if(state.isInternetReachable && !bufferFlushState){

                        setBufferFlushingState(true); //Set buffer flushing status
                        
                        BufferManager.flushRequests(userId)
                        .then((bufferFlushResponse)=>{

                            //Once flushing has complete, then we set buffer flushing status to false
                            setBufferFlushingState(false);
                        })
                        .catch((bufferFlushError)=>{

                            console.log("Buffer flushing error app module")
                            setBufferFlushingState(false);

                            //Handle buffer flush error. 
                        })
                    }
                });

                

                /* Check for premium update */

                const upgradeToPremium = false  //REPLACE WITH SCRIPT WHICH LOOKS FOR UPGRADE INDICATOR __ BACKEND?

                if(upgradeToPremium){
                    await UserDetails.upgradeToPremium(currentUser, "15/02/2024")
                }

                /* Check for downgrade */

                const downgradeToFree = false  //REPLACE WITH SCRIPT WHICH LOOKS FOR UPGRADE INDICATOR __ BACKEND?

                if(downgradeToFree){
                    await UserDetails.downgradeToFree(currentUser)
                }


                //Fetch app settings
                
                const appSettings: types.AppSettingsObject = await UserDetails.getDefaultAppSettings(currentUser)// Fetch default app settings for user
            
                setAppSettings(appSettings);

                
                /* Last activity determiner */

                const lastActivityResultArray = await UserDetails.getLastActivity(currentUser);

                /* Setting last activity object */

                const lastActivityObject = {

                    lastActivity: false,
                    lastActivityResultArray: lastActivityResultArray
                    
                };

                if(lastActivityResultArray.length > 0){
                    lastActivityObject.lastActivity = true
                }

                setLastActivityData(lastActivityObject);

                //Update user login time, occurs after every other operation is successful.

                await UserDetails.updateUserLoginTime(currentUser);

                //Set is loading to false brings up login screen.

                setIsLoadingInGame(false);
                setActivityIndicator(false);
            }
            appSettingsLoad()    
        }

    }, [currentUser])


    const gamesLeftInterval = React.useRef("");
    const translationsLeftInterval = React.useRef("");
    const flushBufferInterval = React.useRef("");

    /* Interval timer to check countdowns for refreshes across the app -- TODO REFACTOR OUT*/
    React.useEffect(()=>{

        console.log("Hello world, use effect")

        const setCronJobs = async ()=>{

            clearInterval(gamesLeftInterval.current);
            clearInterval(translationsLeftInterval.current);
            clearInterval(flushBufferInterval.current);

            const userId: string = await LocalDatabase.getUserId(currentUser);
            
            /* Checking plays refresh */

            const premium = await UserDetails.checkPremiumStatus(currentUser);

            if(premium){

                console.log("User is premium, no plays refresh necessary");

            } else if (!premium){

                gamesLeftInterval.current = setInterval(async()=>{

                    //Check every 100 seconds whether the current time is greater than the refresh time indicated in the plays refresh table

                    const playsRefreshTimeLeft = await UserDetails.getPlaysRefreshTimeLeft(userId);

                    const currentTime = new Date();
                    const refreshTime = new Date(playsRefreshTimeLeft["games_refresh"]);
                    
                    if(currentTime > refreshTime && playsRefreshTimeLeft !== null){

                        await UserDetails.refreshGamesLeft(userId);

                        const newAppSettings = {...appSettings}

                        newAppSettings.playsLeft = 10;

                        setAppSettings(newAppSettings)
                    }     
                }, 50000);
            };
                

            /* Checking translations */
            translationsLeftInterval.current = setInterval(async()=>{

                //Check every 100 seconds whether the current time is greater than the refresh time indicated in the translations refresh table;

                const refreshTimeRaw = await UserDetails.getTranslationsRefreshTimeLeft(userId);

                let currentTime = new Date();
                let refreshTime = new Date(refreshTimeRaw["translations_refresh"]);

                if(currentTime > refreshTime && premium && refreshTimeRaw !== null){
                    
                    await UserDetails.refreshTranslationsLeftPremium(userId);

                    const newAppSettings = {...appSettings};

                    newAppSettings.translationsLeft = 250;

                    setAppSettings(newAppSettings)

                } else if (currentTime > refreshTime && !premium && refreshTimeRaw !== null){

                    await UserDetails.refreshTranslationsLeftFree(userId);

                    const newAppSettings = {...appSettings}

                    newAppSettings.translationsLeft = 100;

                    setAppSettings(newAppSettings)
                };
            }, 50000);

            /* Flush buffer */
            flushBufferInterval.current = setInterval(async()=>{

                console.log("Flush interval triggered", bufferFlushState)

                //Check every 180 seconds whether the current time is greater than the refresh time indicated in the translations refresh table;

                const isUserOnline = await NetInfo.fetch();

                //If the internet is on but the buffer is not currently being flushed, then trigger flush.
                if(isUserOnline.isInternetReachable && !bufferFlushState){

                    try{
                        await BufferManager.flushRequests(userId);
                    }catch(e){
                        //Some error with flushing requests
                    }
                    
                }
                
            }, 180000);
        };

        setCronJobs();

    }, [currentUser])

    return(
        <> 
    
            {isLoadingInGame === true ? (<LoadingScreen/>) :( 

            <>
            <LastActivity.Provider value={lastActivityObject}>
            <DefaultAppSettingsContext.Provider value={myDefaultAppSettings}>
                <MainAppContainer.Navigator screenOptions={{headerShown:false}}>
                    <MainAppContainer.Screen name="main" component={AppMainDrawer}/>
                    <MainAppContainer.Screen name="game" component={GameStack} options={{presentation: "modal"}}/>
                    <MainAppContainer.Screen name="results" component={SearchResults}  options={{presentation: "modal"}}/>
                </MainAppContainer.Navigator>
            </DefaultAppSettingsContext.Provider>
            </LastActivity.Provider>
            
            </>)}

            
        </>
           
    )
}


export default VocabPandaApp