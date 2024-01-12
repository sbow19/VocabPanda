/* eslint-disable */

import * as types from '@customTypes/types.d'

import React from 'react';
import {
    View,
    ViewStyle,
    Text
} from 'react-native';
import CoreStyles from '@styles/core_styles';
import AppSwitch from '@shared/switch';
import AppSlider from '@shared/slider';

import ScreenTemplate from '@shared/homescreen_template';
import ContentCard from '@shared/content_card';

import windowDimensions from '@context/dimensions';
import App from 'App';
import appColours from 'app/shared_styles/app_colours';

const GameSettings: React.FC = ({navigation})=>{

return (
    <View style={[CoreStyles.defaultScreen, additionalStyles]}>
        <ScreenTemplate screenTitle="Set Default Game Settings">
            <ContentCard cardStylings={customCardStylings}>
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
                        <Text style={[CoreStyles.contentText, {fontSize: 20}]}>Number of Turns</Text>
                    </View>
                    <View style={[contentCellStyle, {paddingTop:70}]}>
                        <AppSlider/>
                    </View>
                </View>
            </ContentCard>
        </ScreenTemplate>
    </View>
)
}

const timeGamesSwitchRowStyle:ViewStyle = {

    flexDirection: "row",
    flex: 1,
    height: "30%"

};

const turnsSliderRowStyle: ViewStyle = {

    flexDirection: "row",
    flex: 1,
    height: "50%"
};

const textCellStyle: ViewStyle = {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center"
}

const contentCellStyle: ViewStyle = {

    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 6
}

const customCardStylings: types.CustomButtonStyles = {

    width: (windowDimensions.WIDTH *  0.9),
    height: (windowDimensions.HEIGHT * 0.55)

};

const additionalStyles: ViewStyle = {
    justifyContent: "center",
    alignItems: "center"
}

export default GameSettings;