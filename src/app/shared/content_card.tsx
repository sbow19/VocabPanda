/*  eslint-disable */

import * as types from '@customTypes/types.d'

import {
    View, ViewStyle 
} from 'react-native'

import appColours from '@styles/app_colours';
import CoreStyles from '@styles/core_styles';

import { Shadow } from 'react-native-shadow-2';
import shadowSettings from 'app/shared_styles/shadow_settings';


const ContentCard:React.FC<types.CustomContentCardProp> = props=>{

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

            style={[
                CoreStyles.defaultCardStyles, 
                cardStylings
            ]}
        
        >
            {props.children}
        </View>
    </Shadow>
    )
}



export default ContentCard;