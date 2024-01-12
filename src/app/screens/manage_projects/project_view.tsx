/* eslint-disable */


import React from 'react';
import {
    View,
    Text,
    BackHandler,
} from 'react-native';
import AppButton from 'app/shared/app_button';

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

    const project = props.route.params.project;

    const nav = ()=>{

        props.navigation.navigate("game", {

            screen: "MyModal"
            
        })
    }
    

    /* TODO - call code to get project information in*/
    /* TODO - render */

    return(
        <View style={{flex:1}}>
            <Text style={{fontSize:100, color:"black"}}>
                {project}
            </Text>
            <AppButton {...props} onPress={nav}>
                <Text>Add to project</Text>
            </AppButton>
        </View>
    )
}


export default ProjectView;