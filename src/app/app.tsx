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
import UserDetails from './database/user_profile_details';

import LocalDatabase from './database/local_database';
import BackendAPI from 'app/api/backend';

import InternetStatus from './context/internet';
import NetInfo from "@react-native-community/netinfo";
import LoadingStatusInGame from './context/loadingInGame';
import ActivityIndicatorStatus from './context/activity_indicator_context';
import windowDimensions from './context/dimensions';

import db from './database/db_util';

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

    const currentUserSet = [currentUser, setCurrentUser] 

    React.useEffect(()=>{

        const onStartUpLoad = async()=>{

            if(isLoadingInitial){
                try{

                    /* FOR DEVELOPMENT: reset local database code here to prompt user*/

                    await LocalDatabase.resetDatabase();

                    /*
                        Configures local database on the first load 
                    */

                    //Create new database schema / check whether db is accessible

                    await LocalDatabase.createDatabaseSchema();

                    //Set global headers in database

                    await BackendAPI.setGlobalHeaders();

                    /* Set API key in local storage / request new API key on first startup*/
                    await LocalDatabase.setAPIKey();

                    /*
                        Check for internet connection
                    */
                    
                    const isUserOnline = await NetInfo.fetch();

                    setIsOnline(isUserOnline);

                    /*
                        Set event listener for internet connection
                    */

                    NetInfo.addEventListener(state=>{
                        setIsOnline(state.isConnected);
                    });

            
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
    
    function setAppSettingsHandler(value, valueType: string){

        console.log(value, valueType)

        const newSettings = { ...appSettings}

        if(valueType === "timerOn"){

            //Update database

            UserDetails.updateTimerValue(currentUser, value)
            .then(()=>{

                console.log("Timer val update successfully.");

            })
            .catch((e)=>{

                console.log(e);
                showMessage({
                    message: "Unable to update timer value.",
                    type: "warning"
                })
            }
            );

            //Update app settings

            newSettings.userSettings.timerOn = value;
        };

        if(valueType === "noOfTurns"){

            //Update database
            UserDetails.updateTurnsValue(currentUser, value)

            //UPdate app settings

            newSettings.userSettings.noOfTurns = value;
        };

        if(valueType === "addProject"){

            //Project object is pushed into array of projects
            newSettings.projects.push(value);
        };

        if(valueType === "deleteProject"){

            //FIlter out deleted project from dropdowns.

            const newList = newSettings.projects.filter(item => item.projectName !== value);

            newSettings.projects = newList
        };

        if(valueType === "defaultProject"){
            //TODO This is more relevant from the Chrome Extension
        };

        if(valueType === "defaultTargetLang"){
            //Update database
            UserDetails.updateTargetLangDefault(currentUser, value);

            //Update app settings
            newSettings.userSettings.targetLanguage = value;
        };

        if(valueType === "defaultOutputLang"){
            //update database
            UserDetails.updateOutputLangDefault(currentUser, value);

            //Update app settings
            newSettings.userSettings.outputLanguage = value; 
        };

        if(valueType === "subtractTranslation"){

            //Update app settings
            newSettings.translationsLeft = value.translationsLeft;
            
            newSettings.translationsRefreshTime = value.translationsRefreshTime;
        };

        if(valueType === "subtractPlay"){

            //Update app settings
            newSettings.playsLeft = value.playsLeft; 

            newSettings.playsRefreshTime = value.playsRefreshTime;
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
                
                */

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

    /* Interval timer to check countdowns for refreshes across the app -- TODO REFACTOR OUT*/
    React.useEffect(()=>{

        if(!isLoadingInGame){

            const setCronJobs = async ()=>{

                clearInterval(gamesLeftInterval.current)
                clearInterval(translationsLeftInterval.current)

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
                        
                        if(currentTime > refreshTime){

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

                    if(currentTime > refreshTime && premium){
                        
                        await UserDetails.refreshTranslationsLeftPremium(userId);

                        const newAppSettings = {...appSettings};

                        newAppSettings.translationsLeft = 120;

                        setAppSettings(newAppSettings)

                    } else if (currentTime > refreshTime && !premium){

                        await UserDetails.refreshTranslationsLeftFree(userId);

                        const newAppSettings = {...appSettings}

                        newAppSettings.translationsLeft = 40;

                        setAppSettings(newAppSettings)
                    };
                }, 50000);
            }

            setCronJobs();
        }

    }, [appSettings])

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

            {activityIndicator ? <ActivityIndicator size={"large"} style={{
                position: "absolute",
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                height: windowDimensions.HEIGHT,
                width: windowDimensions.WIDTH

            }}/> : null}
        </>
           
    )
}


export default VocabPandaApp