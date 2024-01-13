/* eslint-disable */

import React from 'react';
import{
    View,
    ViewStyle,
    StatusBar,
    Image,
    Text
} from 'react-native'
import CoreStyles from 'app/shared_styles/core_styles';
import appColours from 'app/shared_styles/app_colours';
import AppButton from 'app/shared/app_button';
import * as types from '@customTypes/types.d'

const SignInTemplate: React.FC<types> = props=>{



    return(
        <>
        <StatusBar backgroundColor={appColours.lightGreen} barStyle="dark-content"/>
        <View style={
            [
                CoreStyles.defaultScreen,
                signinTemplateStyles
            ]
        }>
            <View
                style={topContainerStyle}
            >
                 <Image source={require("../../../assets/icons/AppIcons/android/mipmap-xxhdpi/ic_launcher.png")}/>
                 <Text style={CoreStyles.drawerStyles.drawerTitle}> Vocab Panda </Text>

            </View>

            <View
                style={middleContainerStyle}
            >
                {props.children}
                
            </View>

            <View
                style={bottomContainerStyle}
            >
                <Text style={CoreStyles.contentText}> By Bow's Apps Limited</Text>
                
            </View>



        </View>
        </>
    )
}

const signinTemplateStyles: ViewStyle = {

    backgroundColor: appColours.lightGreen
};

const topContainerStyle: ViewStyle = {
    flex: 2.5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"

}

const middleContainerStyle: ViewStyle = {

    flex: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
    
}

const bottomContainerStyle: ViewStyle = {

    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
    
}


export default SignInTemplate;