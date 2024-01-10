/* eslint-disable */

import * as types from '@customTypes/types.d';

import {
    StyleProp,
    TextInput,
    TextStyle
} from 'react-native';

import { useState } from 'react'

import windowDimensions from '@context/dimensions';
import appColours from '@styles/app_colours';

const VocabPandaTextInput: React.FC = props =>{

    const [active, setActive] = useState(false);


    return(<>

    <TextInput
        style={[additionalStyles, 
            {
                backgroundColor: !active ? appColours.white : "rgba(217, 254, 217, 1)",
                borderColor: !active ? appColours.black : appColours.blue
            }
        ]}
        onFocus={()=>{
            console.log("Hello ")
            setActive(true);
        }}
        onBlur={()=>{
            setActive(false);
        }}

    />
    
    </>)
};

const additionalStyles:StyleProp<TextStyle> = {
    width: windowDimensions.WIDTH*0.6,
    height: windowDimensions.HEIGHT*0.05,
    borderRadius:5,
    borderColor: appColours.black,
    borderWidth:2,
    fontFamily: "Exo2-Medium",
    color: appColours.black,
    elevation: 5

}

export default VocabPandaTextInput; 