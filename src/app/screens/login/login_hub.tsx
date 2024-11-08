/* eslint-disable */

import CoreStyles from "app/shared_styles/core_styles"
import appColours from "app/shared_styles/app_colours"
import * as types from '@customTypes/types.d'
import SignInTemplate from "./signupscreen_template"
import { 
    StatusBar,
    View,
    ViewStyle,
    Text
} from "react-native"
import AppButton from "app/shared/app_button"
import windowDimensions from "app/context/dimensions"

const LoginHub: React.FC = props=>{

    const signInNav = ()=>{

        props.navigation.navigate("login")
    }

    const createAccountNav = ()=>{

        props.navigation.navigate("create account")
    }

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
                        onPress={createAccountNav}
                    >

                        <Text
                            style={[CoreStyles.actionButtonText, {color: appColours.black}]}
                        >
                                Create Account
                        </Text>

                    </AppButton>
                </View>


            </SignInTemplate>
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