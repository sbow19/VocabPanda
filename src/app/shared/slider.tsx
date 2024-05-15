/* eslint-disable */

import * as types from '@customTypes/types.d';

import React, {useState} from "react";
import Slider from "@react-native-community/slider";
import appColours from "@styles/app_colours";
import CoreStyles from "@styles/core_styles";
import {
    View,
    Text
} from'react-native'
import DefaultAppSettingsContext from 'app/context/default_app_settings_context';

const parseProps = props=>{

    customProps = {

        onPress: ()=>{},
        defaultValue: 0,
        setsDefault: false,
        sliderType: ""
    }

    if(props.onPress){
        customProps.onPress = props.onPress
    }

    if(props.defaultValue === true || props.defaultValue === false){

        customProps.defaultValue = props.defaultValue;
    }

    if(props.setsDefault === true || props.setsDefault === false){

        customProps.setsDefault = props.setsDefault; 
    }

    if(props.sliderType){

        customProps.sliderType = props.sliderType;
    }


    return customProps

}

const AppSlider:React.FC = props=>{

    const [appSettings, setAppSettingsHandler] = React.useContext(DefaultAppSettingsContext);

    const [localSliderValue, setLocalSliderValue] = useState(10);

    const customProps = parseProps(props)



    React.useEffect(()=>{

        setLocalSliderValue(appSettings.userSettings.noOfTurns); //

    }, [])


    return(
        <>
            <View style={{flexDirection:"column", flex:1, width: "95%"}}>
                <View style={{width: "100%", alignItems:"center"}}>

                <Text style={[{color:appColours.black, fontSize:18}, CoreStyles.contentText]}>
                    
                    {localSliderValue}
                
                </Text>


                </View>
                
               
                <Slider
                    maximumValue={20}
                    minimumValue={5}
                    onValueChange={val=>{
                        
                        if(customProps.setsDefault == true){
                            setAppSettingsHandler(val, "noOfTurns")
                            setLocalSliderValue(val)
                        } else {
                            setLocalSliderValue(val)
                        }

                        if(customProps.onPress){

                            customProps.onPress(val)
                        }
                    
                    }}
                    step={1}
                    tapToSeek={true}
                    style={CoreStyles.sliderStyle}
                    minimumTrackTintColor={appColours.lightGreen}
                    thumbTintColor={appColours.darkGreen}
                    maximumTrackTintColor={appColours.black}
                    value={localSliderValue}
                />
            </View>
        </>
    )
};


export default AppSlider;