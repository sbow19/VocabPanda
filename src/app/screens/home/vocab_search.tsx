/* eslint-disable */

import * as types from '@customTypes/types.d'

import React, { useContext } from 'react';
import {
    View,
    Text,
    ViewStyle
} from 'react-native';
import CoreStyles from '@styles/core_styles';

import ScreenTemplate from 'app/shared/homescreen_template';
import VocabPandaTextInput from '@shared/text_input';
import ProjectDropdown from 'app/shared/project_dropdown';

import ContentCard from '@shared/content_card'

import AdBanner from '@shared/ad_banner';
import windowDimensions from 'app/context/dimensions';
import AppButton from 'app/shared/app_button';

import { Formik } from 'formik';
import * as yup from 'yup'
import UpgradeBanner from 'app/shared/upgrade_banner';
import DefaultAppSettingsContext from 'app/context/default_app_settings_context';
import CurrentUserContext from 'app/context/current_user';


import { showMessage } from 'react-native-flash-message';

import UserContent from 'app/database/user_content';

const VocabSearch: React.FC<types.CustomButtonStylesProp> = props=>{

    /* Get project context */
    const [appSettings,] = React.useContext(DefaultAppSettingsContext)

    const [projectList,] = React.useState<Array<types.ProjectDetails>>([]);

    const [currentProjectSelection, setCurrentProjectSelection] = React.useState<string>("");

    /* Get current user context */
    const [currentUser,] = React.useContext(CurrentUserContext)

    const searchProjectHandler = async ()=>{

        if(!currentProjectSelection){

            showMessage({
                type: "info",
                message: "Please select a project"
            })
            return
        } else {

            //Get entries linked to a project
            const resultArray = await UserContent.getProjectEntries(currentUser.userId, currentProjectSelection)

            props.navigation.navigate("results", {
                
                resultArray: resultArray,
                project: currentProjectSelection,
                gameMode: "By Project"
                
            })
        }
    }

    const searchEntryHandler = async (searchTerm:string)=>{

        if(!searchTerm){

            showMessage({
                type: "info",
                message: "Please type search input"
            })
            return
        } else {

            try{
                const resultArray = await UserContent.searchTerm(currentUser.userId, searchTerm)

                if(resultArray.length === 0){
                    //No entries found
                    showMessage({
                        type: "info",
                        message: "No entries found"
                    })
                }else if (resultArray.length > 0){
                    //Entries found
                    props.navigation.navigate("results", {
                    
                        resultArray: resultArray,
                        gameMode: "Search Results",
                        project: ""
                        
                    })
                }
            
            }catch(e){
                //If there is an error when searching the term
                showMessage({
                    type: "warning",
                    message: "There was an error when searching the term"
                })


            }

            
        }
    }


    return(
        
            <View style={[CoreStyles.defaultScreen, additionalStyles, {height: windowDimensions.HEIGHT}]}>

                {/* Render depending on upgrade status */}
                <UpgradeBanner {...props}/>

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

                            <Formik
                                initialValues={{input: ""}}
                                onSubmit={(values, actions)=>{

                                    searchEntryHandler(values.input)
                                    console.log(values.input)
                                    actions.resetForm()

                                }}
                                validationSchema={searchInputSchema}
                            >

                                {({values, handleChange, handleSubmit})=>(

                                    <>
                                        <View  style={{justifyContent:"center", flex:1.1} }>

                                            <VocabPandaTextInput 
                                                                        
                                            style={customTextInputStyle}
                                            placeholder='Type...'
                                            value={values.input}
                                            onChangeText={handleChange('input')}
                                            />

                                        </View>

                                        <View style={{justifyContent:"center", flex:1.2} }>
                                            <AppButton 
                                                onPress={handleSubmit}
                                            >
                                                <Text style={CoreStyles.actionButtonText}> Search </Text>
                                            </AppButton>
                                        </View>

                                    </>
                                )}

                            </Formik>


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
                            <ProjectDropdown
                                data={projectList}
                                defaultButtonText="Choose Project"
                                setSelection={setCurrentProjectSelection}
                            />
                        </View>

                        <View style={{justifyContent:"center", flex:1.2} }>
                            <AppButton
                                onPress={()=>{

                                    searchProjectHandler()
                                    
                                }
                                }
                            >
                                <Text style={CoreStyles.actionButtonText}> Search </Text>
                            </AppButton>
                        </View>
                    </ContentCard>
                    
                        
                </ScreenTemplate> 
                {!appSettings.premium.premium ? <AdBanner/>:null}
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

const searchInputSchema = yup.object({
    input: yup.string()
        .max(24)
})

export default VocabSearch;