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


const CreateAccountButton: React.FC = props=>{

    const addedStyles: CustomButtonStyles = {
        height: 50,
        width: 100,
        backgroundColor: appColours.darkGreen
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

            <Text style={[CoreStyles.actionButtonText, {color: appColours.white, flexWrap:"wrap"}]}> Create account</Text>

        </AppButton>
    )
}

export default CreateAccountButton;