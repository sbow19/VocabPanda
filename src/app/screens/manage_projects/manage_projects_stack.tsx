/* eslint-disable */


import React from 'react';
import {
    View
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChooseProject from './choose_project';
import ProjectView from './project_view';

const ManageProjectsNav = createNativeStackNavigator();

const ManageProjectsStack: React.FC = props=>{

     /* Listen to state change*/

     React.useEffect(()=>{

        const unsubscribe = props.navigation.addListener("state", e=>{
            console.log(e.data.state.history)
        })

    }, [props.navigation])


    return (

        <View style={{ flex:1 }}>
            <ManageProjectsNav.Navigator>
                <ManageProjectsNav.Screen name='choose project' component={ChooseProject}/>
                <ManageProjectsNav.Screen name='project view' component={ProjectView}/>
            </ManageProjectsNav.Navigator>
        </View>
    )
}


export default ManageProjectsStack;