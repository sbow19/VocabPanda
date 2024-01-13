/* eslint-disable */

import * as types from '@customTypes/types.d'

import React from 'react';
import {
    View,
    ViewStyle
} from 'react-native';

import CoreStyles from '@styles/core_styles';
import ContentCard from '@shared/content_card';
import windowDimensions from 'app/context/dimensions';
import AdBanner from 'app/shared/ad_banner';

const About: React.FC = ()=>{

    return (
        <View style={[CoreStyles.defaultScreen, additionalSceneStyles]}>
            <ContentCard
                cardStylings={topCardStyle}


            >


            </ContentCard>

            <ContentCard
                cardStylings={bottomCardStyle}


            >


            </ContentCard>
            <AdBanner
                customStyles={{
                    position: "relative",
                    top: 10
                }}
            />
           
        </View>
    )
}

const topCardStyle:types.CustomButtonStyles = {

    height: windowDimensions.HEIGHT*0.4, 
    width: windowDimensions.WIDTH*0.9,
    marginBottom: 20


}

const bottomCardStyle:types.CustomButtonStyles = {
    height: windowDimensions.HEIGHT*0.4, 
    width: windowDimensions.WIDTH*0.9

    
}


const additionalSceneStyles: ViewStyle = {
    alignItems: "center",
    marginTop: 10
};

export default About;