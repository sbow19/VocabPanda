/* eslint-disable */

import {
    View,
    Text
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


import DefaultAppSettingsContext from 'app/context/default_app_settings_context';
import { showMessage } from 'react-native-flash-message';

const GameHome: React.FC = props=>{


    /* App settings */

    const [appSettings, setAppSettings] = React.useContext(DefaultAppSettingsContext)

    /* Kast activity object context */

    const lastActivityObject = React.useContext(LastActivity)

    /* Game slider value */ /* TODO change to useRef to avoid entire screen re renders */

    const [gameSliderValue, setGameSliderValue] = React.useState(10)

    /* Game turns value */ /* TODO change to useRef to avoid entire screen re renders  */

    const [gameTimeronValue, setGameTimeronValue] = React.useState(false)

    /* Project dropdown index */

    const [projectIndex, setProjectIndex] = React.useState("0")

    /* Mode dropdwon index */

    const [modeDropdownIndex, setModeDropdownIndex] = React.useState(0)

    /* Game mode */

    const [gameMode, setGameMode] = React.useState("All Words")

    /* set project state */

    const [project, setProject] = React.useState("")

    /* Serialise last activity */


    const getProjectIndex = ()=>{

        let projectList = [];

        for(let project of appSettings.projects){
            projectList.push(project?.projectName)
        }

        let projectDropdownIndex = projectList.indexOf(props.route.params.project)

        return projectDropdownIndex 
   }

    /* Logic for managing route direction into home screen */

   React.useEffect(()=>{

    /* Set game mode */

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

    setGameSliderValue(appSettings.gameSettings?.noOfTurns)
    setGameTimeronValue(appSettings.gameSettings?.timerOn)


   }, [props.route])
    

    const gameStart = ()=>{

        if(props.route.params.gameMode === "Search Results" && gameMode === "Search Results"){

            props.navigation.navigate("vocab game", {

                timerOn: gameTimeronValue,
                noOfTurns: gameSliderValue,
                gameMode: "Search Results",
                resultArray: props.route.params.resultArray,
                project: ""
            })

            return
        }

        if(gameMode === "All Words"){

            props.navigation.navigate("vocab game", {

                timerOn: gameTimeronValue,
                noOfTurns: gameSliderValue,
                gameMode: "All Words",
                resultArray: [],
                project: ""
            })

            return
        }

        if (gameMode === "By Project") {

            props.navigation.navigate("vocab game", {

                timerOn: gameTimeronValue,
                noOfTurns: gameSliderValue,
                gameMode: "By Project",
                resultArray: [],
                project: project
            })

            return

        }

        if(gameMode === "Latest Activity" && lastActivityObject.lastActivity == true){

            props.navigation.navigate("vocab game", {

                timerOn: gameTimeronValue,
                noOfTurns: gameSliderValue,
                gameMode: "Latest Activity",
                resultArray: [],
                project: ""
            })

            return

        }

        if(gameMode === "Latest Activity" && lastActivityObject.lastActivity == false){


            showMessage({
                type: "info",
                message: "No activity since last logged in"
            })
        }

        if(gameMode === "Latest Activity - By Project"){

            props.navigation.navigate("vocab game", {

                timerOn: gameTimeronValue,
                noOfTurns: gameSliderValue,
                gameMode: "Latest Activity - By Project",
                resultArray: props.route.params.resultArray,
                project: ""
            })

            return

        }

        if(gameMode === "Search Results"){

            showMessage({
                type: "info",
                message: "No search results"
            })

            return

        }
        
    }

    return(
        <>
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

                {/* Render only if user is not premium user */}
                {appSettings.premium.premium ? <></> : 
                    <View
                        style={{
                            width: windowDimensions.WIDTH,
                            height: windowDimensions.HEIGHT*0.08,
                            backgroundColor: "orange",
                            marginTop: -windowDimensions.HEIGHT*0.04
                        }}
                    >
                        
                        {/* Render turns left if not premium version */}
                        <TouchableOpacity
                            style={{
                                width: windowDimensions.WIDTH,
                                height: windowDimensions.HEIGHT*0.075,
                                alignItems: "center"
                            }}

                            onPress={()=>{
                                props.navigation.navigate("Account")
                            }}
                        >

                            <Text
                                style={CoreStyles.contentText}
                            > You have {/* no of turns */} left. Your turns refresh in X</Text>

                            <Text
                                style={CoreStyles.contentText}
                            > Upgrade to premium for unlimited turns</Text>

                            {/* Timer component */}


                        </TouchableOpacity>
                    </View>
                }


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
            <AdBanner/>
        </>
    )
}

const ProjectModeProject: React.FC = props =>{

    /*  App settings context */

    const [appSettings, setAppSettings] = React.useContext(DefaultAppSettingsContext)

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