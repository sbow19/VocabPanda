/* eslint-disable */

import * as types from '@customTypes/types.d'
import React, {useState} from 'react';
import {
    View,
    Text
} from 'react-native';
import Dropdown from 'app/shared/dropdown';
import AppButton from '@shared/app_button';
import CoreStyles from '@styles/core_styles';
import ScreenTemplate from '@shared/homescreen_template';
import { Screen } from 'react-native-screens';
import ContentCard from 'app/shared/content_card';
import AdBanner from 'app/shared/ad_banner';
import windowDimensions from 'app/context/dimensions';
import { Overlay } from '@rneui/base'
import appColours from 'app/shared_styles/app_colours';

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
                <AppButton onPress={overlayNav}>
                    <Text>Close</Text>
                </AppButton>

            </Overlay>
            
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
    height: windowDimensions.HEIGHT * 0.3,
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
    height: windowDimensions.HEIGHT * 0.6,
    width: windowDimensions.WIDTH * 0.9,
    backgroundColor: appColours.white,
    borderRadius: 10,
    borderColor: appColours.black,
    borderWidth: 2
}


export default ChooseProject;