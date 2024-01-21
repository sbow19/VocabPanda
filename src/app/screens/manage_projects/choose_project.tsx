/* eslint-disable */

import * as types from '@customTypes/types.d'
import React, {useState} from 'react';
import {
    View,
    Text,
    ViewStyle,
} from 'react-native';
import ProjectDropdown from 'app/shared/project_dropdown';
import AppButton from '@shared/app_button';
import CoreStyles from '@styles/core_styles';
import ScreenTemplate from '@shared/homescreen_template';
import ContentCard from 'app/shared/content_card';
import AdBanner from 'app/shared/ad_banner';
import windowDimensions from 'app/context/dimensions';
import { Overlay } from '@rneui/base'
import appColours from 'app/shared_styles/app_colours';
import VocabPandaTextInput from 'app/shared/text_input';

import { Formik } from 'formik';
import * as yup from 'yup'

import { languagesList } from 'app/shared/languages_list';
import UpgradeBanner from 'app/shared/upgrade_banner';

import AppSettings from 'app/storage/app_settings_storage';
import DefaultAppSettingsContext from 'app/context/default_app_settings_context';
import UserDatabaseContext from 'app/context/current_user_database';
import CurrentUserContext from 'app/context/current_user';

import Dropdown from 'app/shared/dropdown';
import LocalDatabase from 'app/database/local_database';
import { showMessage } from 'react-native-flash-message';



