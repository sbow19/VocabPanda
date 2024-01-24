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
import React from 'react'


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
        placeholderTextColor: appColours.black,
        autoFocus: false,
        onSubmit: ()=>{},
        returnKeyType: "default",
        value: "",
        onChangeText: ()=>{},
        onBlur: e=>{},
        onFocus: e=>{},
        state: null
    }

    if(props.state) {
        customProps.state = props.state
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

    if(props.autoFocus == true || props.autoFocus == false) {
        customProps.autoFocus = props.autoFocus
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

    if(props.onSubmit) {
        customProps.onSubmit = props.onSubmit
    } 

    if(props.returnKeyType) {
        customProps.returnKeyType = props.returnKeyType
    } 

    if(props.value) {
        customProps.value = props.value
    } 

    if(props.onChangeText){
        customProps.onChangeText = props.onChangeText
    }

    if(props.onBlur){
        customProps.onBlur = props.onBlur
    }

    if(props.onFocus){
        customProps.onFocus = props.onFocus
    }

    return customProps
    
}

const VocabPandaTextInput: React.FC<TextInputProps> = props =>{

    const [active, setActive] = useState(false);

    const textInput = React.useRef([])

    const customProps: TextInputProps = parseProps(props);

    React.useEffect(()=>{

        if(props.state){

            setActive(true)
            textInput.current.focus()

        }
        

    }, [props.state])

    return(<>

    <TextInput
        ref={textInput}
        autoFocus={customProps.autoFocus}
        style={[additionalStyles, 
            {
                backgroundColor: appColours.white ,
                borderColor: !active ? appColours.black : appColours.blue
            },
            customProps.style,

        ]}
        onFocus={e=>{
            setActive(true);
            customProps.onFocus(e)
        }}
        onBlur={e=>{
            setActive(false);
            customProps.onBlur(e)
        }}
        onChangeText={customProps.onChangeText}
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
        onSubmitEditing={e=>{
            customProps.onSubmit()
        }}
        returnKeyType={customProps.returnKeyType}
        value={customProps.value}
        autoComplete="off"
        
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