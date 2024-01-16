/* eslint-disable */

import * as types from '@customTypes/types.d'


import React, {useContext} from 'react';
import {
    View,
    Text,
    ViewStyle,
    TouchableOpacity
} from 'react-native';
import CoreStyles from '@styles/core_styles';
import AppButton from 'app/shared/app_button';
import ContentCard from '@shared/content_card';
import LastActivity from 'app/context/last_activity';

import DefaultContent from './components/default_content';
import ActivityContent from './components/activity_content';

import ScreenTemplate from '@shared/homescreen_template';

import windowDimensions from 'app/context/dimensions';
import appColours from 'app/shared_styles/app_colours';


const HomeScreen = (props: Object) =>{

    const [lastActivityData] = useContext(LastActivity)

    const gameNav = ()=>{

        props.navigation.navigate("game", {
            params:{
                mode: "Last Activity"
            }
        })
    }
    

return (
        <View style={[CoreStyles.defaultScreen, {justifyContent: "flex-end", alignItems:"center"}]}>
             <View
                    style={{
                        width: windowDimensions.WIDTH,
                        height: windowDimensions.HEIGHT*0.04,
                        backgroundColor: "orange",
                        position: "relative",
                        zIndex:1
                        
                    }}
                >
                    
                    {/* Render turns left if not premium version */}
                    <TouchableOpacity
                        style={{
                            width: windowDimensions.WIDTH,
                            height: windowDimensions.HEIGHT*0.04,
                            alignItems: "center"
                        }}
                    >
                        <Text
                             style={CoreStyles.contentText}
                        > Upgrade to premium for full content!</Text>


                    </TouchableOpacity>
                </View>
            <ScreenTemplate screenTitle="Welcome back, John">
                <ContentCard cardStylings={customCardStylings}>

                    {/*
                        Content filling card is determined by whether the user has added new content since the last login
                    */}

                    {lastActivityData.lastActivity == false ? <DefaultContent/> : <ActivityContent/>}
                </ContentCard>

                <View style={buttonContainerStyle}>
                    <AppButton 
                        {...props} 
                        onPress={gameNav}
                        customStyles={CoreStyles.playButtonColor}
                
                    >
                        <Text style={CoreStyles.actionButtonText}>Play</Text>
                    </AppButton>
                </View>
            </ScreenTemplate>

           
        </View>

)
}

const customCardStylings: types.CustomButtonStyles = {

    width: (windowDimensions.WIDTH *  0.9),
    height: (windowDimensions.HEIGHT * 0.45)

};

const buttonContainerStyle: ViewStyle = {

    width: (windowDimensions.WIDTH *  0.9),
    height: (windowDimensions.HEIGHT *  0.10),
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: appColours.white,
    justifyContent: "space-evenly",
    alignItems: "center"

}

export default HomeScreen;