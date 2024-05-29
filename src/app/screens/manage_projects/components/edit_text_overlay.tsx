/* eslint-disable */

import { Overlay, fonts } from "@rneui/base"
import AppButton from "app/shared/app_button"
import { 
    Text, 
    ViewStyle, 
    View } 
from "react-native"
import CoreStyles from "app/shared_styles/core_styles"
import appColours from "app/shared_styles/app_colours"
import React from 'react'
import EditTextContext from "app/context/edit_text_context"
import windowDimensions from "app/context/dimensions"
import ContentCard from "app/shared/content_card"
import { CustomCardStyles } from "app/types/types.d"
import VocabPandaTextInput from '@shared/text_input';

import { Formik } from 'formik';
import * as yup from 'yup'
import UserContent from "app/database/user_content"
import CurrentUserContext from "app/context/current_user"
import ActivityIndicatorStatus from "app/context/activity_indicator_context"
import { showMessage } from "react-native-flash-message"
import BufferFlushingContext from 'app/context/buffer_flushing';
import BufferManager from "app/api/buffer"
import * as types from '@customTypes/types.d'



const EditTextView: React.FC  = props=>{

    const editTextOverlayObject = React.useContext(EditTextContext);
    const [currentUser] = React.useContext(CurrentUserContext) ;
    const [,setActivityIndicator] = React.useContext(ActivityIndicatorStatus);

    /* Buffer flush state */
    const [bufferFlushState, setBufferFlushingState] = React.useContext(BufferFlushingContext);


    const entryToEdit = editTextOverlayObject.entryToEdit;

    return(
        <Overlay
            isVisible={editTextOverlayObject.visible}
            overlayStyle={overlayStyle}
            backdropStyle={{
                opacity: 0.1
            }}
        >
            <Formik
                initialValues={
                    {
                        targetText: entryToEdit["targetLanguageText"], 
                        outputText: entryToEdit["outputLanguageText"] 
                    }
                }
                onSubmit={()=>{
                    editTextOverlayObject.setEditTextVisible(!editTextOverlayObject.visible)
                }}
            >
                {({values, handleChange, handleSubmit, handleBlur})=>(

                <>
                <ContentCard
                    cardStylings={targetTextCard}
                >
                    <View
                        style= {cardTitleWrapper}
                    >
                        <Text
                            style={
                                [
                                    CoreStyles.contentTitleText,
                                    {fontSize: 18}
                                ]}
                        >
                            Target Language: {entryToEdit["targetLanguage"]}
                        </Text>
                    </View>
                    <View
                        style= {cardContentWrapper}
                    >
                        <VocabPandaTextInput
                            value={values.targetText}
                            editable={true}
                            maxLength={30}
                            style={[
                                customOutputStyle,
                                CoreStyles.contentText
                            ]}
                            onChangeText={
                                handleChange("targetText")
                            }
                            onBlur={()=>{
                                handleBlur("targetText")
                            }}
                        />
                
                    </View>

                </ContentCard>

                <ContentCard
                    cardStylings={outputTextCard}
                >
                    <View
                        style= {cardTitleWrapper}
                    >
                        <Text
                            style={
                                [
                                    CoreStyles.contentTitleText,
                                    {fontSize: 18}
                                ]}
                        >
                            Output Language: {entryToEdit["outputLanguage"]}
                        </Text>
                    </View>
                    <View
                        style= {cardContentWrapper}
                    >
                    
                            
                        <VocabPandaTextInput
                            value= {values.outputText}
                            editable={true}
                            maxLength={100}
                            style={[
                                customOutputStyle,
                                CoreStyles.contentText
                            ]}
                            onChangeText={
                                handleChange("outputText")
                            }
                            onBlur={()=>{
                                handleBlur("outputText")
                            }}
                        />

                    </View>

                </ContentCard>


                <View
                    style={{
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-evenly",
                        height: windowDimensions.HEIGHT * 0.06
                    }}
                >
                    <AppButton
                        onPress={()=>{
                            editTextOverlayObject.setEditTextVisible(!editTextOverlayObject.visible);
                
                            handleSubmit;
                        }}
                        customStyles={
                            [
                                CoreStyles.backButtonColor,
                            ]
                        }
                    >

                        <Text
                            style={CoreStyles.backButtonText}
                        >Close
                        </Text>
                    </AppButton>

                    <AppButton
                        onPress={async()=>{

                            editTextOverlayObject.setEditTextVisible(!editTextOverlayObject.visible);

                            try{

                                setActivityIndicator(true);

                                //Update user entry
                                await UserContent.updateEntry(
                                    currentUser.userId,
                                    entryToEdit["entryId"],
                                    values.targetText,
                                    entryToEdit["targetLanguage"],
                                    values.outputText,
                                    entryToEdit["outputLanguage"]
                                );

                                //Refetch details of entry

                                const updatedEntry = await UserContent.getEntryById(
                                    currentUser.userId,
                                    entryToEdit["entryId"]
                                );

                                //Set entry to edit 

                                editTextOverlayObject.setEntryToEdit(updatedEntry);

                                showMessage({
                                    type: "success",
                                    message: "Entry updated sucessfully!"
                                });

                                //Send new entry details to backend or retain here.
                                //Handle backend communication errors seperately here
                                if(bufferFlushState){
                                    //If buffer currently being flushed, then add to secondary queue
                                    await BufferManager.storeRequestSecondaryQueue(currentUser.userId, updatedEntry, "update");
                
                                }else if(!bufferFlushState){
                                    //If buffer not currently being flushed, then add to main queue
                                    await BufferManager.storeRequestMainQueue(currentUser.userId, updatedEntry, "update");
                
                                }


                            }catch(e){

                                showMessage({
                                    type:"warning",
                                    message: "Entry update failed."
                                })

                            }finally{
                                setActivityIndicator(false);
                            }
                            
                        }}
                        
                    >
                        <Text
                            style={
                                CoreStyles.actionButtonText
                        }>
                            Save
                        </Text>
                    </AppButton>
                </View>
                </>

                )}

            </Formik>

        </Overlay>
    )
}

const overlayStyle: ViewStyle = {

    height: windowDimensions.HEIGHT * 0.55,
    width: windowDimensions.WIDTH * 0.9,
    backgroundColor: appColours.white,
    borderRadius: 10,
    borderColor: appColours.black,
    borderWidth: 2,
    justifyContent: "space-evenly"
    
}

const targetTextCard: CustomCardStyles = {

    height: windowDimensions.HEIGHT * 0.2,
    width: windowDimensions.WIDTH * 0.8,
    marginBottom: 10

}

const outputTextCard: CustomCardStyles = {

    height: windowDimensions.HEIGHT * 0.2,
    width: windowDimensions.WIDTH * 0.8,
    marginBottom: 10

}

const customOutputStyle:TextStyle = {
    width: "90%",
    height: (windowDimensions.HEIGHT * 0.1),
    backgroundColor: "rgba(250,250,250, 0.9)",
    
};

const cardTitleWrapper: ViewStyle ={

    height: windowDimensions.HEIGHT * 0.05,
    width: windowDimensions.WIDTH * 0.79,

}

const cardContentWrapper: ViewStyle = {

    height: windowDimensions.HEIGHT * 0.14,
    width: windowDimensions.WIDTH * 0.79

}
export default EditTextView