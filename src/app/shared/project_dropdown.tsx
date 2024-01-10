/* eslint-disable */

import * as types from '@customTypes/types.d'

import React, {useState} from 'react'
import SelectDropdown from 'react-native-select-dropdown';
import appColours from '@styles/app_colours';
import CoreStyles from '@styles/core_styles';
import {default as MaterialIcon} from 'react-native-vector-icons/MaterialIcons'

const ProjectDropdown: React.FC = props=>{

    /* Dropdown state */

    const [dropdownOpen, setDropDownState] = useState(false)

    const data: types.ProjectList  = ["first project", "second project", "third project", "fourth project", "fifth project"];


    const [currentSelection, handleUserSelection] = props.mySelectState

    /* In order to narrow down the searches in the dropdown menu, we need to do some string matching*/

    const [currentSearchMatches, setCurrentSearchMatches] = useState(data)

    const currentInputHandler = (newInput) =>{

        let newMatchSearches = data.map(project=>{

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

            setDropDownState(false)
        }}
        onSelect={item=>{
            handleUserSelection(item);
        }}
        onChangeSearchInputText = {search =>{
            currentInputHandler(search);
        }}
        defaultButtonText="Choose Project"
        buttonStyle={CoreStyles.dropDownStyles.buttonContainerStyle}
        dropdownStyle={CoreStyles.dropDownStyles.dropdownContainerStyle}
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


            />
    )
}


export default ProjectDropdown
