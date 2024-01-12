/* eslint-disable */

import * as types from '@customTypes/types.d'

import React, { useContext } from 'react';
import {
    View,
    Text,
    ViewStyle,
} from 'react-native';
import CoreStyles from '@styles/core_styles';
import appColours from '@styles/app_colours';

import ScreenTemplate from 'app/shared/homescreen_template';
import VocabPandaTextInput from '@shared/text_input';
import Dropdown from 'app/shared/dropdown';

import ContentCard from '@shared/content_card'

import AdBanner from '@shared/ad_banner';
import windowDimensions from 'app/context/dimensions';
import AppButton from 'app/shared/app_button';


const VocabSearch: React.FC<types.CustomButtonStylesProp> = props=>{

    const data: types.ProjectList = ["First proj", "vocab", "Spain"];

    const [currentProjectSelection, setCurrentProjectSelection] = React.useState("");


    return(
        
            <View style={[CoreStyles.defaultScreen, additionalStyles]}>
                <ScreenTemplate screenTitle="Search Your Vocabulary!">

                    <ContentCard cardStylings={searchCardStyles}>
                        <View  style={{justifyContent:"center", flex:1} }>
                            <VocabPandaTextInput inputStyle={customTextInputStyle}/>
                        </View>
                        <View style={{justifyContent:"center", flex:1} }>
                            <AppButton onPress={()=>{console.log("hello world")}}>
                                <Text style={CoreStyles.actionButtonText}> Search </Text>
                            </AppButton>
                        </View>

                    </ContentCard>

                    <ContentCard cardStylings={dropdownCardStyles}>

                        <View  style={{justifyContent:"center", flex:1} }>
                            <Dropdown
                                data={data}
                                defaultButtonText="Choose Project"
                                setSelection={setCurrentProjectSelection}
                            />
                        </View>
                        <View style={{justifyContent:"center", flex:1} }>
                            <AppButton onPress={()=>{console.log("hello world")}}>
                                <Text style={CoreStyles.actionButtonText}> Search </Text>
                            </AppButton>
                        </View>
                    </ContentCard>
                    
                        
                </ScreenTemplate> 
                <AdBanner/>
            </View>

    )
}

const customTextInputStyle: ViewStyle = {

    width: windowDimensions.WIDTH * 0.8

}

const searchCardStyles: types.CustomCardStyles = {

    width: windowDimensions.WIDTH * 0.9,
    height: windowDimensions.HEIGHT * 0.25,
    marginBottom: 20,
    alignItems: "center"

};

const dropdownCardStyles: types.CustomCardStyles = {

    width: windowDimensions.WIDTH * 0.9,
    height: windowDimensions.HEIGHT * 0.25,
    alignItems: "center"

}

const additionalStyles: ViewStyle = {
    justifyContent: "center",
    alignItems: "center"
}

export default VocabSearch;