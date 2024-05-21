/* eslint-disable */

import {
    View,
    Text,
    Dimensions
} from 'react-native'

import * as types from '@customTypes/types.d'
import CoreStyles from 'app/shared_styles/core_styles';
import AppButton from 'app/shared/app_button';
import appColours from 'app/shared_styles/app_colours';
import ContentCard from 'app/shared/content_card';
import { TouchableOpacity, ViewStyle } from 'react-native';
import windowDimensions from 'app/context/dimensions';
import AppSwitch from 'app/shared/switch';
import AppSlider from 'app/shared/slider';
import AdBanner from 'app/shared/ad_banner';
import Dropdown from 'app/shared/dropdown';
import ProjectDropdown from 'app/shared/project_dropdown';
import React from 'react';
import LastActivity from 'app/context/last_activity';
import CurrentUserContext from 'app/context/current_user';
import UpgradePrompt from 'app/premium/upgrade_overlay';
import { showMessage } from 'react-native-flash-message';


import DefaultAppSettingsContext from 'app/context/default_app_settings_context';
import UserDetails from 'app/database/user_profile_details';
import UserContent from 'app/database/user_content';

const GameHome: React.FC = props=>{


    /* App settings */

    const [appSettings, appSettingsHandler] = React.useContext(DefaultAppSettingsContext)

    /* Current user context */

    const [currentUser] = React.useContext(CurrentUserContext);

    /* Kast activity object context */

    const lastActivityObject = React.useContext(LastActivity);

    /* Game slider value */ /* TODO change to useRef to avoid entire screen re renders */

    const [gameSliderValue, setGameSliderValue] = React.useState(10);

    /* Game turns value */ /* TODO change to useRef to avoid entire screen re renders  */

    const [gameTimeronValue, setGameTimeronValue] = React.useState(false);

    /* Project dropdown index */

    const [projectIndex, setProjectIndex] = React.useState("0")

    /* Mode dropdwon index */

    const [modeDropdownIndex, setModeDropdownIndex] = React.useState(0)

    /* Game mode */

    const [gameMode, setGameMode] = React.useState("All Words");

    /* set project state */

    const [project, setProject] = React.useState("");

    /* Set upgrade prompt  */

    const [upgradePrompt, setUpgradePrompt] = React.useState(false);


    const getProjectIndex = ()=>{

        const projectList = [];

        for(let project of appSettings.projects){
            projectList.push(project?.projectName)
        };

        const projectDropdownIndex = projectList.indexOf(props.route.params.project)

        return projectDropdownIndex 
   }

    /* Logic for managing route direction into home screen */

   React.useEffect(()=>{

    /* Set game mode based on source of redirect*/

    if(props.route?.params?.reDirectContent){

        switch(props.route.params.gameMode){

            case "Latest Activity - By Project":

                setGameMode("Latest Activity - By Project")
                setModeDropdownIndex(2)
                break

            case "By Project":

                let index = getProjectIndex()

                setGameMode("By Project")
                setModeDropdownIndex(1)
                setProjectIndex(index)
                setProject(props.route.params.project)
                
                break

            case "Latest Activity":
                setGameMode("Latest Activity")
                setModeDropdownIndex(2)

                break

            case "Search Results":
                setGameMode("Search Results")
                setModeDropdownIndex(3)

                break
        }
    }

    /* Set game settings */

    setGameSliderValue(appSettings.userSettings?.noOfTurns)
    setGameTimeronValue(appSettings.userSettings?.timerOn)


   }, [props.route])


   const gameModeNavigate = async()=>{

    if(props.route.params.gameMode === "Search Results" && gameMode === "Search Results" && props.route.params.resultArray.length > 0){

        props.navigation.navigate("vocab game", {

            timerOn: gameTimeronValue,
            noOfTurns: gameSliderValue,
            gameMode: "Search Results",
            resultArray: props.route.params.resultArray,
            project: ""
        });

        appSettingsHandler(appSettings.playsLeft, "subtractPlay"); // Update play left


        return
    }

    else if(props.route.params.gameMode === "Search Results" && gameMode === "Search Results" && props.route.params.resultArray.length === 0){

        showMessage({
            type: "info",
            message: "No search results"
        })

        return

    }

    if(gameMode === "All Words"){

        const resultArray = await UserContent.getAllEntries(currentUser);

        if(resultArray.length === 0){
            showMessage({
                type: "info",
                message: "No entries made yet"
            })

            return

        } else {

            props.navigation.navigate("vocab game", {

                timerOn: gameTimeronValue,
                noOfTurns: gameSliderValue,
                gameMode: "All Words",
                resultArray: resultArray,
                project: ""
            })

            appSettingsHandler(appSettings.playsLeft, "subtractPlay"); // Update play left
    
            return

        }
    }

    if (gameMode === "By Project") {

        const resultArray = await UserContent.getProjectEntries(currentUser, project);

        if(resultArray.length === 0){
            showMessage({
                type: "info",
                message: "No entries made yet"
            })

            return

        } else {


            props.navigation.navigate("vocab game", {

                timerOn: gameTimeronValue,
                noOfTurns: gameSliderValue,
                gameMode: "By Project",
                resultArray: resultArray,
                project: project
            })

            appSettingsHandler(appSettings.playsLeft, "subtractPlay"); // Update play left
    
            return
        }
    }

    if(gameMode === "Latest Activity" && lastActivityObject.lastActivity == true){

        props.navigation.navigate("vocab game", {

            timerOn: gameTimeronValue,
            noOfTurns: gameSliderValue,
            gameMode: "Latest Activity",
            resultArray: lastActivityObject.lastActivityResultArray,
            project: ""
        })

        appSettingsHandler(appSettings.playsLeft, "subtractPlay"); // Update play left

        return

    }

    if(gameMode === "Latest Activity" && lastActivityObject.lastActivity == false){


        showMessage({
            type: "info",
            message: "No activity since last logged in"
        })

        return
    }

    if(gameMode === "Latest Activity - By Project"){

        props.navigation.navigate("vocab game", {

            timerOn: gameTimeronValue,
            noOfTurns: gameSliderValue,
            gameMode: "Latest Activity - By Project",
            resultArray: props.route.params.resultArray,
            project: ""
        })
        
        appSettingsHandler(appSettings.playsLeft, "subtractPlay"); // Update play left

        return
    };

    if(gameMode === "Search Results"){

        showMessage({
            type: "info",
            message: "No search results"
        })
        return
    }
    
}
    
    const gameStart = async()=>{

        if(appSettings.playsLeft > 0 ){

            gameModeNavigate()

        } else {

            setUpgradePrompt(true)
        }
    }

       
    return(
        <>
            {/* Render only if user is not premium user */}
            {appSettings.premium.premium ? <></> : <UpgradeBannerGame {...props}/>}

            <View
                style={[
                    CoreStyles.defaultScreen,
                    {
                        backgroundColor: appColours.white,
                        height: "100%",
                        width:  "100%",
                        justifyContent: "space-evenly",
                        alignItems: "center"
                    }
                ]}
            >
                <ContentCard
                    cardStylings={customCardStyling}
                >
                    <View style={timeGamesSwitchRowStyle}>
                        <View style={textCellStyle}>
                            <Text style={[CoreStyles.contentText, {fontSize: 20}]}>Timer?</Text>
                        </View>
                    
                        <View style={contentCellStyle}>
                            <AppSwitch
                                onPress={setGameTimeronValue}
                                switchType={"timerOn"}
                                defaultValue={appSettings.userSettings?.timerOn}
                                setsDefault={false}
                            />
                        </View>
                    </View>


                    <View style={turnsSliderRowStyle}>

                        <View style={textCellStyle}>
                            <Text style={[CoreStyles.contentText, {fontSize: 20, paddingBottom: 10}]}>Number of Turns</Text>
                        </View>

                        <View style={[contentCellStyle, {paddingBottom:30}]}>
                            <AppSlider
                                onPress={setGameSliderValue}
                                sliderType={"noOfTurns"}
                                defaultValue={appSettings.userSettings?.noOfTurns}
                                setsDefault={false}
                            />
                        </View>
                    </View>

                    <View style={gameModeWrapperStyle}>

                        <View>
                            <Text style={[CoreStyles.contentText, {fontSize: 20, paddingBottom: 10}]}>Select Game Mode</Text>
                        </View>
                        <View>
                            <Dropdown
                                defaultButtonText='Select Mode'
                                data={["All Words", "By Project", "Latest Activity", "Search Results"]}
                                setSelection={setGameMode}
                                defaultValueByIndex={modeDropdownIndex}
                                search={false}
                            />
                        </View>
                    </View>

                    {gameMode === "By Project" ? <ProjectModeProject index={projectIndex} setProject={setProject}/> : null}

                </ContentCard>

                <View
                     style={{
                        width: windowDimensions.WIDTH*0.3,
                        height: windowDimensions.HEIGHT*0.08,
                        
                }}>

                    <AppButton
                        onPress={gameStart}
                    >
                        <Text 
                            style={CoreStyles.actionButtonText}
                        >Start</Text>
                    </AppButton>
                </View>

            </View>
            {/* upgrade prompt */}
            {upgradePrompt ? <UpgradePrompt {...props} reason="No Games" setVisibleFunction={()=>{setUpgradePrompt(false)}}/> : null}
            {!appSettings.premium.premium ? <AdBanner/>:null}
        </>
    )
}

