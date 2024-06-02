/* eslint-disable */

import * as types from '@customTypes/types.d'

import React, { useContext } from 'react';
import {
    ScrollView,
    View,
    ViewStyle, 
    Text,
    Alert,
} from 'react-native';
import CoreStyles from '@styles/core_styles';
import ContentCard from 'app/shared/content_card';
import windowDimensions from 'app/context/dimensions';
import AppButton from 'app/shared/app_button';
import AppOverlay from 'app/shared/app_overlay';
import LoggedInStatus from 'app/context/loggedIn';
import VocabPandaTextInput from 'app/shared/text_input';
import { Formik } from 'formik';

import CurrentUserContext from 'app/context/current_user';

import { showMessage } from 'react-native-flash-message';

import * as yup from 'yup'
import UserDetails from 'app/database/user_profile_details';

import DefaultAppSettingsContext from 'app/context/default_app_settings_context';
import BackendAPI from 'app/api/backend';
import UserContent from 'app/database/user_content';

const changePasswordSchema = yup.object({
    newPassword: yup.string()
    .required()
    .min(8, "Password must have at least 8 characters")
    .max(24, "Password can have no more than 24 characters")
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\/\\])/,
        "Must contain one uppercase, one lowercase, one number and one special character"
      ),

reNewPassword: yup.string()
    .required()
    .min(8)
    .max(16)
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
})

