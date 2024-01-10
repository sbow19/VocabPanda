/* eslint-disable */

import * as types from '@customTypes/types.d'

import React, {useState, useContext} from 'react';
import {
    View,
    Text
} from 'react-native';
import ProjectDropdown from '@shared/project_dropdown';
import AppButton from '@shared/app_button';
import CoreStyles from '@styles/core_styles';
import TabSwipeStatus from '@context/swipe_toggle';

const AddVocab: React.FC = props=>{

    /* define database response object */
    /* database loaded on first load and stored in cache */
    const [currentSelection, setCurrentSelection] = useState("");

    const handleUserSelection: (selection: string)=>void = (selection)=>{

        setCurrentSelection(selection);

    };
    
    const mySelectState = [currentSelection, handleUserSelection];

    const navDestination: types.destination = {
        screen: "Projects",
        screenParams: {
            screen:"project view",    
            params:{
                project: currentSelection
            }
            
    }}

    const setSwipeStatus = useContext(TabSwipeStatus);

    React.useEffect(()=>{

        const unsubscribe = props.navigation.addListener("blur", (e)=>{

            setCurrentSelection("");

        })
    
        return unsubscribe

    }, [props.navigation]
)

    return(
        <View style={CoreStyles.defaultScreen}>
            <ProjectDropdown  mySelectState={mySelectState}/>
            <AppButton {...props} dest={navDestination} setSwipeStatus={setSwipeStatus}>
                <Text style={CoreStyles.actionButtonText}>Select Project</Text>
            </AppButton>

        </View>
    )
}

export default AddVocab;