/* eslint-disable */

import React from 'react';
import {
    View,
    Text
} from 'react-native';

import CoreStyles, {appColours} from '../../shared_styles/core_styles';

const About: React.FC = ()=>{

    return (
        <View style={CoreStyles.defaultScreen}>
            <Text style={CoreStyles.contentText}>
                This is the text on the screen right now and iof there is no new line then I am goino be really  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae modi ducimus soluta voluptatibus minus quibusdam laborum, fugit laudantium velit error eligendi exercitationem necessitatibus, architecto nesciunt, dolor ipsum id et labore.
            </Text>
        </View>
    )
}

export default About;