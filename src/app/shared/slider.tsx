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

const AppSlider:React.FC = props=>{

    const [sliderValue, setSliderValue] = useState(10)

    /* values on change will update Asyncstorage, only after 1 second after last change */

    return(
        <>
            <View style={{flexDirection:"column", flex:1, width: "95%"}}>
                <View style={{width: "100%", alignItems:"center"}}>

                <Text style={[{color:appColours.black, fontSize:18}, CoreStyles.contentText]}>{sliderValue}</Text>


                </View>
                
               
                <Slider
                    maximumValue={20}
                    minimumValue={5}
                    onValueChange={val=>{setSliderValue(val)}}
                    step={1}
                    tapToSeek={true}
                    style={CoreStyles.sliderStyle}
                    minimumTrackTintColor={appColours.lightGreen}
                    thumbTintColor={appColours.darkGreen}
                    maximumTrackTintColor={appColours.black}
                    value={sliderValue}
                />
            </View>
        </>
    )
};


export default AppSlider;