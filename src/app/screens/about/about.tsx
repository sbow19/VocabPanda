/* eslint-disable */

import React from 'react';
import {
    View,
    Text,
    ScrollView
} from 'react-native';

import CoreStyles, {appColours} from '../../shared_styles/core_styles';

import ContentCard from '../../shared/content_card';

const About: React.FC = ()=>{

    return (
        <View style={{...CoreStyles.defaultScreen, ...additionalStyles}}>
            <ScrollView>
            <View style={{marginTop: 10}}>
                <ContentCard cardStylings={cardStylings}>
                    <Text style={CoreStyles.contentText}>
                        This is the text on the screen right now and iof there is no new line then I am goino be really  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae modi ducimus soluta voluptatibus minus quibusdam laborum, fugit laudantium velit error eligendi exercitationem necessitatibus, architecto nesciunt, dolor ipsum id et labore.
                    </Text>
                </ContentCard>
            </View>
            <View style={{marginTop: 10}}>
                <ContentCard cardStylings={cardStylings}>
                    <Text style={CoreStyles.contentText}>
                        This is the text on the screen right now and iof there is no new line then I am goino be really  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae modi ducimus soluta voluptatibus minus quibusdam laborum, fugit laudantium velit error eligendi exercitationem necessitatibus, architecto nesciunt, dolor ipsum id et labore.
                    </Text>
                </ContentCard>
            </View>
            <View style={{marginTop: 10}}>
                <ContentCard cardStylings={cardStylings}>
                    <Text style={CoreStyles.contentText}>
                        This is the text on the screen right now and iof there is no new line then I am goino be really  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae modi ducimus soluta voluptatibus minus quibusdam laborum, fugit laudantium velit error eligendi exercitationem necessitatibus, architecto nesciunt, dolor ipsum id et labore.
                    </Text>
                </ContentCard>
            </View>
            </ScrollView>
        </View>
    )
}

const cardStylings = {
    width: 300,
    height: 300,

};

const additionalStyles = {
    alignItems: "center",
    marginTop: 10
};

export default About;