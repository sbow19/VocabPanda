/* eslint-disable */

import * as types from '@customTypes/types.d';

import AppButton from "@shared/app_button";
import appColours from "@styles/app_colours";
import {
    Text
} from 'react-native';
import CoreStyles from "@styles/core_styles";


const SignOutButton: React.FC = props=>{

    const addedStyles: types.CustomButtonStyles = {
        height: 40,
        width: 80,
        backgroundColor: appColours.white
    };

    const nav = ()=>{

        props.navigation.navigate("game")
    }

    return (
        <AppButton {...props} onPress={nav} customStyles={addedStyles}>

            <Text style={[CoreStyles.actionButtonText, {color: appColours.black}]}> Sign out</Text>


        </AppButton>
    )
}

export default SignOutButton;