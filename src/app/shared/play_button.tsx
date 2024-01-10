/* eslint-disable */


import * as types from '@customTypes/types.d'

import React, {useState} from 'react';

import { 
    TouchableOpacity,
    Text
} from 'react-native';

import appColours from 'app/shared_styles/app_colours';

import CoreStyles, { shadowSettings } from '@styles/core_styles';

import { Shadow } from 'react-native-shadow-2';

const PlayButton: React.FC = props=>{

    const [pressState, setPressState] = useState(false);
    const [longPressState, setLongPressState] = useState(false);

    const navDestination = props.dest

    return(

        <Shadow distance={!pressState ? shadowSettings.distance : 0} offset={shadowSettings.offset} sides={shadowSettings.sides} corners={
            shadowSettings.corners} startColor={appColours.black}>
               <TouchableOpacity style={{
                   height: 50, 
                   width: 100, 
                   backgroundColor: appColours.darkGreen, 
                   borderRadius:20,
                   marginLeft: !pressState ? 0 : 2,
                   marginTop: !pressState ? 0 : 3,
                   borderColor: appColours.black,
                   borderWidth: 2,
                   justifyContent: "center",
                   alignItems:"center"
                   }}
                   activeOpacity={1}
                   onPressIn={()=>{
                       setPressState(true)
                       setLongPressState(false)
                       try{props.setSwipeStatus(false)}catch(e){console.log(e)}
                   }}
                   onPressOut={()=>{
                       setPressState(false)
                       if(!longPressState){
                         props.navigation.navigate(navDestination.screen, navDestination.screenParams)
                        }
                        
                        try{props.setSwipeStatus(true)}catch(e){console.log(e)}
                   }}
                   onLongPress={()=>{setLongPressState(true)}}>
              
                   <Text style={
                       [CoreStyles.mainHeaderText, 
                       {
                           color: !pressState ? appColours.white : "grey",
                           marginRight: !pressState ? 2 : 0,
                           marginBottom: !pressState ? 3 : 0
                       }
                       ]}>
                           Play
                   </Text>
               
               </TouchableOpacity>
           </Shadow>

    )
}

export default PlayButton;