/* eslint-disable */

import React, {useState} from "react";
import Slider from "@react-native-community/slider";
import windowDimensions from "../context/dimensions";
import { appColours } from "../shared_styles/core_styles";
import CoreStyles from "../shared_styles/core_styles";
import {
    View,
    Text
} from'react-native'

const AppSlider:React.FC = props=>{

    const [sliderValue, setSliderValue] = useState(5)

    return(
        <>
            <View style={{flexDirection:"row", flex:1}}>
                <Text style={[{color:appColours.black}, CoreStyles.contentText]}>{sliderValue}</Text>
                <Slider
                    maximumValue={10}
                    minimumValue={5}
                    onValueChange={val=>{setSliderValue(val)}}
                    step={1}
                    tapToSeek={true}
                    style={sliderStyle}
                    minimumTrackTintColor={appColours.lightGreen}
                    thumbTintColor={appColours.darkGreen}
                    maximumTrackTintColor={appColours.black}
                    value={sliderValue}
                />
            </View>
        </>
    )
};

const sliderStyle ={

    width: (windowDimensions.WIDTH *0.5),
    height: (windowDimensions.HEIGHT *0.05)

}

export default AppSlider;