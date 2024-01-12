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


    const nav = ()=>{

        props.navigation.navigate("game")
    }

    return (
        <AppButton {...props} onPress={nav} customStyles={addedStyles}>

            <Text style={[CoreStyles.actionButtonText, {color: appColours.white, flexWrap:"wrap"}]}> Create account</Text>

        </AppButton>
    )
}

export default CreateAccountButton;