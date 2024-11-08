/* eslint-disable */


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
import { CustomButtonStyles, CustomCardStyles } from 'app/types/types.d';
import windowDimensions from 'app/context/dimensions';
import appColours from 'app/shared_styles/app_colours';
import { Overlay } from '@rneui/base';

import ResultTable from "./table_template"

const ProjectView: React.FC = props=>{

    /* Overlay state */

    const [optionsVisible, setOptionsVisible] = React.useState(false)

    /* */

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

    /* Get project name */

    const project = props.route.params.project;

    /* Navigate to game */

    const nav = ()=>{

        props.navigation.navigate("game")
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
                    onPress: ()=>{
                        console.log("Delete project logic")

                        props.navigation.reset(({
                            index:0,
                            routes: [{ name: 'choose project' }],
                            key: null
                          }))
                    }
                }
            ],
            {
                cancelable: true
            }
        )
    }
    

    /* TODO - call code to get project information in*/
    /* TODO - render */

    return(
        <View style={CoreStyles.defaultScreen}>
            <ScreenTemplate
                screenTitle={project}
            >

                <View
                    style={customCardStyling}
                >

                    <ResultTable/>

                </View>

                <View style={{marginTop:-18, flexDirection:"row", justifyContent:"space-evenly", width:windowDimensions.WIDTH,}}>

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

                    <AppButton
                        onPress={()=>{
                            setOptionsVisible(true)
                        }}
                    >
                        <Text style={CoreStyles.actionButtonText}>Options</Text>
                    </AppButton>

                    <AppButton
                        customStyles={playButton}     
                        onPress={()=>nav()}
                    >
                        <Text style={CoreStyles.actionButtonText}>Play</Text>
                    </AppButton>
                </View>
            </ScreenTemplate>

            <AdBanner/>

            <Overlay
                isVisible={optionsVisible}
                overlayStyle={overlayStyle}
            >

                <ContentCard
                    cardStylings={buttonCardStyling}
                >

                    <AppButton
                        onPress={()=>{deleteWarning()}}
                        customStyles={{backgroundColor:"red"}}
                    >
                        <Text 
                            style={CoreStyles.actionButtonText}
                        >Delete Project</Text>
                    </AppButton>

                    <AppButton
                        onPress={()=>setOptionsVisible(false)}
                    >
                        <Text 
                            style={CoreStyles.actionButtonText}
                        >Export</Text>
                    </AppButton>

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