const Account: React.FC = props=>{

    /* Get sign in context here */
    const [, setIsLoggedIn] = React.useContext(LoggedInStatus)

    /* App settings */

    const [appSettings, setAppSettings] = React.useContext(DefaultAppSettingsContext)


    /* Password overlay visible state */
    const [passwordOverlay, setPasswordOverlay] = React.useState(false)

    /* Password overlay visible state */
    const [deleteAccountOverlay, setDeleteAccountOverlay] = React.useState(false)

    /* current user context */

    const [currentUser, setCurrentUser] = useContext(CurrentUserContext)


    /* Triggers on sign out */
    const signOutAlert = ()=>{

        Alert.alert(
            "Sign out",
            "Are you sure you want to sign out?",
            [
                {
                    text: "Go back",
                    onPress: ()=>{}
                },
                {
                    text: "Sign out",
                    onPress: ()=>{
                        /* trigger sign out procedure */
                        setIsLoggedIn(false);
                        setCurrentUser({}); //Reset current user
                        setAppSettings({}); //reset app settings
                    }
                }
            ],
            {
                cancelable: true
            }
        )

    }

    return (
        <ScrollView
        contentContainerStyle={[{ flexGrow: 1 }, {marginTop: 10}]}      
        >
            <View style={
                [
                    CoreStyles.defaultScreen,
                    {alignItems: "center"}
                ]}
            >

                {/* Sign out button container */}

                <ContentCard
                    cardStylings={signInCardStyle}
                
                >
                    <AppButton
                        customStyles={CoreStyles.backButtonColor}
                        onPress={signOutAlert}
                    >
                        <Text style={CoreStyles.backButtonText}> Sign Out </Text>
                    </AppButton>

                </ContentCard>

                {/* Set password container */}

                <ContentCard
                    cardStylings={manageCardStyle}
                >

                    <AppButton
                        customStyles={manageButtonStyle}
                        onPress={()=>{setPasswordOverlay(true)}}
                        
                    >
                        <Text style={[CoreStyles.actionButtonText]}> Change Password </Text>
                    </AppButton>

                </ContentCard>

                {/* Upgrade account button container */}

                <ContentCard
                    cardStylings={upgradeCardStyle}
                >
                    {/* Render if user is not premium */}

                    {appSettings.premium.premium ? 
                    
                    <>

                        <View>
                            <Text style={CoreStyles.contentText}> 
                                You have subscribed to Vocab Panda premium. Your subscription ends {appSettings.premium.endTime}. You can cancel your subscription at any time.
                            </Text>
                        </View>
                        <View
                        style={{
                            width: windowDimensions.WIDTH*0.3,
                            height: windowDimensions.HEIGHT*0.08
                        }}>
                            <AppButton
                                customStyles={
                                    CoreStyles.deleteButtonColor
                                }
                            >
                            <Text style={CoreStyles.actionButtonText}>
                                    Cancel
                            </Text> 
                            </AppButton>
                        </View>
                    
                    </> :

                    <>
                        <View>
                            <Text style={CoreStyles.contentText}> 
                                You are currently using the free version of Vocab Panda. For unlimited flashcard turns, translations, and more vocab storage, you can upgrade to premium for £7.99 per month!
                            </Text>
                        </View>
                        <View
                        style={{
                            width: windowDimensions.WIDTH*0.3,
                            height: windowDimensions.HEIGHT*0.08
                        }}>
                            <AppButton
                            >
                            <Text style={CoreStyles.actionButtonText}>
                                    Upgrade
                            </Text> 
                            </AppButton>
                        </View>
                    </>
                    }

                
                </ContentCard>

                {/* Delete account container*/}

                <ContentCard
                    cardStylings={signInCardStyle}
                >
                    <AppButton
                        customStyles={CoreStyles.deleteButtonColor}
                        onPress={()=>{
                            setDeleteAccountOverlay(true)
                        }}
                    >
                        <Text style={[CoreStyles.actionButtonText]}> Delete Account </Text>
                    </AppButton>
                    
                </ContentCard>



                {/* Set password overlay */}

                <AppOverlay
                    isVisible={passwordOverlay}
                    style={{
                        height: windowDimensions.HEIGHT*0.54
                    }}
                >
                    <Formik
                        initialValues={{oldPassword: "", newPassword: "", reNewPassword: ""}}
                        validationSchema={changePasswordSchema}
                        onSubmit={async (values)=>{
                            
                            /* Call change password function in default settings class */
                            
                            try{

                                const connectionStatus = await BackendAPI.checkInternetStatus();

                                if(!connectionStatus){

                                    showMessage({
                                        type: "warning",
                                        message: "Connection to internet required"
                                    })

                                }
                                else if(connectionStatus){

                                    //Send project details to backend or retain here.
                                    //Handle backend communication errors seperately here
                                    
                                    const updatePasswordObject: types.APIAccountObject<types.APIUpdatePassword> = {

                                        accountOperationDetails: {
                                            userId: currentUser.userId,
                                            newPassword: values.newPassword,
                                            oldPassword: values.oldPassword,
                                            dataType: "password"
                                        },
                                        operationType: "change password"
                                    };

                                    const accountAPIResponse = await BackendAPI.sendAccountInfo(updatePasswordObject); 
                                        
                                    console.log(accountAPIResponse);

                                    if(accountAPIResponse.success && accountAPIResponse.operationType === "change password"){

                                        const result = await UserDetails.changePassword(values.newPassword, currentUser.username); //Backend needs immediate acknowledgement from FE, otherwise transaction rolled back

                                        showMessage({
                                            message: "Password changed successfully",
                                            type: "success"
                                        });

                                    }  else if (!accountAPIResponse.success && accountAPIResponse.operationType === "change password"){

                                        showMessage({
                                            type: "warning",
                                            message: "Could not change password."
                                        })
                                    }
                                }                         

                        
                            }catch(e){

                                showMessage({
                                    message: "Unable to change password.",
                                    type: "info"
                                });

                            }

                            setPasswordOverlay(false);
                        }}
                    >

                        {({handleSubmit, values, handleChange, handleReset, errors})=>(

                        <>
                            <ContentCard
                            cardStylings={overlayCardStyle}
                            >
                                <View
                                    style={topPasswordContainer}
                                >
                                    <VocabPandaTextInput
                                        secureTextEntry={true}
                                        multiline={false}
                                        placeholder="Enter old password..."
                                        placeholderTextColor="grey"
                                        value={values.oldPassword}
                                        onChangeText={handleChange("oldPassword")}
                                    />
                                    <Text
                                        style={CoreStyles.errorText}
                                    >
                                        {values.oldPassword !== "" ? errors.oldPassword : ""}
                                    </Text>
                                </View>
                                <View
                                    style={topPasswordContainer}
                                >
                                    <VocabPandaTextInput
                                        secureTextEntry={true}
                                        multiline={false}
                                        placeholder="Enter password..."
                                        placeholderTextColor="grey"
                                        value={values.newPassword}
                                        onChangeText={handleChange("newPassword")}

                                    />
                                     <Text
                                        style={CoreStyles.errorText}
                                     >
                                        {values.newPassword !== "" ? errors.newPassword : ""}
                                    </Text>
                                </View>
                                <View
                                    style={bottomPasswordContainer}
                                >
                                    <VocabPandaTextInput
                                        secureTextEntry={true}
                                        multiline={false}
                                        placeholder="Re-enter password..."
                                        placeholderTextColor="grey"
                                        value={values.reNewPassword}
                                        onChangeText={handleChange("reNewPassword")}
                                    />
                                    <Text
                                        style={CoreStyles.errorText}
                                    >
                                        {values.reNewPassword !== "" ? errors.reNewPassword : ""}
                                    </Text>
                                </View>

                            </ContentCard>

                            <View style={{flex:1, flexDirection: "row", justifyContent: "space-evenly"}}>
                                <AppButton
                                    customStyles={CoreStyles.backButtonColor}
                                    onPress={()=>{
                                        setPasswordOverlay(false)
                                    }}
                                >
                                    <Text style={CoreStyles.backButtonText}>
                                        Close
                                    </Text>

                                </AppButton>

                            <AppButton
                                onPress={()=>{
                                    handleSubmit()}}
                            >
                                <Text style={CoreStyles.actionButtonText}>
                                    Set
                                </Text>
                            </AppButton>

                            </View>
                        </>

                        )}
                    
                    </Formik>
                </AppOverlay>


                {/* Delete account warning */}


                <Formik
                    initialValues={{password: ""}}
                    onSubmit={async (values, actions)=>{

                        try{

                            //Send project details to backend or retain here.
                            //Handle backend communication errors seperately here
                    
                            const deleteAccountObject: types.APIAccountObject<types.APIDeleteAccount> = {

                                accountOperationDetails: {
                                    userId: currentUser.userId,
                                    password: values.password,
                                    dataType: "account"
                                },
                                operationType: "delete account"
                            };
                            

                            const accountAPIResponse = await BackendAPI.sendAccountInfo(deleteAccountObject);
                            
                            if(accountAPIResponse.success && accountAPIResponse.operationType === "delete account"){

                                await UserDetails.deleteAccount(currentUser.userId, values.password);

                                showMessage({
                                    message: "account successfully deleted",
                                    type: "info"
                                });

                                setIsLoggedIn(false);
                                setCurrentUser("");

                            }else if(!accountAPIResponse.success && accountAPIResponse.operationType === "delete account"){

                                //Some error with sending or receiving delete operation
                                throw accountAPIResponse

                            }
                            

                        }catch(e){

                            //Handle errors properly

                            showMessage({
                                type: "warning",
                                message: "Delete account failed"
                            })

                        }finally{

                            actions.resetForm();
                        }

                           
                                
                            

                            
                        
                    }}
                >

                    {({values, handleChange, handleSubmit})=>(
                    <>
                        <AppOverlay
                            isVisible={deleteAccountOverlay}
                            style={
                                {
                                    height: windowDimensions.HEIGHT*0.55,
                                    width: windowDimensions.WIDTH* 0.85,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }
                            }
                        >

                            <ContentCard
                                cardStylings={deleteCardStyle}
                                >
                                <View>
                                    <Text
                                        style={CoreStyles.contentText}
            
                                    >Are you sure you want to delete your account?
                                    
                                        {/* TODO -- stuff about membership if member */}
                                                
                                    </Text>
                                </View>

                                <VocabPandaTextInput
                                    secureTextEntry={true}
                                    multiline={false}
                                    placeholder="Enter password..."
                                    placeholderTextColor="grey"
                                    value={values.password}
                                    onChangeText={handleChange("password")}
                                />

                            </ContentCard>

                            <View style={{flex:1, flexDirection: "row", justifyContent: "space-evenly", width: "100%"}}>
                                <View
                                 style={{
                                    width: windowDimensions.WIDTH*0.3,
                                    height: windowDimensions.HEIGHT*0.08
                                }}>
                                    <AppButton
                                        customStyles={CoreStyles.backButtonColor}
                                        onPress={()=>setDeleteAccountOverlay(false)}
                                    >
                                        <Text style={CoreStyles.backButtonText}>
                                            Close
                                        </Text>

                                    </AppButton>
                                </View>
                                <View
                                 style={{
                                    width: windowDimensions.WIDTH*0.3,
                                    height: windowDimensions.HEIGHT*0.08
                                }}>
                                    <AppButton
                                        customStyles={CoreStyles.deleteButtonColor}
                                        onPress={handleSubmit}
                                    >
                                        <Text style={CoreStyles.actionButtonText}>
                                            Delete
                                        </Text>
                                    </AppButton>
                                </View>   
                            </View>
                        </AppOverlay>
                    </>
                    )}
                </Formik>
                

            
            </View>
        </ScrollView>
    )
}

