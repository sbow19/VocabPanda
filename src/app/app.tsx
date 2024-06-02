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
    const currentUserObject: types.CurrentUser = {
        username: "",
        userId:  ""
    
    }

    const [currentUser, setCurrentUser] = React.useState(currentUserObject)
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

                    /*
                        Check for internet connection
                    */
                    
                    const isUserOnline = await NetInfo.fetch();

                    setIsOnline(isUserOnline.isInternetReachable);

                
                    //If all startup loading actions completed successfully.
                    setIsLoadingInitial(false);


                }catch(err){

                    //Error thrown up but any of the promises here
                    console.log(err);

                    //Later on, we should handle these errors with more granularity --> TODO.

                    //Show error depending on type of error which occured.
                    showMessage({
                        type: "warning",
                        message: "Error while loading. Restart app."
                    })
            
                }
            }
        }
        //Trigger start up logic. TODO add other functions here on start up
        onStartUpLoad()
        
    }, [isLoggedIn]);

    React.useEffect(()=>{
        //When buffer flushing state change in the app, then axios default is changed here.

        axios.defaults.bufferStatus = bufferFlushState;
        console.log("Buffer flush state changed")

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
    const [currentUser] = React.useContext(CurrentUserContext);

    /* Getting last activity data on sign in */
    const [lastActivityObject, setLastActivityData] = React.useState<types.LastActivityObject>({});

    //Get in game loading handler
    const [isLoadingInGame, setIsLoadingInGame] = React.useContext(LoadingStatusInGame);

    //Get in game activity indicator
    const [, setActivityIndicator] = React.useContext(ActivityIndicatorStatus);

    /* Code for handling default game settings globally  */
    const [appSettings, setAppSettings] = React.useState<types.AppSettingsObject>({});

    /* Get buffer flushing context */
    const [bufferFlushState, setBufferFlushingState] = React.useContext(BufferFlushingContext);

    /*is user online status */
    const [isOnline, setIsOnline] = React.useContext(InternetStatus);

    const saveSettingsInfoTimeout = React.useRef<NodeJS.Timeout>("");

    const sendUserSettings = ()=>{

        clearTimeout(saveSettingsInfoTimeout.current); //Clear timeout if triggered before timeout function fired

        saveSettingsInfoTimeout.current = setTimeout(async()=>{

            try{
                //Get user settings
                const userSettings = await UserDetails.getUserSettings(currentUser.userId);

                //Save user settings in Buffer
                if(bufferFlushState){
                    //If main queue being flushed
                    await BufferManager.storeRequestSecondaryQueue(currentUser.userId, userSettings, "update");
                } else if (!bufferFlushState){
                    //If main queue available
                    await BufferManager.storeRequestMainQueue(currentUser.userId, userSettings, "update");
                }

            }catch(e){

                console.log(e, "Some error setting timeout");

            }
            

        }, 5000)

    }
    
    const setAppSettingsHandler = async(value, valueType: types.ValueTypes)=>{
        
        const newSettings = { ...appSettings}; //New object to trigger re render.

        //User settings fields 
        if(valueType === "timerOn"){

            clearTimeout(saveSettingsInfoTimeout.current);

            //Update database
            UserDetails.updateTimerValue(currentUser.userId, value)
            .then((resultObject: types.LocalOperationResponse)=>{

                console.log("Timer val update successfully.");
                //Trigger backend sync
                sendUserSettings();
            })
            .catch((e)=>{

                //Timer failed to update
                console.log(e);
                showMessage({
                    message: "Unable to update timer value.",
                    type: "warning"
                })
            });

            //Update app settings state
            newSettings.userSettings.gameTimerOn = value;
        };

        if(valueType === "noOfTurns"){

            clearTimeout(saveSettingsInfoTimeout.current);

            //Update database
            UserDetails.updateTurnsValue(currentUser.userId, value)
            .then((resultObject: types.LocalOperationResponse)=>{


                console.log("Turns val update successfully.");
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

            newSettings.userSettings.gameNoOfTurns = value;
        };

        if(valueType === "defaultProject"){
            //TODO This is more relevant from the Chrome Extension
        };

        if(valueType === "defaultTargetLang"){

            clearTimeout(saveSettingsInfoTimeout.current);

            //Update database
            UserDetails.updateTargetLangDefault(currentUser.userId, value)
            .then((resultObject: types.LocalOperationResponse)=>{

                console.log("Default target lang updated")
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
            newSettings.userSettings.defaultTargetLanguage = value;
        };

        if(valueType === "defaultOutputLang"){

            clearTimeout(saveSettingsInfoTimeout.current);

            //update database
            UserDetails.updateOutputLangDefault(currentUser.userId, value)
            .then((resultObject: types.LocalOperationResponse)=>{

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
            newSettings.userSettings.defaultOutputLanguage = value; 
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

            //NOTE, no need to send details to bqckend, as translation info is processed
            //In the backend anyway.

            try{

                await UserDetails.setTranslationsLeft(currentUser.userId, value.translationsLeft);

            }catch(e){
                console.log(e);
                showMessage({
                    message: "Unable to update translations left.",
                    type: "warning"
                })
            }
               
            try{
                await UserDetails.setTranslationsRefreshTimeLeft(currentUser.userId, value.translationsRefreshTime);

            }catch(e){

                console.log(e);
                showMessage({
                    message: "Unable to update translations refresh.",
                    type: "warning"
                })

            }

            //Update app settings - NOTE translations left and refresh are handled in the backend when translation call is made. 
            newSettings.translationsLeft = value.translationsLeft;
            
            newSettings.translationsRefreshTime = value.translationsRefreshTime;
        };

        if(valueType === "subtractPlay"){

            try{
                const playsLeft = value - 1;

                await UserDetails.setPlaysLeft(currentUser.userId, playsLeft);
                const {customResponse: playsRefreshTime} = await UserDetails.setPlaysRefreshTimeLeft(currentUser.userId);


                //Update app settings
                newSettings.playsLeft = playsLeft; 
                newSettings.playsRefreshTime = playsRefreshTime;

                const playsDetails: types.PlaysDetails = {
                    playsLeft: playsLeft,
                    playsRefreshTime: playsRefreshTime
                }

                //Store update in buffer for next refresh
                await BufferManager.storeRequestMainQueue(currentUser.userId, playsDetails, "plays");

            }catch(e){

                console.log(e);

            }
            
        };

        setAppSettings(newSettings)
    };

    const myDefaultAppSettings = [appSettings, setAppSettingsHandler];

    // Loads global variables such as datrabase objects and app settings once on sign in
    React.useEffect(()=>{

        if(isLoadingInGame && currentUser.username){
            //Set activity indicator while loading
            setActivityIndicator(true);

            const signInLoad = async ()=>{

                /* 
                - if no connection, skip this step, and render an alert to inform user of lack of connection
                - if connection then either:
                  - Download entire content table, if none on local --> inform user that this is taking place on loading screen.
                  - Update local content table with changes if already  occured.
                  - Make sure that there are built in safeguards for: 
                    - too much data on local device
                    - dropping of internet connection mid-update

                /* Set axios current suer header*/

                axios.defaults.userId = currentUser.userId;

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
                const appSettings: types.AppSettingsObject = await UserDetails.getDefaultAppSettings(currentUser.userId)// Fetch default app settings for user
            
                setAppSettings(appSettings);

                
                /* Last activity determiner */
                const lastActivityResultArray = await UserDetails.getLastActivity(currentUser.userId);

                /* Setting last activity object */
                const lastActivityObject = {
                    lastActivity: false,
                    lastActivityResultArray: lastActivityResultArray
                    
                };

                if(lastActivityResultArray.length > 0){
                    lastActivityObject.lastActivity = true
                }

                setLastActivityData(lastActivityObject);

                //Update user login time, occurs after every other operation is successful
                await UserDetails.updateUserLoginTime(currentUser);

                //Set is loading to false brings up login screen.
                setIsLoadingInGame(false);
                setActivityIndicator(false);
            }

            //Trigger loading events on sign in
            signInLoad();    
        }

    }, [currentUser])


    const gamesLeftInterval = React.useRef<NodeJS.Timeout>("");
    const translationsLeftInterval = React.useRef<NodeJS.Timeout>("");
    const flushBufferInterval = React.useRef<NodeJS.Timeout>("");

    /* Interval timer to check countdowns for refreshes across the app -- TODO REFACTOR OUT*/
    React.useEffect(()=>{
        
        const setCronJobs = async ()=>{

            clearInterval(gamesLeftInterval.current);
            clearInterval(translationsLeftInterval.current);
            clearInterval(flushBufferInterval.current);
            
            /* Checking plays refresh */
            const premium = await UserDetails.checkPremiumStatus(currentUser.userId);

            if(premium === 1){

                console.log("User is premium, no plays refresh necessary");

            } else if (premium === 0){

                gamesLeftInterval.current = setInterval(async()=>{

                    //Check every 100 seconds whether the current time is greater than the refresh time indicated in the plays refresh table

                    const playsRefreshTimeLeft = await UserDetails.getPlaysRefreshTimeLeft(currentUser.userId);

                    const currentTime = new Date();
                    const refreshTime = new Date(playsRefreshTimeLeft);
                    
                    if(currentTime > refreshTime && playsRefreshTimeLeft !== null){

                        await UserDetails.refreshGamesLeft(currentUser.userId);

                        const newAppSettings = {...appSettings}

                        newAppSettings.playsLeft = 10;

                        setAppSettings(newAppSettings)
                    }     
                }, 50000);
            };
                

            /* Checking translations */
            translationsLeftInterval.current = setInterval(async()=>{

                //Check every 100 seconds whether the current time is greater than the refresh time indicated in the translations refresh table;

                const refreshTimeRaw = await UserDetails.getTranslationsRefreshTimeLeft(currentUser.userId);

                let currentTime = new Date();
                let refreshTime = new Date(refreshTimeRaw);

                if(currentTime > refreshTime && premium && refreshTimeRaw !== null){
                    
                    await UserDetails.refreshTranslationsLeftPremium(currentUser.userId);

                    const newAppSettings = {...appSettings};

                    newAppSettings.translationsLeft = 250;

                    setAppSettings(newAppSettings)

                } else if (currentTime > refreshTime && !premium && refreshTimeRaw !== null){

                    await UserDetails.refreshTranslationsLeftFree(currentUser.userId);

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
                        await axios.post("/app/synclocalchanges"); //Call the backend to sync local changes.
                    }catch(e){
                        //Error in sending request to backend or error 500 response from backend.
                        /* Logic pertaining to syncing is contained in axios interceptors config */
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