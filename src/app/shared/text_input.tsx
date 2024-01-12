/* eslint-disable */

import * as types from '@customTypes/types.d';

import {
    StyleProp,
    TextInput,
    TextStyle
} from 'react-native';

import { useState } from 'react'

import windowDimensions from '@context/dimensions';
import appColours from '@styles/app_colours';

const VocabPandaTextInput: React.FC<types.CustomInputProp> = props =>{

    const [active, setActive] = useState(false);

    // TODO - Move custom prop handler to separate function

    let textInputStyle: Object = {};

    try {
        textInputStyle = props.inputStyle
    } catch (e){
        console.log(e)
    }

    let numberOfLines = 1;

    try {
        numberOfLines = props.numberOfLines
    } catch (e){
        console.log(e)
    }


    let editableValue = true;

    try{
        editableValue = props.editable
    } catch (e){
        console.log(e)
    }


    return(<>

    <TextInput
        style={[additionalStyles, 
            {
                backgroundColor: appColours.white ,
                borderColor: !active ? appColours.black : appColours.blue
            },
            textInputStyle,

        ]}
        onFocus={()=>{
            console.log("Hello ")
            setActive(true);
        }}
        onBlur={()=>{
            setActive(false);
        }}
        multiline={true}
        numberOfLines={numberOfLines}
        editable={editableValue}

    />
    
    </>)
};

const additionalStyles:StyleProp<TextStyle> = {
    width: windowDimensions.WIDTH*0.6,
    height: windowDimensions.HEIGHT*0.05,
    borderRadius:5,
    borderColor: appColours.black,
    borderWidth:2,
    fontFamily: "Exo2-Medium",
    color: appColours.black,
    elevation: 5

}

export default VocabPandaTextInput; 