const ChooseProject: React.FC<types.CustomDropDownProps> = props=>{

    const [currentUser] = React.useContext(CurrentUserContext)

    const [currentProjectSelection, setCurrentProjectSelection] = useState("");

    const [overlayVisible, setOverlayVisible] = useState(false);

    const [appSettings, setAppSettingsHandler] = React.useContext(DefaultAppSettingsContext)


    /* States for target language and output language */

    const [targetLanguage, setTargetLanguage] = React.useState(appSettings.dropDownLanguages.targetLanguage)

    const [outputLanguage, setOutputLanguage] = React.useState(appSettings.dropDownLanguages.outputLanguage)

    /* Database object context */

    const [databaseObject, setDatabaseObject] = React.useContext(UserDatabaseContext)


    const navHandler = async()=>{

        /* Set up alert here */

        if(!currentProjectSelection){

            showMessage({
                type: "info",
                message: "Please select a project"
            })
            return
        } else {

            let resultArray = await LocalDatabase.getProjectEntries(databaseObject, currentProjectSelection)

            let resultListCleaned = ()=>{

                let listLength = resultArray.rows.length

                let listCleaned = []

                for(let i = 0; i < listLength ; i++ ){

                    listCleaned.push(resultArray.rows.item(i))
                }

                return listCleaned
            }

            props.navigation.navigate("project view", {

                screen: "project view",
                project: currentProjectSelection,
                resultArray: resultListCleaned()
                
            })
        }

        
    }

    const overlayNav = ()=>{
        setOverlayVisible(!overlayVisible)
    }

    return(
        <View style={{
            flex:1
        }}>
            <UpgradeBanner/>
            <ScreenTemplate
                screenTitle="Manage Projects"
            >
                <ContentCard
                    cardStylings={topCardCustomStylings}
                >
                    <View style={{flex:1, justifyContent: "space-evenly", alignItems:"center"}}>
                    
                        <View>
                            <ProjectDropdown 
                                data={[]} 
                                defaultButtonText='Choose Project'
                                setSelection={setCurrentProjectSelection}
                            />
                        </View>
                        <View>
                            <AppButton {...props} onPress={navHandler}>
                                <Text style={CoreStyles.actionButtonText}>Review</Text>
                            </AppButton>
                        </View>
                    </View>
                    
                    
                </ContentCard>

                <ContentCard
                    cardStylings={bottomCardCustomStylings}
                >
                    <AppButton
                        customStyles={customButtonStyling}
                        onPress={overlayNav}
                    >
                        <Text style={CoreStyles.actionButtonText}>Add New Project</Text>
                    </AppButton>

                </ContentCard>


                
            </ScreenTemplate>
            <AdBanner/>

            <Formik
                initialValues={{projectName: ""}}
                onSubmit={async(values, actions)=>{

                    const projectObject: types.ProjectObject = {

                        projectName: values.projectName,
                        targetLanguage: targetLanguage,
                        outputLanguage: outputLanguage
                    }

                    const projectConfig:types.ProjectConfig<types.ProjectObject> ={

                        project:{

                            projectName: values.projectName,
                            targetLanguage: targetLanguage,
                            outputLanguage: outputLanguage

                        },

                        mode: "add"
                       
                    }

                    await AppSettings.addProject(currentUser, projectObject)
                    setAppSettingsHandler(undefined,undefined,undefined, projectConfig)
                    actions.resetForm()
                    overlayNav()
                }}
                validationSchema={projectNameScheme}
            >

                {({values, handleChange, handleSubmit})=>(
                <>
                
                    <Overlay
                    isVisible={overlayVisible}
                    overlayStyle={overlayStyle}
                    >
            
                        <ContentCard
                            cardStylings={addProjectCardStyles}
                        
                        >
                            <View
                            
                            >
                                <View>
                                    <Text
                                        style={CoreStyles.contentText}
                                    >Project name</Text>
                                </View>
                                <View>
                                    <VocabPandaTextInput
                                        defaultValue='Type...'
                                        style={{
                                            width: windowDimensions.WIDTH * 0.54
                                        }}
                                        value={values.projectName}
                                        onChangeText={handleChange('projectName')}
                                    />
                                </View>

                            </View>

                            <View
                                
                            >
                                <View
                                >
                                    <Text
                                        style={CoreStyles.contentText}

                                    >Default target language</Text>
                                </View>
                                <View>
                                <Dropdown
                                        setSelection={setTargetLanguage}
                                        defaultButtonText='Target lang'
                                        data={languagesList()}
                                    />
                                </View>
                                
                            </View>

                            <View
                                
                            >
                                <View 
                    
                                >
                                    <Text
                                        style={CoreStyles.contentText}
                                    >Default output language</Text>
                                </View>
                                <View>
                                    <Dropdown
                                        defaultButtonText='Output lang'
                                        data={languagesList()}
                                        setSelection={setOutputLanguage}
                                        custom={dropdownStyles}
                                    
                                    />
                                </View>
                                
                            </View>
                        </ContentCard>

                        <View
                            style={{
                                flexDirection: "row",
                                flex: 1,
                                justifyContent: "center"
                            }}
                        
                        >
                            <AppButton 
                                onPress={overlayNav}
                                customStyles={backButton}
                            >
                                <Text
                                    style={[
                                        CoreStyles.actionButtonText,
                                        {color: appColours.black}
                                    ]}
                                >Close</Text>
                            </AppButton>

                            <AppButton 
                                onPress={handleSubmit}
                            >
                                <Text
                                    style={[
                                        CoreStyles.actionButtonText,
                                    ]}
                                >Add</Text>
                            </AppButton>
                        </View>
                </Overlay>
                
                </>)}
           
            </Formik>
        </View>
    )
}

const dropdownStyles:types.CustomDropDown = {


}

const topCardCustomStylings: types.CustomCardStyles ={
    width: windowDimensions.WIDTH * 0.9,
    height: windowDimensions.HEIGHT * 0.3,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "space-evenly",

}

const bottomCardCustomStylings: types.CustomCardStyles ={

    width: windowDimensions.WIDTH * 0.9,
    height: windowDimensions.HEIGHT * 0.32,
    alignItems: "center"

}

const customButtonStyling: types.CustomButtonStyles = {

    width: 150

}

const overlayStyle: ViewStyle = {
    height: windowDimensions.HEIGHT * 0.44,
    width: windowDimensions.WIDTH * 0.92,
    backgroundColor: appColours.white,
    borderRadius: 10,
    borderColor: appColours.black,
    borderWidth: 2
}

const backButton: types.CustomButtonStyles ={
   backgroundColor: appColours.white
}

const addProjectCardStyles: types.CustomCardStyles ={

    height: windowDimensions.HEIGHT * 0.32,
    width: windowDimensions.WIDTH * 0.85,
    marginBottom: 10
}

const  projectNameScheme = yup.object({

    projectName: yup.string()
        .max(12)
        .min(4)
})


export default ChooseProject;