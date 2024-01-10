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

    const navDestination: types.destination = {
        screen: "game",
        screenParams:{
            params: {
                hello: "hello"
            }
        }
    }

    return (
        <AppButton {...props} dest={navDestination} addedStyles={addedStyles}>

            <Text style={[CoreStyles.actionButtonText, {color: appColours.black}]}> Sign out</Text>


        </AppButton>
    )
}

export default SignOutButton;