const topPasswordContainer = {
    flex:  1,
    justifyContent: "flex-start",
    marginTop: 10
}

const bottomPasswordContainer = {
    flex:  1,
    justifyContent: "flex-start"
}

const signInCardStyle = {

    height: windowDimensions.HEIGHT*0.15,
    marginBottom: 20,
    width: windowDimensions.WIDTH * 0.9,
    alignItems:"center"
};

const manageCardStyle: types.CustomCardStyles = {

    height: windowDimensions.HEIGHT *0.2,
    width: windowDimensions.WIDTH * 0.9,
    marginBottom: 20,
    justifyContent: "space-evenly",
    alignItems:"center",
};

const manageButtonStyle: types.CustomButtonStyles = {

    width: windowDimensions.WIDTH * 0.42
}


const upgradeCardStyle: types.CustomCardStyles = {

    height: windowDimensions.HEIGHT * 0.3,
    marginBottom: 20,
    width: windowDimensions.WIDTH * 0.9,
    alignItems: "center",
    justifyContent: "space-evenly"
}

const deleteCardStyle: ViewStyle = {

    marginBottom: 20,
    width: windowDimensions.WIDTH * 0.75,
    height: windowDimensions.HEIGHT * 0.4,
    justifyContent: "space-evenly"


}


const overlayCardStyle: ViewStyle = {

    marginBottom: 20,
    width: windowDimensions.WIDTH * 0.75,
    height: windowDimensions.HEIGHT * 0.4,
    justifyContent: "flex-start"

}

export default Account;