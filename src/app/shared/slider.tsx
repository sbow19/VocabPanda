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
import DefaultGameSettingsContext from 'app/context/default_game_settings_context';
import CurrentUserContext from 'app/context/current_user';

const AppSlider:React.FC = props=>{

    const [gameSettings, setGameSettingsHandler] = React.useContext(DefaultGameSettingsContext)

    const [localSliderValue, setLocalSliderValue] = useState(10)

    React.useEffect(()=>{

        setLocalSliderValue(gameSettings.noOfTurns)

    }, [])


    return(
        <>
            <View style={{flexDirection:"column", flex:1, width: "95%"}}>
                <View style={{width: "100%", alignItems:"center"}}>

                <Text style={[{color:appColours.black, fontSize:18}, CoreStyles.contentText]}>{props.setsDefault != true ? localSliderValue : gameSettings.noOfTurns}
                
                
                </Text>


                </View>
                
               
                <Slider
                    maximumValue={20}
                    minimumValue={5}
                    onValueChange={val=>{
                        
                        if(props.setsDefault == true){
                            setGameSettingsHandler(null, val, props.setsDefault)
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
                    value={props.setsDefault != true ? localSliderValue : gameSettings.noOfTurns}
                />
            </View>
        </>
    )
};


export default AppSlider;