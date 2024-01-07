/* eslint-disable */


import React from 'react';
import {
    View,
    Text
} from 'react-native';

const ProjectView: React.FC = ({navigation, route})=>{

    const project = route.params.project;

    /* TODO - call code to get project information in*/
    /* TODO - render */

    return(
        <View style={{flex:1}}>
            <Text style={{fontSize:100, color:"black"}}>
                {project}
            </Text>
        </View>
    )
}


export default ProjectView;