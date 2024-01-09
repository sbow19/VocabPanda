/* eslint-disable */

import React, {useState} from 'react'
import SelectDropdown from 'react-native-select-dropdown';
import { appColours } from '../shared_styles/core_styles';
import windowDimensions from '../context/dimensions';
import {default as MaterialIcon} from 'react-native-vector-icons/MaterialIcons'

const ProjectDropdown: React.FC = props=>{

    /* Dropdown state */

    const [dropdownOpen, setDropDownState] = useState(false)

    const data: ProjectList  = ["first project", "second project", "third project", "fourth project", "fifth project"];

    /* In order to narrow down the searches in the dropdown menu, we need to do some string matching*/

    const [currentSelection, handleUserSelection] = props.mySelectState

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
        buttonStyle={buttonContainerStyle}
        dropdownStyle={dropdownContainerStyle}
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


type ProjectList = Array<ListItem|null>
type ListItem = string;

const dropdownContainerStyle = {
    backgroundColor: appColours.white,
    borderRadius:10,
    height: 250,
    elevation: 10,
    borderColor: appColours.black,
    borderWidth: 2,
    padding: 5
};

const buttonContainerStyle = {
    backgroundColor: appColours.white,
    borderColor: appColours.black,
    borderWidth: 2,
    width: (windowDimensions.WIDTH * 0.8),
    borderRadius: 10,
    paddingLeft: 5,
    elevation: 10,
};


export default ProjectDropdown
