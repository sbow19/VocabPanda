/* eslint-disable */

import * as types from '@customTypes/types.d'

import AppButton from "@shared/app_button";
import appColours from "@styles/app_colours";
import {
    Text
} from 'react-native';
import CoreStyles from "@styles/core_styles";


const CreateAccountButton: React.FC = props=>{

    const addedStyles: types.CustomButtonStyles = {
        height: 50,
        width: 100,
        backgroundColor: appColours.darkGreen
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

            <Text style={[CoreStyles.actionButtonText, {color: appColours.white, flexWrap:"wrap"}]}> Create account</Text>

        </AppButton>
    )
}

export default CreateAccountButton;