/* eslint-disable */

import * as types from '@customTypes/types.d';

import React, {useState} from 'react';

import { 
    TouchableOpacity
} from 'react-native';

import appColours from '@styles/app_colours';

import { shadowSettings } from '@styles/core_styles';

import { Shadow } from 'react-native-shadow-2';


const SearchButton: React.FC = props=>{

    const [pressState, setPressState] = useState(false);
    const [longPressState, setLongPressState] = useState(false)

    const addedStyles = props?.addedStyles

    return(

        <Shadow distance={!pressState ? shadowSettings.distance : 0} offset={shadowSettings.offset} sides={shadowSettings.sides} corners={
            shadowSettings.corners} startColor={appColours.black}>
               <TouchableOpacity style={[{
                   height: 50, 
                   width: 100, 
                   backgroundColor: appColours.lightGreen, 
                   borderRadius:20,
                   marginLeft: !pressState ? 0 : 2,
                   marginTop: !pressState ? 0 : 3,
                   borderColor: appColours.black,
                   borderWidth: 2,
                   justifyContent: "center",
                   alignItems:"center"
                   }, addedStyles]}
                   activeOpacity={1}
                   onPressIn={()=>{
                       setPressState(true);
                       setLongPressState(false)
                       try{props.setSwipeStatus(false)}catch(e){console.log(e)}
                   }}
                   onPressOut={()=>{
                       setPressState(false);
                       if(!longPressState){
                        console.log("Add database search func here")
                       }
                       try{props.setSwipeStatus(true)}catch(e){console.log(e)}
                   }}
                   onLongPress={()=>{setLongPressState(true)}}>
              
                   
                    {props.children}
                   
               
               </TouchableOpacity>
           </Shadow>

    )
}

export default SearchButton;