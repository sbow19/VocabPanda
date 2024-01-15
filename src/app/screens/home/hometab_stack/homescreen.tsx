/* eslint-disable */

import * as types from '@customTypes/types.d'

import AdBanner from 'app/shared/ad_banner';

import React, {useContext} from 'react';
import {
    View,
    Text,
    ViewStyle
} from 'react-native';
import CoreStyles from '@styles/core_styles';
import AppButton from 'app/shared/app_button';
import ContentCard from '@shared/content_card';
import LastActivity from 'app/context/last_activity';

import DefaultContent from './table/default_content';
import ActivityContent from './table/activity_content';

import ScreenTemplate from '@shared/homescreen_template';

import windowDimensions from 'app/context/dimensions';
import appColours from 'app/shared_styles/app_colours';

const HomeScreen = (props: Object) =>{

    const [lastActivityData] = useContext(LastActivity)

    const nav = ()=>{

        props.navigation.navigate("game")
    }
    

return (
    
   
    
        <View style={[CoreStyles.defaultScreen, {justifyContent: "center", alignItems:"center"}]}>
            <ScreenTemplate screenTitle="Welcome back, John">
                <ContentCard cardStylings={customCardStylings}>
                    {lastActivityData.lastActivity == false ? <DefaultContent/> : <ActivityContent/>}
                </ContentCard>

                <View style={buttonContainerStyle}>
                    <AppButton {...props} onPress={nav}>
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