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
            <ManageProjectsNav.Navigator screenOptions={addedStyles}>
                <ManageProjectsNav.Screen name='choose project' component={ChooseProject} options={{
                    headerShown: false
                }}/>
                <ManageProjectsNav.Screen name='project view' component={ProjectView} options={{
                    headerShown: false
                }}/>
            </ManageProjectsNav.Navigator>
    )
}

const addedStyles = {
    headerStyle: {
        backgroundColor: appColours.lightGreen
    },
    headerTitleAlign:"center"
}


export default ManageProjectsStack;