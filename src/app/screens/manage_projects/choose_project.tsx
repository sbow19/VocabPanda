/* eslint-disable */

import * as types from '@customTypes/types.d'
import React, {useState} from 'react';
import {
    View,
    Text,
    ViewStyle,
    TouchableOpacity
} from 'react-native';
import Dropdown from 'app/shared/dropdown';
import AppButton from '@shared/app_button';
import CoreStyles from '@styles/core_styles';
import ScreenTemplate from '@shared/homescreen_template';
import ContentCard from 'app/shared/content_card';
import AdBanner from 'app/shared/ad_banner';
import windowDimensions from 'app/context/dimensions';
import { Overlay } from '@rneui/base'
import appColours from 'app/shared_styles/app_colours';
import VocabPandaTextInput from 'app/shared/text_input';



const ChooseProject: React.FC<types.CustomDropDownProps> = props=>{

    /* define database response object */
    /* database loaded on first load and stored in cache */

    const data: types.ProjectList = ["First proj", "vocab", "Spain"];

    const [currentProjectSelection, setCurrentProjectSelection] = useState("");

    const [overlayVisible, setOverlayVisible] = useState(false)


    const nav = ()=>{

        /* Set up alert here */

        props.navigation.navigate("project view", {

            screen: "project view",
            project: currentProjectSelection
            
        })
    }

    const overlayNav = ()=>{

        setOverlayVisible(!overlayVisible)

    }

    return(
        <View style={{
            flex:1
        }}>
            <ScreenTemplate
                screenTitle="Choose Project"
            >
                <ContentCard
                    cardStylings={topCardCustomStylings}
                >
                    <View style={{flex:1, justifyContent: "space-evenly", alignItems:"center"}}>
                        <View>
                            <Text style={CoreStyles.contentTitleText}>Select Project</Text>
                        </View>
                        <View>
                            <Dropdown 
                                data={data} 
                                defaultButtonText='Choose Project'
                                setSelection={setCurrentProjectSelection}
                                customStyles={customStylesDropdown}
                            />
                        </View>
                        <View>
                            <AppButton {...props} onPress={nav}>
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
                                    defaultButtonText='Target lang'
                                    data={["Spanish", "English", "Portuguese"]}
                                
                                
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
                                    data={["Spanish", "English", "Portuguese"]}
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
                            onPress={overlayNav}
                        >
                            <Text
                                style={[
                                    CoreStyles.actionButtonText,
                                ]}
                            >Add</Text>
                        </AppButton>


                        
                    </View>
            </Overlay>
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

const customStylesDropdown: types.CustomDropDown = {
    buttonContainerStyle: {


    },
    dropdownContainerStyle: {
    

    },
    rowTextStyle: {
        


    },
    buttonTextStyle: {



    }
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


export default ChooseProject;