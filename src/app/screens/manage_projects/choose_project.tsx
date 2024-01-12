/* eslint-disable */

import * as types from '@customTypes/types.d'
import React, {useState} from 'react';
import {
    View,
    Text
} from 'react-native';
import Dropdown from 'app/shared/dropdown';
import AppButton from '@shared/app_button';
import CoreStyles from '@styles/core_styles';

const ChooseProject: React.FC<types.CustomDropDownProps> = props=>{

    /* define database response object */
    /* database loaded on first load and stored in cache */

    const data: types.ProjectList = ["First proj", "vocab", "Spain"];

    const [currentProjectSelection, setCurrentProjectSelection] = useState("");


    const nav = ()=>{

        /* Set up alert here */

        props.navigation.navigate("project view", {

            screen: "project view",
            project: currentProjectSelection
            
        })
    }

    return(
        <View>
            <Dropdown 
                data={data} 
                defaultButtonText='Choose Project'
                setSelection={setCurrentProjectSelection}
            />
            <AppButton {...props} onPress={nav}>
                <Text style={CoreStyles.actionButtonText}>Select Project</Text>
            </AppButton>
        </View>
    )
}

export default ChooseProject;