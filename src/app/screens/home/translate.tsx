/* eslint-disable */

import * as types from '@customTypes/types.d'

import React, {useState} from 'react';
import {
    View,
    Text, 
    TextStyle,
    ViewStyle,
    Dimensions
} from 'react-native';
import Dropdown from 'app/shared/dropdown';
import ProjectDropdown from 'app/shared/project_dropdown';
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
import { Formik } from 'formik';

import BackendAPI from 'app/api/backend';
import BufferManager from 'app/api/buffer';

import * as yup from 'yup'
import UpgradeBanner from 'app/shared/upgrade_banner';

import CurrentUserContext from 'app/context/current_user';
import DefaultAppSettingsContext from 'app/context/default_app_settings_context';
import ActivityIndicatorStatus from 'app/context/activity_indicator_context';

import UserDetails from 'app/database/user_profile_details';
import UserContent from 'app/database/user_content';
import BufferFlushingContext from 'app/context/buffer_flushing';

import UpgradePrompt from 'app/premium/upgrade_overlay';
import PremiumChecks from 'app/premium/premium_checks';
import { showMessage } from 'react-native-flash-message';


const TranslateVocab: React.FC = props=>{
    /* Get current user context */
    
    const [currentUser, setCurrentUser] = React.useContext(CurrentUserContext)

    /* Current project list context */

    const [appSettings, appSettingsHandler] = React.useContext(DefaultAppSettingsContext)

    /* Set upgrade prompt  */

    const [upgradePrompt, setUpgradePrompt] = React.useState(false);

    /* Buffer flush state */
    const [bufferFlushState, setBufferFlushingState] = React.useContext(BufferFlushingContext);

    /* Language selections stored in local state but also set as default language */
    const [inputLangSelection, setInputLangSelection] = useState("");

    const handleInputLanguageSelection = (language: string)=>{

        setInputLangSelection(language);

        //Update default target language
        UserDetails.updateTargetLangDefault(currentUser.userId, language);

        //App settings handler
        appSettingsHandler(language, "defaultTargetLang")
    }

    const [outputLangSelection, setOutputLangSelection] = useState("");

    const handleOutputLanguageSelection = (language: string)=>{

        setOutputLangSelection(language);

        //Update default target language
        UserDetails.updateOutputLangDefault(currentUser.userId, language);

        //App settings handler
        appSettingsHandler(language, "defaultOutputLang")

    }

   /*  project selection for saving new text to project */
    const [projectSelection, setProjectSelection] = useState("");

    /* add to project overlay state  */
    const [overlayVisible, setOverlayVisible] = useState(false);

    //Get in game activity indicator

    const [, setActivityIndicator] = React.useContext(ActivityIndicatorStatus);


    /* Check the current search term */

    const currentSearchTerm = React.useRef("")


    const addToProjectHandler = async(input: string, output: string)=>{

        try{

            //Check whether max number of entries exceeded
            const responseObject: types.ProjectLengthResponseObject = await PremiumChecks.checkProjectLength(currentUser.userId, projectSelection, appSettings);

            if(responseObject.upgradeNeeded){

                setUpgradePrompt(true)

            } 
            else if(!responseObject.upgradeNeeded && responseObject.reason === "50 Limit"){

                showMessage({
                    type: "warning",
                    message: "50 entry limit reached"
                })
            } 
            else if(!responseObject.upgradeNeeded && responseObject.reason === ""){

                const entryObject: types.EntryDetails = {
                    targetLanguageText: input,
                    targetLanguage: inputLangSelection,
                    outputLanguageText: output,
                    outputLanguage: outputLangSelection,
                    project: projectSelection 
                };
        
                const {customResponse: entryId} = await UserContent.addNewEntry(currentUser, entryObject);

                showMessage({
                    type: "success",
                    message: "Entry added successfully!"
                });

                //Send new entry details to backend or retain here.
                //Handle backend communication errors seperately here
                const newEntryDetails = await UserContent.getEntryById(currentUser.userId, entryId)        

                if(bufferFlushState){
                    //If buffer currently being flushed, then add to secondary queue
                    await BufferManager.storeRequestSecondaryQueue(currentUser.userId, newEntryDetails, "entries");

                }else if(!bufferFlushState){
                    //If buffer not currently being flushed, then add to main queue
                    await BufferManager.storeRequestMainQueue(currentUser.userId, newEntryDetails, "entries");

                }
            }

        }catch(e){

            console.log(e);
            showMessage({
                type: "warning",
                message: "Error adding new entry!"
            })
        }

        /* Close overlay */
        setOverlayVisible(!overlayVisible)
    }

    React.useEffect(()=>{

        /* On initial render, set the default value of dropdowns to saved languages for current user */
        const getLanguageSettings = ()=>{

            console.log(appSettings, "Translate ")

            setInputLangSelection(appSettings.userSettings.defaultTargetLanguage);

            setOutputLangSelection(appSettings.userSettings.defaultOutputLanguage);
        }

        getLanguageSettings()


    }, [])


    return(

        <View style={CoreStyles.defaultScreen}>
             {/* Render upgrade banner depending on subscription status */}
             <UpgradeBanner {...props}/>
                <Formik
                    initialValues={{input: "", output: ""}}
                    onSubmit={()=>{

                        /* add to project */
                        setOverlayVisible(false);
                    
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
                                        customStyles={dropdownStyle}
                                        setSelection={handleInputLanguageSelection}
                                        defaultValue={inputLangSelection}
                                        defaultButtonText={inputLangSelection}
                                        
                                    />

                                </View>
                            </View>
                            <View style={textInputWrapper}>
                                <VocabPandaTextInput 
                                    style={customInputStyle} 
                                    numberOfLines={4} 
                                    editable={true}
                                    value={values.input}
                                    onChangeText={
                                        handleChange("input")
                                    }
                                    onSubmit={handleSubmit}
                                    onBlur={async(e) => {
                                        handleBlur('input')(e)

                                        /* short circuit when  */
                                        if(values.input.length <= 3 || values.input === currentSearchTerm.current){

                                            /**cancels translation logic */
                                            return
                                        }

                                        currentSearchTerm.current = values.input // Set new term searched

                                        /* Check if there are any translations left */
                                        if(appSettings.translationsLeft > 0){

                                            try{

                                                setActivityIndicator(true);

                                                const translationsResponse: types.APITranslateResponse = await BackendAPI.translate({
                                                    userId: currentUser.userId,
                                                    targetText: values.input,
                                                    outputLanguage: outputLangSelection,
                                                    targetLanguage: inputLangSelection
                                                });
    
                                                if(translationsResponse.success){
                                                    appSettingsHandler({
                                                        translationsLeft: translationsResponse.translationsLeft,
                                                        translationsRefreshTime: translationsResponse.translationRefreshTime
                                                    }, "subtractTranslation");

                                                    await setFieldValue("output", translationsResponse.translations.text);

                                                }

                                            }catch(e){

                                                const translationResponse = e as types.APITranslateResponse;

                                                if(translationResponse.message === "no internet"){

                                                   

                                                    showMessage({
                                                        message: "Internet is needed to make translations",
                                                        type: "warning"
                                                    })
                                                }else {

                                                    showMessage({
                                                        message: "There was some error making the translation",
                                                        type: "warning"
                                                    })

                                                }
                                            } finally{

                                                setActivityIndicator(false);
                                            }

                                           
                                        } else if (appSettings.translationsLeft === 0) {

                                            setUpgradePrompt(true)
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
                                        defaultButtonText={outputLangSelection}
                                        customStyles={dropdownStyle}
                                        setSelection={handleOutputLanguageSelection}
                                        defaultValue={outputLangSelection}
                                    />

                                </View>
                            </View>
                            <View style={textInputWrapper}>
                                <VocabPandaTextInput 
                                    style={customOutputStyle} 
                                    numberOfLines={4} 
                                    editable={true}
                                    placeholder='Output'
                                    maxLength={100}
                                    value={values.output}
                                    onChangeText={
                                        handleChange("output")
                                    }
                                />
                            </View>
                        
                        </ContentCard>

                        <View style={[CoreStyles.defaultScreen, buttonWrapperStyle]}>   

                                <CountdownCard/>

                                <View
                                    style={{
                                        width: windowDimensions.WIDTH * 0.3,
                                        height: 130,
                                        margin: 0, 
                                        padding: 0,
                                    }}
                                >
                                    <AppButton 
                                        customStyles={{width:120}} 
                                        onPress={()=>setOverlayVisible(!overlayVisible)}
                                    >
                                
                                        <Text style={CoreStyles.actionButtonText}>Add to project</Text>
                                                            
                                    </AppButton>    

                                </View>

                                    
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
                                        <ProjectDropdown
                                            data={appSettings.projects}
                                            defaultButtonText='Select Project'
                                            customStyles={dropdownStyle}
                                            setSelection={setProjectSelection}
                                        />
                                    </View>

                                </View>
                            </ContentCard>


                            <View style={{
                                flexDirection:"row", 
                                justifyContent: "space-evenly",
                                alignItems: "center",
                                height:windowDimensions.HEIGHT *0.1
                            }}>

                                <View
                                  style={{
                                    width: windowDimensions.WIDTH*0.3,
                                }}>
                                    <AppButton 
                                        onPress={
                                            ()=>{setOverlayVisible(!overlayVisible)}
                                        }
                                        customStyles={
                                            CoreStyles.backButtonColor
                                        }
                                    >
                                            <Text style={CoreStyles.backButtonText}>Close</Text>
                                    </AppButton>
                                </View>
                                <View
                                  style={{
                                    width: windowDimensions.WIDTH*0.3,
                                }}>
                                    <AppButton 
                                    onPress={()=>{
                                        addToProjectHandler(values.input, values.output) 
                                    }}>
                                        <Text style={CoreStyles.actionButtonText}>Add</Text>
                                    </AppButton>

                                </View>
                            </View>
                        </Overlay>   
                        </>
                    )}
                </Formik>
            
            {/* upgrade prompt */}
            {upgradePrompt ? <UpgradePrompt {...props} reason="20 Limit" setVisibleFunction={()=>{setUpgradePrompt(false)}}/> : null}
            {!appSettings.premium.premium ? <AdBanner/>:null}
        </View>
    )
}

function convertMilliseconds(milliseconds){

    let days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    let hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (60 * 1000 * 60))
    let minutes = Math.floor(((milliseconds % (1000 * 60 * 60 * 24)) % (60 * 1000 * 60)) / (1000 * 60))

    let remainingString = `${days} days : ${hours} hours : ${minutes} minutes`

    return remainingString
}

const CountdownCard = ()=>{

    /* Current project list context */

    const [appSettings, ] = React.useContext(DefaultAppSettingsContext);

    /* Timeleft */

    const [timeLeftDisplay, setTimeLeftDisplay] = React.useState(null);

    /* Timeleft on first referesh */

    const timeLeftInterval = React.useRef("");


    /* Timeleft string */

    const [timeLeftString, setTimeLeftString] = React.useState("")

    React.useMemo(()=>{

        const currentTime = new Date();
        const translationsRefreshTime = new Date(appSettings.translationsRefreshTime);

        if(translationsRefreshTime > currentTime){

            const timeLeft = translationsRefreshTime - currentTime;

            const timeLeftConverted = convertMilliseconds(timeLeft)

            setTimeLeftString(timeLeftConverted)

            setTimeLeftDisplay(timeLeft)

        } else {

            setTimeLeftDisplay(null)
        }
 
    }, [appSettings])

    React.useEffect(()=>{

        if(timeLeftDisplay != null){

            clearInterval(timeLeftInterval.current)

            timeLeftInterval.current = setInterval(()=>{

                setTimeLeftDisplay(prevTime => {

                    let prevTimeString = new Date(prevTime)
                    
                    let newTime = prevTimeString - 1000

                    let timeLeftConverted = convertMilliseconds(newTime)

                    setTimeLeftString(timeLeftConverted)

                    return newTime
                
                }    )

            }, 1000)
        }
    }, [appSettings])

    return(<>

        <View
            style={{
                width: windowDimensions.WIDTH * 0.5,
                height: 130,
                marginTop: 20, 
                marginRight: 10,
                padding: 0,
                
            }}
        >
            <Text
                style={[CoreStyles.contentText, {lineHeight:14, fontSize:12}]}
            >
                You have {appSettings.translationsLeft} translations left. 
                {timeLeftDisplay != null ? ` Your translations refresh in \n${timeLeftString}.` : null}
            </Text>
            
        </View>
    
    
    </>)
}

const cardStyle: types.CustomCardStyles = {

    width: windowDimensions.WIDTH * 0.75,
    height: windowDimensions.HEIGHT*0.15


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
    height: windowDimensions.HEIGHT * 0.02,
    width: (windowDimensions.WIDTH*0.8),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
}

const inputCardStylings: types.CustomCardStyles = {
    width: (windowDimensions.WIDTH *  0.9),
    height: (windowDimensions.HEIGHT * 0.23),
    marginBottom: (()=>{
        let {height} = Dimensions.get("window")
        return height*0.02
    })()
}

const outputCardStylings: types.CustomCardStyles = {
    width: (windowDimensions.WIDTH *  0.9),
    height: (windowDimensions.HEIGHT * 0.23),
    marginBottom: (()=>{
        let {height} = Dimensions.get("window")
        return height*0.06
    })()
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