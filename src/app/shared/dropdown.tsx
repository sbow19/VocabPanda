/* eslint-disable */

import * as types from '@customTypes/types.d'

import React, {useState} from 'react'
import SelectDropdown from 'react-native-select-dropdown';
import appColours from '@styles/app_colours';
import CoreStyles from '@styles/core_styles';
import {default as MaterialIcon} from 'react-native-vector-icons/MaterialIcons'
import { Keyboard } from 'react-native';



function parseProps(props){


    let customProps: types.CustomDropDownProps = {
        data: [""],
        customStyles: {
            buttonContainerStyle:{},
            dropdownContainerStyle:{},
            rowTextStyle: {},
            buttonTextStyle: {}
        },
        defaultButtonText: "",
        setSelection: null,
        defaultValue: "",
        defaultValueByIndex: 0,
        search: true
    } 

    if (props.data) {
        customProps.data = props.data;
    }
    
    if (props.customStyles) {
        customProps.customStyles = props.customStyles;
    }
    
    if (props.defaultButtonText) {
        customProps.defaultButtonText = props.defaultButtonText;

    }
    
    if (props.setSelection) {
        customProps.setSelection = props.setSelection;
    }

    if(props.defaultValue){
        customProps.defaultValue = props.defaultValue
    }

    if(props.defaultValueByIndex){

        customProps.defaultValueByIndex = props.defaultValueByIndex
    }

    if(props.search == true || props.search == false){

        customProps.search = props.search
    }


    return customProps

}



const Dropdown: React.FC<types.CustomDropDownProps> = props=>{


    let customProps:types.CustomDropDownProps = parseProps(props);

    /* Dropdown state */

    const [dropdownOpen, setDropDownState] = useState(false)

    /* In order to narrow down the searches in the dropdown menu, we need to do some string matching*/

    const [currentSearchMatches, setCurrentSearchMatches] = useState(customProps.data)

    const currentInputHandler = (newInput: string) =>{

        let newMatchSearches = customProps.data.map(project=>{

            //If we match 
            if(project.match(new RegExp(newInput,"gi")) && project !==null){

                return project
            }
        });

        setCurrentSearchMatches(newMatchSearches);
    }

    

    return(
        <SelectDropdown
            data={currentSearchMatches}
            onFocus = {()=>{

                setDropDownState(true)

            }}
            onBlur = {()=>{

                currentInputHandler("")
                setDropDownState(false)
            }}
            onSelect = {(item)=>{
                try{
                    customProps.setSelection(item)
                }catch(e){
                    console.log(e)
                }
            }}
            onChangeSearchInputText = {search =>{
                currentInputHandler(search);
            }}
            buttonTextAfterSelection={(item)=>{
                return (item)
            }}
            defaultButtonText={customProps.defaultButtonText}
            buttonStyle={
                [
                    CoreStyles.dropDownStyles.buttonContainerStyle,
                customProps.customStyles.buttonContainerStyle
                ]
            }
            dropdownStyle={
                [
                CoreStyles.dropDownStyles.dropdownContainerStyle,
                customProps.customStyles.dropdownContainerStyle
                ]
            }
            buttonTextStyle={
                [
                    CoreStyles.dropDownStyles.buttonTextStyle,
                    customProps.customStyles.buttonTextStyle
                ]
            }
            rowTextStyle={
                [
                    CoreStyles.dropDownStyles.rowTextStyle,
                    customProps.customStyles.rowTextStyle
                ]
            }
            dropdownOverlayColor='rgba(0,0,0,0)'
            showsVerticalScrollIndicator={true}
            search={true}
            renderDropdownIcon={()=>{

                const name = !dropdownOpen ? "keyboard-arrow-left" : "keyboard-arrow-down"

                return(
                    <MaterialIcon name={name} size={30} color={appColours.black}/>
                )
            }}
            dropdownIconPosition='right'
            defaultValue={customProps.defaultValue}
            disableAutoScroll={true}
            defaultValueByIndex={customProps.defaultValueByIndex}


        />
    )
}


export default Dropdown
