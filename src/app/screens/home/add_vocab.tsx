/* eslint-disable */


import React, {useState} from 'react';
import {
    View,
    Button,
    Text
} from 'react-native';
import ProjectDropdown from '../../shared/projectDropdown';

import { destination } from '../../shared/appButton';

import AppButton from '../../shared/appButton';

import CoreStyles from '../../shared_styles/core_styles';




const AddVocab: React.FC = props=>{

    /* define database response object */
    /* database loaded on first load and stored in cache */
    const [currentSelection, setCurrentSelection] = useState("");

    const handleUserSelection: (selection: string)=>void = (selection)=>{

        setCurrentSelection(selection);

    };
    
    const mySelectState = [currentSelection, handleUserSelection];

    const navDestination: destination = {
        screen: "Projects",
        screenParams: {
            screen:"project view",    
            params:{
                project: currentSelection
            }
            
    }}

    return(
        <View style={{flex:1}}>
            <ProjectDropdown  mySelectState={mySelectState}/>
            <AppButton {...props} dest={navDestination}>
                <Text style={CoreStyles.actionButtonText}>Select Project</Text>
            </AppButton>

        </View>
    )
}

export default AddVocab;