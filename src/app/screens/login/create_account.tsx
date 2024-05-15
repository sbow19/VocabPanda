/* eslint-disable */

import CoreStyles from "app/shared_styles/core_styles"
import appColours from "app/shared_styles/app_colours"
import * as types from '@customTypes/types.d'
import SignInTemplate from "./components/signupscreen_template"
import windowDimensions from "app/context/dimensions"
import * as yup from 'yup'
import { showMessage } from "react-native-flash-message"

import InternetStatus from "app/context/internet"

import React from "react"

import {
    View,
    ViewStyle,
    TouchableOpacity,
    Keyboard,
    Text
} from 'react-native'

import VocabPandaTextInput from "app/shared/text_input"
import AppButton from "app/shared/app_button"
import { Formik } from "formik"
import UserDetails from "app/database/user_profile_details"
import BackendAPI from "app/api/backend"


const createAccountSchema = yup.object({
    email: yup.string()
        .required()
        .email("Must be a valid email address"),
    username: yup.string()
        .required()
        .min(8, "Username must have at least 8 characters")
        .max(24, "Username can have no more than 16 characters"),
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
    }
)

const CreateAccount: React.FC = props=>{

    const [isOnline] = React.useContext(InternetStatus);

    return(
        <TouchableOpacity
            onPress={()=>Keyboard.dismiss()}
            style={CoreStyles.defaultScreen}
            activeOpacity={1}
        >
            <SignInTemplate>
                <Formik
                    initialValues={{email: "", username: "", password: "", rePassword: ""}}
                    onSubmit={async(values, actions)=>{

                        /*  
                            Check email and username in the local storage to see whether there is already an account,
                            -   Must have internet to create an account to check email and usernames
                        */

                        if(!isOnline){
                            showMessage({
                                type: "warning",
                                message: "Internet required to create account.",
                            })
                            return
                        }

                        //CReate secure message with password in message

                        try{

                            const backendResponse = await BackendAPI.createAccount({
                                email: values.email,
                                username: values.username,
                                password: values.password
                            });

                            if(backendResponse.addMessage instanceof Error){
                                /* Throw error message */
                                showMessage({
                                    type: "warning",
                                    message: backendResponse.addMessage.cause.addMessage,
                                })
                            } 
                            else if(backendResponse.addMessage === "User added successfully!"){

                                //Set login details for account locally (to replace with SQL storage)
                                await UserDetails.createNewUser(
                                    values.email,
                                    values.username,
                                    values.password, // Password hashed using local algorithm
                                    backendResponse.userId //User id generated in backend.
                                );

                                /* Throw accounts created message */
                                showMessage({
                                    type: "success",
                                    message: "Account created successfully",
                                })


                                /* Go back to sign in screen */
                                props.navigation.pop()
                            }
                            else if (backendResponse.responseMessage === "Add unsuccessful" ){

                                //Generic error when add unsuccessful.

                                showMessage({
                                    type: "warning",
                                    message: "Username or password already exists."
                                })

                            }

                        }catch(e){

                            console.log(e);
                            console.trace();
                            showMessage({
                                type: "warning",
                                message: "Some error creating account."
                            })

                        }

                        actions.resetForm()
                        
                    }}
                    validationSchema={createAccountSchema}
                    
                >
                    {({handleReset, handleBlur, handleChange, handleSubmit, values, errors})=>(

                        <>
                            <View
                            style={inputWrapperStyles}
                            >
                                <VocabPandaTextInput
                                    multiline={false}
                                    placeholder="Enter email..."
                                    placeholderTextColor="grey"
                                    inputMode="email"
                                    keyboardType="email-address"
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                />

                                <View
                                    style={errorTextContainer}
                                >

                                    <Text
                                        style={CoreStyles.errorText}
                                    >
                                        {values.email !== "" ? errors.email : ""}
                                    </Text>

                                </View>
                            </View>

                            <View
                            style={inputWrapperStyles}

                            >
                                <VocabPandaTextInput
                                    secureTextEntry={false}
                                    multiline={false}
                                    placeholder="Enter username..."
                                    placeholderTextColor="grey"
                                    value={values.username}
                                    onChangeText={handleChange('username')}
                                />


                                <View
                                    style={errorTextContainer}
                                >
                                    <Text
                                        style={CoreStyles.errorText}
                                    >
                                        {values.username !== "" ? errors.username : ""}
                                    </Text> 

                                </View>
                                
                            </View>


                            <View
                            style={inputWrapperStyles}
                            >
                                <VocabPandaTextInput

                                    secureTextEntry={true}
                                    multiline={false}
                                    placeholder="Enter password..."
                                    placeholderTextColor="grey"
                                    value={values.password}
                                    onChangeText={handleChange('password')}

                                />

                                <View
                                    style={errorTextContainer}
                                >
                                
                                    <Text
                                        style={CoreStyles.errorText}
                                    >
                                        {values.password !== "" ? errors.password : ""}
                                    </Text>
                                
                                </View>

                            </View>

                            <View
                            style={inputWrapperStyles}
                            >
                                <VocabPandaTextInput
                                    secureTextEntry={true}
                                    multiline={false}
                                    placeholder="Re-enter password..."
                                    placeholderTextColor="grey"
                                    value={values.rePassword}
                                    onChangeText={handleChange('rePassword')}

                                />    
                                <View
                                    style={errorTextContainer}
                                >
                                    <Text
                                        style={CoreStyles.errorText}
                                    >
                                        {values.rePassword !== "" ? errors.rePassword : ""}
                                    </Text>
                                </View>
                            </View>


                            <View
                            style={[
                                inputWrapperStyles, 
                                {
                                    justifyContent: "space-evenly",
                                    flexDirection: "row",
                                    width: windowDimensions.WIDTH *0.8
                                    
                                }

                            ]}
                            >
                                <View
                                style={{
                                    width: windowDimensions.WIDTH*0.3,
                                }}>
                                    <AppButton
                                        customStyles={CoreStyles.backButtonColor}
                                        onPress={()=>{
                                            props.navigation.pop()
                                            handleReset()
                                        }}
                                    >
                                        <Text style={CoreStyles.backButtonText}>Go back</Text>
                                    </AppButton>


                                </View>


                                <View
                                style={{
                                    width: windowDimensions.WIDTH*0.3,
                                }}>
                                    
                                    <AppButton
                                        customStyles={{backgroundColor:appColours.darkGreen}}
                                        onPress={()=>{
                                            handleSubmit()
                                        }}
                                    >
                                        <Text style={CoreStyles.actionButtonText}>Submit</Text>
                                    </AppButton>

                                </View>
                            </View>

                        </>

                    )}
                    
                
                </Formik>
            
            </SignInTemplate>
        </TouchableOpacity>
    )
}

const inputWrapperStyles: ViewStyle = {

    height: windowDimensions.HEIGHT*0.11,
    width: windowDimensions.WIDTH* 0.9,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"

}

const errorTextContainer: ViewStyle = {

    height: windowDimensions.HEIGHT*0.13,
    width: windowDimensions.WIDTH* 0.33,
    justifyContent: "center", 
    marginLeft: 10


}


export default CreateAccount