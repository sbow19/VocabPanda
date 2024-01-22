/* eslint-disable */

import * as types from '@customTypes/types.d'
import React, { useEffect } from 'react';
import { CurrentRenderContext, NavigationContainer} from '@react-navigation/native'
import AppMainDrawer from '@routes/drawer';
import GameStack from './game/gamestack';
import SearchResults from '@screens/home/hometab_stack/search_results/search_results';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoggedInStatus from './context/loggedIn';
import LoadingStatus from './context/loading';
import LastActivity from './context/last_activity';
import CurrentUserContext from './context/current_user';

import LoadingScreen from '@screens/login/loading_screen';
import LoginStack from 'app/routes/login_stack';

import FlashMessage from 'react-native-flash-message';
import CoreStyles from './shared_styles/core_styles';

import AppSettings from './storage/app_settings_storage';
import DefaultAppSettingsContext from './context/default_app_settings_context';
import AppLoginDetails from './storage/user_profile_details';

import LocalDatabase from './database/local_database';
import UserDatabaseContext from './context/current_user_database';
import { SQLiteDatabase } from 'react-native-sqlite-storage';


const MainAppContainer = createNativeStackNavigator()


const VocabPandaApp: React.FC = props => { 

    /* loading screen --> sign in screen or main app */

    const [isLoggedIn, setIsLoggedIn] = React.useContext(LoggedInStatus);

    const [isLoading, setIsLoading] = React.useContext(LoadingStatus);

    /* Current user state */

    const [currentUser, setCurrentUser] = React.useState("")

    const currentUserSet = [currentUser, setCurrentUser] 



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
                /* Sets object defining login details */
                await AppLoginDetails.setInitial()

                /* Tests whether a database can be connected to */

                await LocalDatabase.createTestDatabase().catch((e)=>{

                    console.log("Connection to database failed")
                    console.log(e)
                })

    
                setIsLoading(false);
            }
        }

        onStartUpLoad()
        
    }, [isLoggedIn])

    
    return(
    
        <CurrentUserContext.Provider value={currentUserSet}>
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
    )

}

const MainApp: React.FC = props=>{
    
    /* Setting current user */

    const [currentUser, setCurrentUser] = React.useContext(CurrentUserContext)

    /* Setting database object globally to app */

    const [databaseObject, setMyDatabaseObject] = React.useState({})

    const myDatabaseOptions: types.StateHandlerList<SQLiteDatabase, React.Dispatch<React.SetStateAction<SQLiteDatabase>>> = [databaseObject, setMyDatabaseObject]

    /* Getting last activity data on sign in */

    const [lastActivityData, setLastActivityData] = React.useState<types.LastActivityObject>({
        lastActivity: false,
        lastActivityData:{
            projects: [""],
            noOfAdditions: []
        }
    })

    const lastActivitySet = [lastActivityData, setLastActivityData]



    /* Code for handling default game settings globally */

    const [appSettings, setAppSettings] = React.useState<types.AppSettingsObject>(
        
        {

        gameSettings: {
            timerOn: false,
            noOfTurns: 10
        },

        dropDownLanguages:{

            targetLanguage: "English",
            outputLanguage: "English"
        },
    
        projects: []
    
    })
    
    function setAppSettingsHandler(
        timerOn: boolean|null, 
        noOfTurns: number|null, 
        setsDefault: boolean|null,
        projectConfig?: types.ProjectConfig<types.ProjectObject> | types.ProjectConfig<string>
    
        ){


        let newSettings = { ...appSettings}
    
        if(timerOn == true || timerOn == false){
            newSettings.gameSettings.timerOn = timerOn
        }

        if(typeof(noOfTurns)==="number"){
            newSettings.gameSettings.noOfTurns = noOfTurns
        }


        /* When a project is added or deleted, the global state of the dropdowns is updated here
        so any changes will show immediately, rather than on the next app reload */

        if(projectConfig){
            if(projectConfig.mode === "add"){

                newSettings.projects.push(projectConfig.project)
            }

            if(projectConfig.mode === "delete"){

                const newList = newSettings.projects.filter(item => item?.projectName !==  projectConfig.project);

                newSettings.projects = newList

            }
        }

        if(setsDefault==true){
            AppSettings.setDefaultSettings(currentUser, newSettings)
        }

        setAppSettings(newSettings)
        
    }




    React.useEffect(()=>{

            const appSettingsLoad = async ()=>{

                /* Opening database and creating new table */
                await LocalDatabase.openDatabase(currentUser).then((databaseObject)=>{

                    setMyDatabaseObject(databaseObject);

                }).catch((e)=>{

                    console.log("Failed to open database")
                    console.log(e)
                })

                // await LocalDatabase.getAll(currentUser, databaseObject.database)

                /* Sets default app settings for new user */
                await AppSettings.newSettings(currentUser)

                const appSettings = await AppSettings.getDefaultAppSettings(currentUser)
                setAppSettings(appSettings)

                /* Last activity determiner */

                let lastActivityObject: types.LastActivityObject = {

                    lastActivity: true,
                    lastActivityData:{

                        projects: ["First Project", "Second project"],
                        noOfAdditions: [10, 3]

                    },
                    lastActivityResultArrays: [
                        {
                            project: "First Project",
                            resultArray: ["hello"]
                        },

                        {
                            project: "Second Project",
                            resultArray: ["sup", "how are you"]
                        },


                    ]
                   
                }

                setLastActivityData(lastActivityObject)
            }
            appSettingsLoad()    

    }, [])


    const myDefaultAppSettings:types.StateHandlerList<types.AppSettingsObject, Function> =[appSettings, setAppSettingsHandler]


    return(<>
            <UserDatabaseContext.Provider value={myDatabaseOptions}>
            <LastActivity.Provider value={lastActivitySet}>
            <DefaultAppSettingsContext.Provider value={myDefaultAppSettings}>
                <MainAppContainer.Navigator screenOptions={{headerShown:false}}>
                    <MainAppContainer.Screen name="main" component={AppMainDrawer}/>
                    <MainAppContainer.Screen name="game" component={GameStack} options={{presentation: "modal"}}/>
                    <MainAppContainer.Screen name="results" component={SearchResults}  options={{presentation: "modal"}}/>
                </MainAppContainer.Navigator>
            </DefaultAppSettingsContext.Provider>
            </LastActivity.Provider>
            </UserDatabaseContext.Provider>
            

            </>
           
    )
}


export default VocabPandaApp