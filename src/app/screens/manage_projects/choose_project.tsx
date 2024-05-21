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


import UserContent from 'app/database/user_content';
import DefaultAppSettingsContext from 'app/context/default_app_settings_context';
import CurrentUserContext from 'app/context/current_user';

import Dropdown from 'app/shared/dropdown';
import { showMessage } from 'react-native-flash-message';

import UpgradePrompt from 'app/premium/upgrade_overlay';
import ActivityIndicatorStatus from 'app/context/activity_indicator_context';
import BackendAPI from 'app/api/backend';



const ChooseProject: React.FC<types.CustomDropDownProps> = props=>{

    
    /* Set upgrade prompt  */

    const [upgradePrompt, setUpgradePrompt] = React.useState(false);

    const [currentUser] = React.useContext(CurrentUserContext);

    const [currentProjectSelection, setCurrentProjectSelection] = useState("");

    const [overlayVisible, setOverlayVisible] = useState(false);

    const [appSettings, setAppSettingsHandler] = React.useContext(DefaultAppSettingsContext);


    /* States for target language and output language */

    const [targetLanguage, setTargetLanguage] = React.useState(appSettings.dropDownTargetLanguage);

    const [outputLanguage, setOutputLanguage] = React.useState(appSettings.dropDownOutputLanguage);

    //Get in game activity indicator

    const [, setActivityIndicator] = React.useContext(ActivityIndicatorStatus);


    const navHandler = async()=>{

        /* Set up alert here */

        if(!currentProjectSelection){

            showMessage({
                type: "info",
                message: "Please select a project"
            })
            return
        } else {

            const resultArray = await UserContent.getProjectEntries(currentUser, currentProjectSelection);

            props.navigation.navigate("project view", {

                screen: "project view",
                project: currentProjectSelection,
                resultArray: resultArray
                
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
            <UpgradeBanner {...props}/>
            <ScreenTemplate
                screenTitle="Manage Projects"
            >
                <ContentCard
                    cardStylings={topCardCustomStylings}
                >
                    <View style={{flex:1, justifyContent: "space-evenly", alignItems:"center"}}>
                    
                        <View>
                            <ProjectDropdown
                                defaultButtonText='Choose Project'
                                setSelection={setCurrentProjectSelection}
                            />
                        </View>
                        <View
                         style={{
                            width: windowDimensions.WIDTH*0.3,
                            height: windowDimensions.HEIGHT*0.08
                        }}
                        >
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
            {!appSettings.premium.premium ? <AdBanner/>:null}

            <Formik
                initialValues={{projectName: ""}}
                onSubmit={async(values, actions)=>{

                    const projectObject: types.ProjectDetails = {

                        projectName: values.projectName,
                        targetLanguage: targetLanguage,
                        outputLanguage: outputLanguage
                    }


                    //Check whether max project no has been reached

                    const projectLength = appSettings.projects?.length;

                    if(projectLength >= 20){

                        //Premium users have maximum of  20 projects
                        showMessage({
                            type: "warning",
                            message: "Maximum amount of projects reached"
                        });

                    } else 
                    if (projectLength >= 10  && !appSettings.premium.premium){

                        //Free users have maximum of ten projects
                        setUpgradePrompt(true);

                    } else 
                    if(projectLength < 10){

                        try{

                            setActivityIndicator(true);
                            await UserContent.addProject(currentUser, projectObject);
                            setActivityIndicator(false);

                            setAppSettingsHandler(projectObject, "addProject");

                            showMessage({
                                type: "info",
                                message: "Project added successfully!."
                            })

                           
                            //Send project details to backend or retain here.
                            //Handle backend communication errors seperately here
                            UserContent.getUserId(currentUser)
                            .then((userId: string)=>{

                                projectObject.userId = userId

                                const newProjectDetailsObject: types.APIProjectObject = {

                                    projectDetails: projectObject,
                                    updateType: "create"
                                }

                                BackendAPI.sendProjectInfo(newProjectDetailsObject)
                                .then((projectAPIResponseObject)=>{

                                    console.log(projectAPIResponseObject)

                                })
                                .catch((projectAPIResponseObject)=>{

                                    console.log(projectAPIResponseObject) 

                                });

                            })
                            .catch((e)=>{

                                console.log(e, "Unable to get user id");
                                
                            })

                        }catch(e){
                            setActivityIndicator(false)

                            showMessage({
                                type: "warning",
                                message: "Unable to add new project"
                            })

                        }
                        
                        actions.resetForm()
                    }
                
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
                            <View
                            style={{
                                width: windowDimensions.WIDTH*0.4,
                                height: windowDimensions.HEIGHT*0.08
                            }}>
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
                            </View>
                            
                            <View
                            style={{
                                width: windowDimensions.WIDTH*0.3,
                                height: windowDimensions.HEIGHT*0.08
                            }}>
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

                         
                        </View>
                </Overlay>                
                </>)}
           
            </Formik>
             {/* upgrade prompt */}
             {upgradePrompt ? <UpgradePrompt {...props} reason="Project Limit" setVisibleFunction={()=>{setUpgradePrompt(false)}}/> : null}

        </View>
    )
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
    height: windowDimensions.HEIGHT * 0.48,
    width: windowDimensions.WIDTH * 0.92,
    backgroundColor: appColours.white,
    borderRadius: 10,
    borderColor: appColours.black,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
}

const backButton: types.CustomButtonStyles ={
   backgroundColor: appColours.white
}

const addProjectCardStyles: types.CustomCardStyles ={

    height: windowDimensions.HEIGHT * 0.34,
    width: windowDimensions.WIDTH * 0.85,
    marginBottom: 24
}

const  projectNameScheme = yup.object({

    projectName: yup.string()
        .max(12)
        .min(4)
})


export default ChooseProject;