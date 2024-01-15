/* eslint-disable */

import * as types from '@customTypes/types.d';

import {
    StyleProp,
    TextInput,
    TextInputProps,
    TextStyle
} from 'react-native';

import { useState } from 'react'

import windowDimensions from '@context/dimensions';
import appColours from '@styles/app_colours';


function parseProps (props:TextInputProps){




    let customProps: TextInputProps = {
        numberOfLines: 1,
        editable: true,
        blurOnSubmit: true,
        style: {},
        inputMode: "text",
        keyboardType: "default",
        maxLength: 24,
        multiline: true,
        secureTextEntry: false,
        placeholder: "Input",
        placeholderTextColor: appColours.black
    }

    if(props.style) {
        customProps.style = props.style
    } 

    if(props.numberOfLines) {
        customProps.numberOfLines = props.numberOfLines
    } 

    if(props.editable == true || props.editable == false) {
        customProps.editable = props.editable
    } 

    if(props.blurOnSubmit == true || props.blurOnSubmit == false) {
        customProps.blurOnSubmit = props.blurOnSubmit
    } 

    if(props.inputMode) {
        customProps.inputMode = props.inputMode
    } 

    if(props.keyboardType) {

        customProps.keyboardType = props.keyboardType
    } 

    if(props.maxLength) {
        customProps.maxLength = props.maxLength
    } 

    if(props.multiline == true || props.multiline == false) {
        customProps.multiline = props.multiline
    } 

    if(props.secureTextEntry == true || props.secureTextEntry == false) {
        customProps.secureTextEntry = props.secureTextEntry
    } 

    if(props.placeholder) {
        customProps.placeholder = props.placeholder
    } 

    if(props.placeholderTextColor) {
        customProps.placeholderTextColor = props.placeholderTextColor
    } 


    return customProps
    
}

const VocabPandaTextInput: React.FC<TextInputProps> = props =>{

    const [active, setActive] = useState(false);

    // TODO - Move custom prop handler to separate function

    const customProps: TextInputProps = parseProps(props);

    return(<>

    <TextInput
        style={[additionalStyles, 
            {
                backgroundColor: appColours.white ,
                borderColor: !active ? appColours.black : appColours.blue
            },
            customProps.style,

        ]}
        onFocus={()=>{
            console.log("Hello ")
            setActive(true);
        }}
        onBlur={()=>{
            setActive(false);
        }}
        multiline={customProps.multiline}
        numberOfLines={customProps.numberOfLines}
        editable={customProps.editable}
        blurOnSubmit={customProps.blurOnSubmit}
        inputMode={customProps.inputMode}
        keyboardType={customProps.keyboardType}
        maxLength={customProps.maxLength}
        secureTextEntry={customProps.secureTextEntry}
        placeholder={customProps.placeholder}
        placeholderTextColor={customProps.placeholderTextColor}
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