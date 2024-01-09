/* eslint-disable */


import React from 'react';
import {
    View,
    Text,
    Button,
    BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PlayButton from '../../shared/playButton';

const ProjectView: React.FC = (props)=>{

    React.useEffect(() => {

        /* reset state on hardware back press*/
        const backAction = () => {
          props.navigation.reset(({
            index:0,
            routes: [{ name: 'choose project' }],
            key: null
          }))
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
    
        return () => backHandler.remove();
    }, []);

    console.log(props.route)
    const project = props.route.params.project;

    const navDestination = {
        screen: "game",
        screenParams: {
            screen: "MyModal"
        }
    }
    

    /* TODO - call code to get project information in*/
    /* TODO - render */

    return(
        <View style={{flex:1}}>
            <Text style={{fontSize:100, color:"black"}}>
                {project}
            </Text>
            <PlayButton {...props} dest={navDestination}/>
        </View>
    )
}


export default ProjectView;