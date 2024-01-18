/* eslint-disable */

import * as types from '@customTypes/types.d'

import React, {useState, useContext} from 'react';
import {
    View,
    Text, 
    TextStyle,
    ViewStyle
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

import { languagesList } from 'app/shared/languages_list';


import { Overlay } from '@rneui/base';
import { showMessage } from 'react-native-flash-message';

import { Formik, useFormikContext } from 'formik';

import DeeplTranslate from 'app/api/translation_call';

import * as yup from 'yup'
import UpgradeBanner from 'app/shared/upgrade_banner';

const TranslateVocab: React.FC = props=>{
    
    /* temp data list wth languages */
    const languages: types.ProjectList = ["Spanish", "English"]

    /* Language selections stored in local state but also set as default languages */
    const [inputLangSelection, setInputLangSelection] = useState("");

    const handleInputLanguageSelection = (language: string)=>{

        setInputLangSelection(language);

        /* Add code to set default target  language */
    }

    const [outputLangSelection, setOutputLangSelection] = useState("");

    const handleOutputLanguageSelection = (language: string)=>{

        setOutputLangSelection(language);

        /* Add code to set default output language*/

    }

   /*  Output text */


    const [projectSelection, setProjectSelection] = useState("")

    /* overlay */
    const [overlayVisible, setOverlayVisible] = useState(false)

    const nav = ()=>{
        setOverlayVisible(!overlayVisible)
    }


    return(

        <View style={CoreStyles.defaultScreen}>
             {/* Render upgrade banner depending on subscription status */}
             <UpgradeBanner/>
                <Formik
                    initialValues={{input: "", output: ""}}
                    onSubmit={async(values, actions)=>{

                        /* add to project */
                        setOverlayVisible(false)

                        let response = await DeeplTranslate.translate({
                            targetText: values.input,
                            outputLanguage: "Spanish",
                            targetLanguage: "English"
                        })

                        if(response.text){
                            await actions.setFieldValue("output", response.text)
                        }
                    
                    }}
                    validationSchema={inputValidationSchema}
                >

                    {({values, handleChange, handleSubmit, handleBlur, setFieldValue})=>(
                        <>

                        <ScreenTemplate screenTitle="Translate">

                        <ContentCard cardStylings={inputCardStylings}>
                            <View style={headerWrapper}>
                                <View style={titleWrapper}>
                                    <Text style={[CoreStyles.contentText, {fontSize: 18}]}>Type to translate</Text>
                                </View>
                                <View style={dropdownWrapper}>

                                    <Dropdown
                                        data={languagesList()}
                                        defaultButtonText='Target Lang'
                                        customStyles={dropdownStyle}
                                        setSelection={handleInputLanguageSelection}
                                    />

                                </View>
                            </View>
                            <View style={textInputWrapper}>
                                <VocabPandaTextInput 
                                    style={customInputStyle} 
                                    numberOfLines={4} 
                                    editable={true}
                                    value={values.input}
                                    onChangeText={handleChange("input")}
                                    onSubmit={handleSubmit}
                                    onBlur={async(e) => {
                                        handleBlur('input')(e)

                                        let response = await DeeplTranslate.translate({
                                            targetText: values.input,
                                            outputLanguage: outputLangSelection,
                                            targetLanguage: inputLangSelection
                                        })

                                        console.log(response)

                                        if(response.text){
                                            await setFieldValue("output", response.text)
                                        }
                                      
                                    }}
                                />
                            </View>
                    
                        </ContentCard >
                            
                        <ContentCard cardStylings={outputCardStylings}>
                                <View style={headerWrapper}>
                                <View style={titleWrapper}>
                                    <Text style={[CoreStyles.contentText, {fontSize: 18}]}>Output</Text>
                                </View>
                                <View style={dropdownWrapper}>

                                    <Dropdown
                                        data={languagesList()}
                                        defaultButtonText='Output Lang'
                                        customStyles={dropdownStyle}
                                        setSelection={handleOutputLanguageSelection}
                                    />

                                </View>
                            </View>
                            <View style={textInputWrapper}>
                                <VocabPandaTextInput 
                                    style={customOutputStyle} 
                                    numberOfLines={4} 
                                    editable={false}
                                    placeholder='Output'
                                    maxLength={100}
                                    value={values.output}
                                />
                            </View>
                        
                        </ContentCard>

                        <View style={[CoreStyles.defaultScreen, buttonWrapperStyle]}>                
                                <AppButton 
                                    customStyles={{width:120}} onPress={nav}>
                            
                                    <Text style={CoreStyles.actionButtonText}>Add to project</Text>
                                                        
                                </AppButton>        
                        </View>  
                        </ScreenTemplate>

                        <Overlay
                            isVisible={overlayVisible}
                            overlayStyle={overlayStyle}
                        >

                            <ContentCard
                                cardStylings={cardStyle}
                            
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        flex: 1,
                                        width: "100%",
                                        justifyContent: "space-evenly",
                                        alignItems: "center"
                                    }}
                                
                                >
                                    <View>
                                        <Text
                                            style={ CoreStyles.contentText}

                                        
                                        >Select Project</Text>
                                    </View>
                                    <View>
                                        <Dropdown
                                            data={languages}
                                            defaultButtonText='Select Project'
                                            customStyles={dropdownStyle}
                                            setSelection={setProjectSelection}
                                        />
                                    </View>

                                </View>
                            </ContentCard>


                            <View style={{flexDirection:"row", justifyContent: "space-evenly"}}>

                                <AppButton onPress={()=>{setOverlayVisible(!overlayVisible)}}>
                                        <Text style={CoreStyles.actionButtonText}>Close</Text>
                                </AppButton>

                                <AppButton 
                                    onPress={handleSubmit}>
                                        <Text style={CoreStyles.actionButtonText}>Add</Text>
                                </AppButton>

                            </View>
                        
                        
                        </Overlay>   
                        
                        </>
                    )}
   
                </Formik>
            <AdBanner/>
        </View>
    )
}

const cardStyle: types.CustomCardStyles = {

    width: windowDimensions.WIDTH * 0.75


}

const overlayStyle: ViewStyle = {
    height: windowDimensions.HEIGHT * 0.30,
    width: windowDimensions.WIDTH * 0.85,
    backgroundColor: appColours.white,
    borderRadius: 10,
    borderColor: appColours.black,
    borderWidth: 2,
    justifyContent: "space-evenly"
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
    fontSize:18,
    lineHeight: 20
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

}

const inputValidationSchema = yup.object({

    input: yup.string()
        .max(50)
})


export default TranslateVocab;