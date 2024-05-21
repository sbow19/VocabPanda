/* eslint-disable */
import * as types from '@customTypes/types.d'

import React from 'react';
import {
    View,
    Text,
    ViewStyle,
    BackHandler,
    Alert,
} from 'react-native';
import AppButton from 'app/shared/app_button';
import ScreenTemplate from 'app/shared/homescreen_template';
import CoreStyles from 'app/shared_styles/core_styles';
import AdBanner from 'app/shared/ad_banner';
import ContentCard from 'app/shared/content_card';
import { CustomButtonStyles, CustomCardStyles, ProjectConfig } from 'app/types/types.d';
import windowDimensions from 'app/context/dimensions';
import appColours from 'app/shared_styles/app_colours';
import { Overlay } from '@rneui/base';

import CurrentUserContext from 'app/context/current_user';
import UserContent from 'app/database/user_content';

import DefaultAppSettingsContext from 'app/context/default_app_settings_context';

import ResultTable from "./project_table_template"
import BackendAPI from 'app/api/backend';
import { showMessage } from 'react-native-flash-message';

const ProjectView: React.FC = props=>{

    /* Current user context */

    const [currentUser,] = React.useContext(CurrentUserContext)

    /* default settings  */

    const [appSettings, setAppSettingsHandler] = React.useContext(DefaultAppSettingsContext)

    /* Options Overlay state */

    const [optionsVisible, setOptionsVisible] = React.useState(false)

    /* Get project name */

    const project = props.route.params.project;


    React.useEffect(() => {

        /* reset state on hardware back press*/
        const backAction = () => {
          props.navigation.reset(({
            index:0,
            routes: [{ name: 'choose project' }],
            key: null
          }))
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
    
        return () => backHandler.remove();
    }, []);

   
    /* Navigate to game */

    const nav = ()=>{

        props.navigation.navigate("game", {
            screen: "game home",
            params: {
                reDirectContent: true,
                gameMode: "By Project",
                project: project,
                resultArray: props.route.params.resultArray
            }

        })
    }
    
    const deleteWarning = ()=>{
        Alert.alert(
            "Warning",
            `Are you sure you want to permanently delete ${project}?`,
            [
                {
                    text: "Back",
                    onPress: ()=>{
                        console.log("Go back")
                    }
                },
                {
                    text: "Delete Project",
                    onPress: async ()=>{

                        try{

                            //Delete project from database - CHECK IF CASCADES TO ENTRIES CORRECTLY
                            await UserContent.deleteProject(currentUser, project)

                            /*Remove project from default settings - all dropdowns*/

                            setAppSettingsHandler(project, "deleteProject")

                            props.navigation.reset(({
                                index:0,
                                routes: [{ name: 'choose project' }],
                                key: null
                            }));

                            
                            //Send project details to backend or retain here.
                            //Handle backend communication errors seperately here
                            UserContent.getUserId(currentUser)
                            .then((userId: string)=>{

                                const projectDetails: types.ProjectDetails = {
                                    projectName: project,
                                    userId: userId,
                                    targetLanguage: "",
                                    outputLanguage: ""
                                }

                                const deleteProjectObject: types.APIProjectObject = {

                                    projectDetails: projectDetails,
                                    updateType: "remove"
                                }

                                BackendAPI.sendProjectInfo(deleteProjectObject)
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

                            showMessage({
                                type: "warning",
                                message: "Unable to delete project"
                            })

                        }
                        
                        

                    }
                }
            ],
            {
                cancelable: true
            }
        )
    }

    return(
        <View style={CoreStyles.defaultScreen}>

            <ScreenTemplate
                screenTitle={project}
            >

                <View
                    style={customCardStyling}
                >

                    <ResultTable 
                    {...props} 
                    searchResults={props.route.params.resultArray} 
                    />

                </View>

                <View style={{marginTop:-18, flexDirection:"row", justifyContent:"space-evenly", width:windowDimensions.WIDTH,}}>

                    <View
                     style={{
                        width: windowDimensions.WIDTH*0.3,
                        height: windowDimensions.HEIGHT*0.08,
                        
                    }}>
                         <AppButton
                            onPress={()=>{props.navigation.reset(
                                ({
                                index:0,
                                routes: [{ name: 'choose project' }],
                                key: null
                                })
                            )}}
                            
                            customStyles={backButton}
                        >
                            <Text style={
                                [
                                
                                    CoreStyles.actionButtonText,
                                    {color: appColours.black}
                                ]
                            }
                            >Go Back
                            </Text>

                        </AppButton>
                    </View>

                    <View
                     style={{
                        width: windowDimensions.WIDTH*0.3,
                        height: windowDimensions.HEIGHT*0.08
                    }}>
                        <AppButton
                            onPress={()=>{
                                setOptionsVisible(true)
                            }}
                        >
                            <Text style={CoreStyles.actionButtonText}>Options</Text>
                        </AppButton>
                    </View>

                    <View
                     style={{
                        width: windowDimensions.WIDTH*0.3,
                        height: windowDimensions.HEIGHT*0.08
                    }}>
                        <AppButton
                            customStyles={playButton}     
                            onPress={()=>nav()}
                        >
                            <Text style={CoreStyles.actionButtonText}>Play</Text>
                        </AppButton>
                    </View>
                   

                    

                    
                </View>
            </ScreenTemplate>

            {!appSettings.premium.premium ? <AdBanner/>:null}

            <Overlay
                isVisible={optionsVisible}
                overlayStyle={overlayStyle}
            >

                <ContentCard
                    cardStylings={buttonCardStyling}
                >
                      <View
                     style={{
                        width: windowDimensions.WIDTH*0.3,
                        height: windowDimensions.HEIGHT*0.08,
                        
                    }}>
                        <AppButton
                            onPress={deleteWarning}
                            customStyles={CoreStyles.deleteButtonColor}
                        >
                            <Text 
                                style={CoreStyles.actionButtonText}
                            >Delete Project</Text>
                        </AppButton>
                    </View>

                    <View
                     style={{
                        width: windowDimensions.WIDTH*0.3,
                        height: windowDimensions.HEIGHT*0.08,
                        
                    }}>

                        <AppButton
                            onPress={()=>setOptionsVisible(false)}
                        >
                            <Text 
                                style={CoreStyles.actionButtonText}
                            >Export</Text>
                        </AppButton>

                    </View>
                    

                    

                </ContentCard>

                <View

                    style={{flexDirection:"row", flex: 1, justifyContent:"center"}}
                >
               

                    <AppButton
                        onPress={()=>setOptionsVisible(false)}
                        customStyles={backButton}
                    >
                        <Text 
                            style={
                                [
                                
                                    CoreStyles.actionButtonText,
                                    {color: appColours.black}
                                ]
                            }
                        >Close</Text>
                    </AppButton>

                </View>
                


            </Overlay>
        </View>
    )
}

const customCardStyling: ViewStyle = {

    width: windowDimensions.WIDTH * 1,
    height: windowDimensions.HEIGHT * 0.6,
    margin: 20,
    // borderColor: "black",
    // borderWidth: 2

}

const backButton: CustomButtonStyles = {
    backgroundColor: appColours.white
}

const playButton: CustomButtonStyles = {
    backgroundColor: appColours.darkGreen,
}

const overlayStyle: ViewStyle = {

    height: windowDimensions.HEIGHT * 0.35,
    width: windowDimensions.WIDTH * 0.85,
    backgroundColor: appColours.white,
    borderRadius: 10,
    borderColor: appColours.black,
    borderWidth: 2,
    justifyContent: "space-evenly"
}

const buttonCardStyling: CustomCardStyles = {

    flexDirection: "row",
    width: windowDimensions.WIDTH * 0.75,
    height: windowDimensions.HEIGHT*0.22,
    marginBottom:  10,
    alignItems: "center",
    justifyContent: "space-evenly"
}


export default ProjectView;