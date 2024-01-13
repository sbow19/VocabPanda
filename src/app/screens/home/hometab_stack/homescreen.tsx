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

import ScreenTemplate from '@shared/homescreen_template';

import TabSwipeStatus from '@context/swipe_toggle';
import windowDimensions from 'app/context/dimensions';
import appColours from 'app/shared_styles/app_colours';

const HomeScreen = (props: Object) =>{

    const nav = ()=>{

        props.navigation.navigate("game", {

            screen: "MyModal"
            
        })
    }
    

return (
    
   
    
        <View style={[CoreStyles.defaultScreen, {justifyContent: "center", alignItems:"center"}]}>
            <ScreenTemplate screenTitle="Welcome back, John">
                <ContentCard cardStylings={customCardStylings}>
                    <View>
                        <Text></Text>
                    </View>
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