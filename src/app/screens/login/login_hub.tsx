/* eslint-disable */

import CoreStyles from "app/shared_styles/core_styles"
import appColours from "app/shared_styles/app_colours"
import * as types from '@customTypes/types.d'
import SignInTemplate from "./components/signupscreen_template"
import { 
    StatusBar,
    View,
    ViewStyle,
    Text
} from "react-native"
import AppButton from "app/shared/app_button"
import windowDimensions from "app/context/dimensions";

import FlashMessage, {showMessage} from "react-native-flash-message"

import InternetStatus from 'app/context/internet'
import React from 'react'

const LoginHub: React.FC = props=>{

   

    const signInNav = ()=>{

        props.navigation.navigate("login");
    }

    const createAccountNav = ()=>{

        props.navigation.navigate("create account");
    };

    const [isOnline] = React.useContext(InternetStatus);

    return(
        <>
             
            <SignInTemplate>
                <View
                    style={buttonWrapperStyles}
                >
                    <AppButton
                        customStyles={signInButtonStyles}
                        onPress={signInNav}
                    >
                        <Text
                            style={[CoreStyles.actionButtonText]}
                        >Sign in
                        </Text>

                    </AppButton>
                </View>

                <View
                    style={buttonWrapperStyles}
                >
                    <AppButton
                        customStyles={createAccountButtonStyles}
                        onPress={()=>{
                            
                            //Show error message if no internet connection

                            if(!isOnline){

                                showMessage(
                                    {
                                        type: "info",
                                        message: "Cannot create account when not connected to the internet"
                                    }
                                );

                            } else if (isOnline){
                                createAccountNav()
                            };
                        }
                    }
                    >
                        <Text
                            style={[CoreStyles.actionButtonText, {color: appColours.black}]}
                        >
                                Create Account
                        </Text>

                    </AppButton>
                </View>


            </SignInTemplate>
            <FlashMessage 
                    position="center"
                    animationDuration={100}
                    duration={1000}
                    titleStyle={CoreStyles.contentText}
                    style={
                        {
                            zIndex: 99
                        }
                    }
            />
        </>
    )
}

const signInButtonStyles: types.CustomButtonStyles ={

    backgroundColor: appColours.darkGreen

}

const createAccountButtonStyles: types.CustomButtonStyles ={

    backgroundColor: appColours.white,
    width: 150

}

const buttonWrapperStyles: ViewStyle = {

    height: windowDimensions.HEIGHT*0.1

}

export default LoginHub