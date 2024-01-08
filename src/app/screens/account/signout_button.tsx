/* eslint-disable */

import App from "../../../../App";
import AppButton from "../../shared/appButton";
import { CustomButtonStyles } from "../../shared/appButton";
import { appColours } from "../../shared_styles/core_styles";
import { destination } from "../../shared/appButton";
import {
    Text
} from 'react-native';
import CoreStyles from "../../shared_styles/core_styles";


const SignOutButton: React.FC = props=>{

    const addedStyles: CustomButtonStyles = {
        height: 40,
        width: 80,
        backgroundColor: appColours.white
    };

    const navDestination: destination = {
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