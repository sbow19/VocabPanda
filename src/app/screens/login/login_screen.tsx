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
 


const LoginScreen: React.FC = props=>{

    const[forgotTextColor, setForgotTextColor] = React.useState(appColours.black)

    const [isLoggedIn, setIsLoggedIn] = React.useContext(LoggedInStatus);

    return(
        <TouchableOpacity
            onPress={()=>Keyboard.dismiss()}
            style={CoreStyles.defaultScreen}
            activeOpacity={1}
        >
            <SignInTemplate>
                

                    <View
                        style={inputWrapperStyles}
                    >
                        <VocabPandaTextInput
                            multiline={false}
                            placeholder="Enter email or username..."
                            placeholderTextColor="grey"
                            inputMode="email"
                            keyboardType="email-address"
                        
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
                        <AppButton
                            customStyles={{backgroundColor:appColours.darkGreen}}
                            onPress={()=>{props.navigation.pop()}}
                        >
                            <Text style={CoreStyles.actionButtonText}>Go back</Text>
                        </AppButton>

                        <AppButton
                            customStyles={{backgroundColor:appColours.darkGreen}}
                            onPress={()=>{
                                setIsLoggedIn(true)
                            }}
                        >
                            <Text style={CoreStyles.actionButtonText}>Sign In</Text>
                        </AppButton>
                    </View>
            
            </SignInTemplate>
        </TouchableOpacity>
    )
}

const inputWrapperStyles: ViewStyle = {

    height: windowDimensions.HEIGHT*0.1

}

export default LoginScreen