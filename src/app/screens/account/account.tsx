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

import * as yup from 'yup'
import AppLoginDetails from 'app/storage/user_profile_details';
import { showMessage } from 'react-native-flash-message';

const changePasswordSchema = yup.object({
    password: yup.string()
    .required()
    .min(8, "Password must have at least 8 characters")
    .max(24, "Password can have no more than 24 characters")
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\/\\])/,
        "Must contain one uppercase, one lowercase, one number and one special character"
      ),

rePassword: yup.string()
    .required()
    .min(8)
    .max(16)
    .oneOf([yup.ref('password')], 'Passwords must match')
})

const Account: React.FC = props=>{

    /* Get sign in context here */

    const [isLoggedIn, setIsLoggedIn] = React.useContext(LoggedInStatus)
    /* use free/premium status here */


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
                        setIsLoggedIn(false)
                        setCurrentUser("")
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
                    <View>
                        <Text style={CoreStyles.contentText}> 
                            You are currently using the free version of Vocab Panda. For unlimited flashcard turns and more vocab storage, you can upgrade to premium for £3.49!
                        </Text>
                    </View>
                    <View>
                        <AppButton
                        >
                           <Text style={CoreStyles.actionButtonText}>
                                Upgrade
                           </Text> 
                        </AppButton>
                    </View>
                    
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
                        initialValues={{password: "", rePassword: ""}}
                        validationSchema={changePasswordSchema}
                        onSubmit={async (values, actions)=>{
                            
                            /* Call change password function in default settings class */
                            
                            let result = await AppLoginDetails.changePassword(values.password, currentUser)

                            showMessage({
                                message: result,
                                type: "info"
                            })

                            setPasswordOverlay(false)
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
                                        placeholder="Enter password..."
                                        placeholderTextColor="grey"
                                        value={values.password}
                                        onChangeText={handleChange("password")}

                                    />
                                     <Text
                                        style={CoreStyles.errorText}
                                     >
                                        {values.password !== "" ? errors.password : ""}
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
                                        value={values.rePassword}
                                        onChangeText={handleChange("rePassword")}
                                    />
                                    <Text
                                        style={CoreStyles.errorText}
                                    >
                                        {values.rePassword !== "" ? errors.rePassword : ""}
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


                <AppOverlay
                    isVisible={deleteAccountOverlay}
                    style={
                        {
                            height: 100
                        }
                    }
                >

                <ContentCard
                     cardStylings={overlayCardStyle}
                    >
                        <View>
                            <Text
                                style={CoreStyles.contentText}
                            
                            >Are you sure you want to delete your account?</Text>
                        </View>
                        <VocabPandaTextInput
                            secureTextEntry={true}
                            multiline={false}
                            placeholder="Enter password..."
                            placeholderTextColor="grey"

                        />

                    </ContentCard>

                    <View style={{flex:1, flexDirection: "row", justifyContent: "space-evenly"}}>
                        <AppButton
                            customStyles={CoreStyles.backButtonColor}
                            onPress={()=>setDeleteAccountOverlay(false)}
                        >
                            <Text style={CoreStyles.backButtonText}>
                                Close
                            </Text>

                        </AppButton>

                        <AppButton
                            customStyles={CoreStyles.deleteButtonColor}
                            onPress={()=>{
                                /* Delete al local data, cancel billing (Remind user that services last until x) */
                            }}
                        >
                            <Text style={CoreStyles.actionButtonText}>
                                Delete
                            </Text>
                        </AppButton>

                    </View>


                    
                </AppOverlay>

            
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


const overlayCardStyle: ViewStyle = {

    marginBottom: 20,
    width: windowDimensions.WIDTH * 0.75,
    height: windowDimensions.HEIGHT * 0.4,
    justifyContent: "flex-start"

}

export default Account;