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
import CurrentUserContext from 'app/context/current_user';
import UpgradeBanner from 'app/shared/upgrade_banner';


const HomeScreen = (props: Object) =>{

    const [currentUser, setCurrentUser] = React.useContext(CurrentUserContext)

    const [lastActivityObject] = React.useContext(LastActivity)

    const lastActivityDataCleanUp = ()=>{

        let resultRowsComp = []

        for (let project of lastActivityObject.lastActivityResultArrays){

            let listLength = project.resultArray.length

            for(let i=0; i < listLength ; i++){

                resultRowsComp.push(project.resultArray[i])
            }
        }

        return resultRowsComp
        
    }

    const gameNav = ()=>{

        props.navigation.navigate("game", {
            screen: "game home",
            params:{
                reDirectContent: true,
                gameMode: "Latest Activity",
                project: "",
                resultArray: lastActivityDataCleanUp()

            }
        })
    }
    

return (
        <View style={[CoreStyles.defaultScreen, {justifyContent: "flex-end", alignItems:"center"}]}>

            {/* Render based on upgrade status */}
            <UpgradeBanner/>

            <ScreenTemplate screenTitle={`Welcome back, ${currentUser}`}>
                <ContentCard cardStylings={customCardStylings}>

                    {/*
                        Content filling card is determined by whether the user has added new content since the last login
                    */}

                    {lastActivityObject.lastActivity == false ? <DefaultContent/> : <ActivityContent {...props}/>}
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