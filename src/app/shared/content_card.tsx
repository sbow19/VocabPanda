/*  eslint-disable */

import {
    View 
} from 'react-native'

import { appColours } from '../shared_styles/core_styles';

import { Shadow } from 'react-native-shadow-2';
import { shadowSettings } from '../shared_styles/core_styles';


type CustomCardStyles = {
    height?: number
    width?: number
    backgroundColor?: string
    borderRadius?: number
};

const ContentCard:React.FC = props=>{

    const {cardStylings} = props 

    return(
    <Shadow 
        distance={3}
        startColor={appColours.black}
        endColor={appColours.white}
        offset={shadowSettings.offset}
        sides={shadowSettings.sides}
        corners={shadowSettings.corners}
    >
        <View 

            style={[defaultCardStylings, cardStylings]}
        
        >
            {props.children}
        </View>
    </Shadow>
    )
}

const defaultCardStylings = {

    backgroundColor: "rgba(217, 254, 217, 1)",
    opacity: 1,
    height: 100,
    width: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: appColours.black,
    justifyContent: "center",
    paddingLeft: 5

}


export default ContentCard;