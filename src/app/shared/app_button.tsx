/* eslint-disable */

import * as types from '@customTypes/types.d'

import React, {useState} from 'react';

import { 
    TouchableOpacity
} from 'react-native';

import appColours from '@styles/app_colours';
import shadowSettings from 'app/shared_styles/shadow_settings';
import { Shadow } from 'react-native-shadow-2';
import TabSwipeStatus from 'app/context/swipe_toggle';

function parseProps(props: types.CustomButtonStylesProp){

    const customProps: types.CustomButtonStylesProp = {
        customStyles: {},
        onPress: ()=>{},

    }

    try{
        customProps.customStyles = props.customStyles

    }catch(e){
        console.log(e)
    }

    try{
        customProps.onPress = props.onPress

    }catch(e){
        console.log(e)

    }



    return customProps
}

const AppButton: React.FC<types.CustomButtonStylesProp> = props =>{

    const [pressState, setPressState] = useState(false);
    const [longPressState, setLongPressState] = useState(false)

    const setSwipeStatus = React.useContext(TabSwipeStatus);


    const customProps:types.CustomButtonStylesProp = parseProps(props);


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
                   }, customProps.customStyles]}
                   activeOpacity={1}
                   onPress={
                    ()=>{
                        if(!longPressState){customProps.onPress()}
                    }
                    }   
                   onPressIn={()=>{
                       setPressState(true);
                       setLongPressState(false);
                       setSwipeStatus(false)
                   }}
                   onPressOut={()=>{
                       setPressState(false);
                       setSwipeStatus(true);
                   }}
                   onLongPress={()=>{setLongPressState(true)}}>
              
                   
                    {props.children}
                   
               
               </TouchableOpacity>
           </Shadow>

    )
}

export default AppButton;