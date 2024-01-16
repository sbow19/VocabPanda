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

    const resultsNav = ()=>{

        props.navigation.navigate("results")
    }


    return(
        
            <View style={[CoreStyles.defaultScreen, additionalStyles, {height: windowDimensions.HEIGHT}]}>
                <ScreenTemplate screenTitle="Search Your Vocabulary!">

                    <ContentCard cardStylings={searchCardStyles}>

                        <View  style={{justifyContent:"center", flex:1} }>
                            <Text
                            style={[
                                CoreStyles.contentTitleText,
                                {fontSize: 20}
                            ]}>
                                Search by matches...
                            </Text>
                        </View>


                        <View  style={{justifyContent:"center", flex:1.1} }>
                            <VocabPandaTextInput 
                            
                                style={customTextInputStyle}
                                placeholder='Type...'
                            />
                        </View>
                        <View style={{justifyContent:"center", flex:1.2} }>
                            <AppButton 
                                onPress={resultsNav}
                            >
                                <Text style={CoreStyles.actionButtonText}> Search </Text>
                            </AppButton>
                        </View>

                    </ContentCard>

                    <ContentCard cardStylings={dropdownCardStyles}>

                        <View  style={{justifyContent:"center", flex:1} }>
                            <Text
                                style={[
                                    CoreStyles.contentTitleText,
                                    {fontSize: 20}
                                ]}
                            >
                                ...or by Project

                            </Text>
                        </View>

                        <View  style={{justifyContent:"center", flex:1.1} }>
                            <Dropdown
                                data={data}
                                defaultButtonText="Choose Project"
                                setSelection={setCurrentProjectSelection}
                            />
                        </View>

                        <View style={{justifyContent:"center", flex:1.2} }>
                            <AppButton
                                onPress={resultsNav}
                            >
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
    height: windowDimensions.HEIGHT * 0.27,
    marginBottom: 20,
    alignItems: "center"

};

const dropdownCardStyles: types.CustomCardStyles = {

    width: windowDimensions.WIDTH * 0.9,
    height: windowDimensions.HEIGHT * 0.27,
    alignItems: "center"

}

const additionalStyles: ViewStyle = {
    justifyContent: "center",
    alignItems: "center"
}

export default VocabSearch;