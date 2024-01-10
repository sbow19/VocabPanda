/* eslint-disable */


import React, {useState} from 'react';
import {
    View,
    Text
} from 'react-native';
import ProjectDropdown from '@shared/project_dropdown';
import AppButton from '@shared/app_button';
import CoreStyles from '@styles/core_styles';

const ChooseProject: React.FC = props=>{

    /* define database response object */
    /* database loaded on first load and stored in cache */
    const [currentSelection, setCurrentSelection] = useState("");

    const handleUserSelection: (selection: string)=>void = (selection)=>{

        setCurrentSelection(selection);

    };

    const mySelectState = [currentSelection, handleUserSelection];

    const navDestination: destination = {
        screen: "project view",
        screenParams: {
            screen: "project view",
            project: currentSelection
            
    }}

    return(
        <View>
            <ProjectDropdown mySelectState={mySelectState}/>
            <AppButton {...props} dest={navDestination}>
                <Text style={CoreStyles.actionButtonText}>Select Project</Text>
            </AppButton>
        </View>
    )
}

export default ChooseProject;