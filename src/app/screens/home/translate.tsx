/* eslint-disable */

import * as types from '@customTypes/types.d'

import React, {useState, useContext} from 'react';
import {
    View,
    Text, 
    TextStyle,
    ViewStyle,
    Pressable,
    Dimensions
} from 'react-native';
import Dropdown from 'app/shared/dropdown';
import AppButton from '@shared/app_button';
import VocabPandaTextInput from '@shared/text_input';
import CoreStyles from '@styles/core_styles';
import ScreenTemplate from '@shared/homescreen_template';
import ContentCard from '@shared/content_card';

import windowDimensions from '@context/dimensions';
import AdBanner from 'app/shared/ad_banner';
import appColours from 'app/shared_styles/app_colours';


import { Overlay } from '@rneui/base';

const TranslateVocab: React.FC = props=>{
    
    /* temp data list wth languages */
    const languages: types.ProjectList = ["Spanish", "English"]

    /* define database response object */
    /* database loaded on first load and stored in cache */
    const [inputLangSelection, setInputLangSelection] = useState("");

    const [outputLangSelection, setOutputLangSelection] = useState("");


    /* overlay */
    const [overlayVisible, setOverlayVisible] = useState(false)

    const nav = ()=>{
        setOverlayVisible(!overlayVisible)
    }


    return(

        <View style={CoreStyles.defaultScreen}>
            <ScreenTemplate screenTitle="Translate">
   
                <ContentCard cardStylings={inputCardStylings}>
                    <View style={headerWrapper}>
                        <View style={titleWrapper}>
                            <Text style={[CoreStyles.contentText, {fontSize: 18}]}>Type to translate</Text>
                        </View>
                        <View style={dropdownWrapper}>

                            <Dropdown
                                data={languages}
                                defaultButtonText='Target Lang'
                                customStyles={dropdownStyle}
                                setSelection={setInputLangSelection}
                            />

                        </View>
                    </View>
                    <View style={textInputWrapper}>
                        <VocabPandaTextInput inputStyle={customInputStyle} numberOfLines={4} editable={true}/>
                    </View>
            
                </ContentCard >
                    

                <ContentCard cardStylings={outputCardStylings}>
                        <View style={headerWrapper}>
                        <View style={titleWrapper}>
                            <Text style={[CoreStyles.contentText, {fontSize: 18}]}>Output</Text>
                        </View>
                        <View style={dropdownWrapper}>

                            <Dropdown
                                data={languages}
                                defaultButtonText='Output Lang'
                                customStyles={dropdownStyle}
                                setSelection={setOutputLangSelection}
                            />

                        </View>
                    </View>
                    <View style={textInputWrapper}>
                        <VocabPandaTextInput inputStyle={customOutputStyle} numberOfLines={4} editable={false}/>
                    </View>
                
                </ContentCard>

                <View style={[CoreStyles.defaultScreen, buttonWrapperStyle]}>                
                        <AppButton customStyles={{width:120}} onPress={nav}>
                    
                            <Text style={CoreStyles.actionButtonText}>Add to project</Text>
                                                 
                        </AppButton>        
                </View>               

            </ScreenTemplate>

            <Overlay
                isVisible={overlayVisible}
                overlayStyle={overlayStyle}
            >
                <AppButton onPress={()=>{setOverlayVisible(!overlayVisible)}}>
                    <Text>Press me</Text>
                </AppButton>
            
            </Overlay>

            <AdBanner/>
        </View>
    )
}

const overlayStyle: ViewStyle = {
    height: windowDimensions.HEIGHT * 0.4,
    width: windowDimensions.WIDTH * 0.8,
    backgroundColor: appColours.white,
    borderRadius: 10,
    borderColor: appColours.black,
    borderWidth: 2
}

const buttonWrapperStyle: ViewStyle = {
    width: (windowDimensions.WIDTH * 0.6),
    marginTop: 20,
    alignItems: "center"
}

const inputCardStylings: types.CustomCardStyles = {
    width: (windowDimensions.WIDTH *  0.9),
    height: (windowDimensions.HEIGHT * 0.23),
    marginBottom: 20
}

const outputCardStylings: types.CustomCardStyles = {
    width: (windowDimensions.WIDTH *  0.9),
    height: (windowDimensions.HEIGHT * 0.23)
};

const customInputStyle:TextStyle = {
    width: "90%",
    height: (windowDimensions.HEIGHT * 0.1),
    fontSize:20
};

const customOutputStyle:TextStyle = {
    width: "90%",
    height: (windowDimensions.HEIGHT * 0.1),
    backgroundColor: "rgb(230,230,230)"
};

const textInputWrapper: ViewStyle = {
    alignItems: "center",
    justifyContent: "center",
    height: "65%"
};

const headerWrapper: ViewStyle = {
    height: "35%",
    flexDirection: "row"
};

const titleWrapper: ViewStyle = {

    width: "50%",
    justifyContent: "center",
    alignItems: "center"

};

const dropdownWrapper: ViewStyle = {

    width:"50%",
    justifyContent: "center",
    alignItems: "center"

}

const dropdownStyle = {
    buttonContainerStyle: {

        height: windowDimensions.HEIGHT * 0.06,
        width: windowDimensions.WIDTH * 0.4,
        backgroundColor: appColours.white,
        fontSize: 5,
        color: "black",
        padding: 0,
        margin: 0

    },
    dropdownContainerStyle: {

        height: windowDimensions.HEIGHT * 0.06,
        width: windowDimensions.WIDTH * 0.4,
        backgroundColor: appColours.white,

    },
    rowTextStyle: {

    },

    buttonTextStyle: {

    }
}


export default TranslateVocab;