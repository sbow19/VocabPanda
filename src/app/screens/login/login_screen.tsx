/* eslint-disable */

import CoreStyles from "app/shared_styles/core_styles"
import appColours from "app/shared_styles/app_colours"
import * as types from '@customTypes/types.d'
import SignInTemplate from "./components/signupscreen_template"
import VocabPandaTextInput from "app/shared/text_input"
import AppButton from "app/shared/app_button"
import { 
    View,
    Text,
    ViewStyle,
    Pressable,
    Keyboard,
    TouchableOpacity
 } from "react-native"
 import windowDimensions from "app/context/dimensions"
 import React from 'react'

 import LoggedInStatus from "app/context/loggedIn"
 import { Formik } from "formik"
import AppLoginDetails from "app/storage/user_profile_details"
import { showMessage } from "react-native-flash-message"

import CurrentUserContext from "app/context/current_user"
 


const LoginScreen: React.FC = props=>{

    const[forgotTextColor, setForgotTextColor] = React.useState(appColours.black)

    const [isLoggedIn, setIsLoggedIn] = React.useContext(LoggedInStatus);

    const [currentUser, setCurrentUser] = React.useContext(CurrentUserContext)

    return(
        <TouchableOpacity
            onPress={()=>Keyboard.dismiss()}
            style={CoreStyles.defaultScreen}
            activeOpacity={1}
        >
            <SignInTemplate>
            
                <Formik

                    initialValues={{user: "", password: ""}}
                    onSubmit={async(values, actions)=>{

                        try{
                            let resultObject = await AppLoginDetails.signIn(
                                values.user,
                                values.password
                            )

                            if(resultObject.loginSuccess){

                                showMessage({
                                    message: "Login success",
                                    type: "success"
                                })

                                
                                setCurrentUser(resultObject.userName)
                                setIsLoggedIn(true)
                                

                            } else if (!resultObject.loginSuccess){

                                showMessage({
                                    message: "Login failed",
                                    type: "warning"
                                })
                            }


                        }catch(e){
                            console.log(e)
                        }

                        actions.resetForm()

                    }}
            
                >
                    {({handleChange, handleReset, handleSubmit, values})=>(


                    <>

                        <View
                            style={inputWrapperStyles}
                        >
                            <VocabPandaTextInput
                                multiline={false}
                                placeholder="Enter email or username..."
                                placeholderTextColor="grey"
                                inputMode="email"
                                keyboardType="email-address"
                                value={values.user}
                                onChangeText={handleChange("user")}
                            />

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
                                onChangeText={handleChange("password")}
                            />

                        </View>

                        <View
                            style={[inputWrapperStyles, {justifyContent:"flex-end"}]}
                            onStartShouldSetResponder={()=>true}
                        >
                            <Pressable
                            onPressIn={()=>{setForgotTextColor(appColours.blue)}}
                            onPressOut={()=>{setForgotTextColor(appColours.black)}}
                            >
                            
                                <Text style={{color: forgotTextColor}}>
                                    Forgot your password?
                                </Text>
                            </Pressable>
                            
                        </View>
                   

                    <View
                        style={
                            [
                                inputWrapperStyles, 
                                {
                                    alignItems: "center",
                                    flexDirection: "row",
                                    justifyContent: "space-evenly",
                                    width: windowDimensions.WIDTH * 0.9
                                }
                            ]
                        }
                    >
                        <View
                            style={{
                                width: windowDimensions.WIDTH*0.3
                            }}
                        >
                            <AppButton
                                customStyles={
                                    CoreStyles.backButtonColor
                                }
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
                            }}
                        >
                            <AppButton
                                customStyles={{backgroundColor:appColours.darkGreen}}
                                onPress={()=>{
                                    handleSubmit()
                                }}
                            >
                                <Text style={CoreStyles.actionButtonText}>Sign In</Text>
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

    height: windowDimensions.HEIGHT*0.1

}

export default LoginScreen