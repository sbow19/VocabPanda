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
import { CustomCardStyles } from "app/types/types.d";
import CurrentUserContext from "app/context/current_user";
import EditTextContext from "app/context/edit_text_context"

import UserContent from "app/database/user_content";
import { showMessage } from "react-native-flash-message";
import BufferFlushingContext from 'app/context/buffer_flushing';
import BufferManager from "app/api/buffer";

import * as types from '@customTypes/types.d'

const OptionsOverlay: React.FC = props=>{

    //Options overlay object 
    const optionsOverlayObject = React.useContext(OptionsOverlayContext);

    /* Buffer flush state */
    const [bufferFlushState, setBufferFlushingState] = React.useContext(BufferFlushingContext);

    //Edit entries overlay object

    const editOverlayObject = React.useContext(EditTextContext);

    const currentEntryId = optionsOverlayObject.currentEntryId; 

    const [currentUser] = React.useContext(CurrentUserContext) ;

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
                        onPress={async()=>{

                            try{

                                await UserContent.deleteEntry(currentUser.userId, currentEntryId); //Delete entry locally

                                const deletedEntry: types.EntryDetails = {
                                    dataType: "entry",
                                    entryId: currentEntryId
                                }
                                
                                if(bufferFlushState){
                                    //If buffer currently being flushed, then add to secondary queue
                                    await BufferManager.storeRequestSecondaryQueue(currentUser.userId, deletedEntry, "remove");
                
                                }else if(!bufferFlushState){
                                    //If buffer not currently being flushed, then add to main queue
                                    await BufferManager.storeRequestMainQueue(currentUser.userId, deletedEntry, "remove");
                
                                }
                                

                                props.setDeletedRowId(currentEntryId); //Current entry id set as deleted row id

                            }catch(e){

                                showMessage({
                                    message: "Some error occurred while deleting entry.",
                                    type: "warning"
                                })

                            }finally{

                                optionsOverlayObject.setOptionsOverlayVisible(!optionsOverlayObject.visible); //Close options overlay

                            }
                            
                        }}
                    >
                        <Text
                            style={CoreStyles.actionButtonText}
                        >Delete</Text>
                    </AppButton>

                    <AppButton
                        onPress={()=>{
                            optionsOverlayObject.setOptionsOverlayVisible(!optionsOverlayObject.visible);     
                            editOverlayObject.setEditTextVisible(!editOverlayObject.visible);
                        }}
                    >
                        <Text
                            style={CoreStyles.actionButtonText}
                        >Edit</Text>
                    </AppButton>
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