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

const AppSlider:React.FC = props=>{

    const [appSettings, setAppSettingsHandler] = React.useContext(DefaultAppSettingsContext)

    const [localSliderValue, setLocalSliderValue] = useState(10)

    React.useEffect(()=>{

        setLocalSliderValue(appSettings.gameSettings.noOfTurns)

    }, [])


    return(
        <>
            <View style={{flexDirection:"column", flex:1, width: "95%"}}>
                <View style={{width: "100%", alignItems:"center"}}>

                <Text style={[{color:appColours.black, fontSize:18}, CoreStyles.contentText]}>{props.setsDefault != true ? localSliderValue : appSettings.gameSettings.noOfTurns}
                
                
                </Text>


                </View>
                
               
                <Slider
                    maximumValue={20}
                    minimumValue={5}
                    onValueChange={val=>{
                        
                        if(props.setsDefault == true){
                            setAppSettingsHandler(null, val, props.setsDefault)
                            setLocalSliderValue(val)
                        } else {
                            setLocalSliderValue(val)
                        }
                    
                    }}
                    step={1}
                    tapToSeek={true}
                    style={CoreStyles.sliderStyle}
                    minimumTrackTintColor={appColours.lightGreen}
                    thumbTintColor={appColours.darkGreen}
                    maximumTrackTintColor={appColours.black}
                    value={props.setsDefault != true ? localSliderValue : appSettings.gameSettings.noOfTurns}
                />
            </View>
        </>
    )
};


export default AppSlider;