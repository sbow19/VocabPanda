/* eslint-disable */


import React from 'react';
import {
    View
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChooseProject from '@screens/manage_projects/choose_project';
import ProjectView from '@screens/manage_projects/project_view';

import appColours from '@styles/app_colours';

const ManageProjectsNav = createNativeStackNavigator();

const ManageProjectsStack: React.FC = props=>{

    return (

        <View style={{ flex:1 }}>
            <ManageProjectsNav.Navigator screenOptions={addedStyles}>
                <ManageProjectsNav.Screen name='choose project' component={ChooseProject}/>
                <ManageProjectsNav.Screen name='project view' component={ProjectView}/>
            </ManageProjectsNav.Navigator>
        </View>
    )
}

const addedStyles = {
    headerStyle: {
        backgroundColor: appColours.lightGreen
    },
    headerTitleAlign:"center"
}


export default ManageProjectsStack;