const ProjectModeProject: React.FC = props =>{

    /*  App settings context */

    const [appSettings,] = React.useContext(DefaultAppSettingsContext)

    return(
        <View style={projectModeWrapperStyle}>

            <View>
                <Text style={[CoreStyles.contentText, {fontSize: 20, paddingBottom: 10}]}>Select Project</Text>
            </View>
            <View>
                <ProjectDropdown
                    defaultButtonText='Select Project'
                    data={appSettings.projects}
                    defaultValueByIndex={props.index}
                    setSelection={props.setProject}
                />
            </View>
        </View>
    )
}

function convertMilliseconds(milliseconds){

    let minutes = Math.floor(milliseconds / (1000 * 60))
    let seconds = Math.floor((milliseconds % (1000 * 60)) / (1000))

    let remainingString = ` Your plays refresh in ${minutes} minutes : ${seconds} seconds.`

    return remainingString
}

const UpgradeBannerGame = props =>{

    /* App settings */

    const [appSettings,] = React.useContext(DefaultAppSettingsContext);

    /* Timeleft */

    const [timeLeftDisplay, setTimeLeftDisplay] = React.useState(null)

    /* Timeleft on first referesh */

    const timeLeftInterval = React.useRef("")

    /* Timeleft string */

    const [timeLeftString, setTimeLeftString] = React.useState("");

    
    React.useMemo(()=>{
    
        const currentTime = new Date();
        const refreshTime = new Date(appSettings.playsRefreshTime);

        if(currentTime < refreshTime){

            const timeLeft = refreshTime - currentTime;

            const timeLeftConverted = convertMilliseconds(timeLeft);

            setTimeLeftString(timeLeftConverted);

            setTimeLeftDisplay(timeLeft);

        } else {

            setTimeLeftDisplay(null)
        }
 
    }, [appSettings])

    React.useEffect(()=>{

        if(timeLeftDisplay != null){

            clearInterval(timeLeftInterval.current)

            timeLeftInterval.current = setInterval(()=>{

                setTimeLeftDisplay(prevTime => {

                    let prevTimeString = new Date(prevTime)
                    
                    let newTime = prevTimeString - 1000

                    let timeLeftConverted = convertMilliseconds(newTime)

                    setTimeLeftString(timeLeftConverted)

                    return newTime
                
                }    )
            }, 1000)
        }
    }, [appSettings])


    return (
        <View
        style={{
            width: windowDimensions.WIDTH,
            height: windowDimensions.HEIGHT*0.08,
            backgroundColor: "orange",
            // marginTop: (()=>{
            //     let {height} = Dimensions.get("window")
            //     return height
            // })(),
            justifyContent: "center",
            position: "relative"
        }}
    >
        <TouchableOpacity
            style={{
                width: windowDimensions.WIDTH,
                height: windowDimensions.HEIGHT*0.075,
                alignItems: "center",
                marginTop: 10
                
            }}

            onPress={()=>{
                props.navigation.navigate("Account")
            }}
        >

            <Text
                style={[
                    CoreStyles.contentText,
                    {lineHeight: 14}
                ]}
            > 
                You have {appSettings.playsLeft} plays left.
                {timeLeftDisplay ? timeLeftString : null} Upgrade to premium for unlimited turns.
            </Text>

            <Text
                style={CoreStyles.contentText}
            > 
                
            </Text>

            {/* Timer component */}


        </TouchableOpacity>
        
    </View>
    

    )
}


const customCardStyling: types.CustomCardStyles ={
    width: windowDimensions.WIDTH * 0.9,
    height: windowDimensions.HEIGHT *  0.6,
    justifyContent: "flex-start",
};

const timeGamesSwitchRowStyle:ViewStyle = {

    flexDirection: "row",
    height: windowDimensions.HEIGHT* 0.1

};

const turnsSliderRowStyle: ViewStyle = {

    flexDirection: "row",
    height: windowDimensions.HEIGHT* 0.1
};

const textCellStyle: ViewStyle = {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "flex-start"
}

const contentCellStyle: ViewStyle = {

    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 6
}

const gameModeWrapperStyle: ViewStyle = {

    height: windowDimensions.HEIGHT* 0.15,
    marginTop: 20

}

const projectModeWrapperStyle: ViewStyle = {

    height: windowDimensions.HEIGHT* 0.15,
    marginTop: 20

}

export default GameHome;