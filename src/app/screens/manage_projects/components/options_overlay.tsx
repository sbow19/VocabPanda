/* eslint-disable*/

import { Overlay } from "@rneui/base";
import windowDimensions from "app/context/dimensions";
import AppButton from "app/shared/app_button";
import appColours from "app/shared_styles/app_colours";
import { 
    ViewStyle,
    Text,
    View
 } from "react-native";
 import React from 'react'
 import OptionsOverlayContext from "app/context/options_context";
import CoreStyles from "app/shared_styles/core_styles";
import ContentCard from "app/shared/content_card";
import { CustomButtonStylesProp, CustomCardStyles } from "app/types/types.d";
import EditTextContext from "app/context/edit_text_context";

const OptionsOverlay: React.FC = props=>{

    const optionsOverlayObject = React.useContext(OptionsOverlayContext)
    // const editTextOverlayObject = React.useContext(EditTextContext)

    return(

        <Overlay
            isVisible={optionsOverlayObject.visible}
            overlayStyle={overlayStyle}
            backdropStyle={{
                opacity: 0.1
            }}
        >

            <View
                style={topStyle}
            >
                <ContentCard
                    cardStylings={customCardStyling}
                >
                    <AppButton
                        customStyles={CoreStyles.deleteButtonColor}
                    >
                        <Text
                            style={CoreStyles.actionButtonText}
                        >Delete</Text>
                    </AppButton>

                    {/* <AppButton
                        onPress={()=>{
                            optionsOverlayObject.setOptionsOverlayVisible(!optionsOverlayObject.visible);     
                            editTextOverlayObject.setEditTextVisible(!editTextOverlayObject.visible)                 
                        }}
                    >
                        <Text
                            style={CoreStyles.actionButtonText}
                        >Edit</Text>
                    </AppButton> */}
                </ContentCard>


            </View>

            <View
                style={bottomStyle}
            >

                <AppButton
                    onPress={()=>{
                        optionsOverlayObject.setOptionsOverlayVisible(!optionsOverlayObject.visible)
                    }}
                    customStyles={CoreStyles.backButtonColor}
                
                >

                    <Text
                        style={CoreStyles.backButtonText}
                    >Close</Text>
                </AppButton>


            </View>
            


        </Overlay>
    )
}

const overlayStyle: ViewStyle = {

    height: windowDimensions.HEIGHT * 0.35,
    width: windowDimensions.WIDTH * 0.85,
    backgroundColor: appColours.white,
    borderRadius: 10,
    borderColor: appColours.black,
    borderWidth: 2,
    justifyContent: "space-evenly",
    alignItems: "center"
    
}

const topStyle: ViewStyle = {

    height: windowDimensions.HEIGHT * 0.2,
    width: windowDimensions.WIDTH * 0.8,
    justifyContent: "center",
    alignItems: "center"

}

const bottomStyle: ViewStyle = {

    height: windowDimensions.HEIGHT * 0.09,
    width: windowDimensions.WIDTH * 0.8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"


}

const customCardStyling: CustomCardStyles = {

    height: windowDimensions.HEIGHT * 0.2,
    width: windowDimensions.WIDTH * 0.8,
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center"

}

export default OptionsOverlay;