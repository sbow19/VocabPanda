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


import DefaultAppSettingsContext from 'app/context/default_app_settings_context';

const GameHome: React.FC = props=>{

    /* Mode selection state */

    const [projectModeSelectionState, setProjectModeSelectionState] = React.useState(true)

    const setSelectionHandler = (item)=>{

        if (item === "By Project"){

            setProjectModeSelectionState(true)
        }else{

            setProjectModeSelectionState(false)
        }
    }


    const gameStart = ()=>{


        props.navigation.navigate("vocab game")
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


                <ContentCard
                    cardStylings={customCardStyling}
                >
                    <View style={timeGamesSwitchRowStyle}>
                        <View style={textCellStyle}>
                            <Text style={[CoreStyles.contentText, {fontSize: 20}]}>Timer?</Text>
                        </View>
                    
                        <View style={contentCellStyle}>
                            <AppSwitch/>
                        </View>
                    </View>


                    <View style={turnsSliderRowStyle}>

                        <View style={textCellStyle}>
                            <Text style={[CoreStyles.contentText, {fontSize: 20, paddingBottom: 10}]}>Number of Turns</Text>
                        </View>

                        <View style={[contentCellStyle, {paddingBottom:30}]}>
                            <AppSlider/>
                        </View>
                    </View>

                    <View style={gameModeWrapperStyle}>

                        <View>
                            <Text style={[CoreStyles.contentText, {fontSize: 20, paddingBottom: 10}]}>Select Game Mode</Text>
                        </View>
                        <View>
                            <Dropdown
                                defaultButtonText='Select Mode'
                                data={["All Words", "By Project", "Latest Activity"]}
                                setSelection={setSelectionHandler}
                            />
                        </View>
                    </View>

                    {projectModeSelectionState ? <ProjectModeProject/> : null}


                </ContentCard>

                <View>
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
                <Text style={[CoreStyles.contentText, {fontSize: 20, paddingBottom: 10}]}>Select Game Mode</Text>
            </View>
            <View>
                <ProjectDropdown
                    defaultButtonText='Select Project'
                    data={appSettings.projects}
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