/* eslint-disable */

import * as types from '@customTypes/types.d'

import React, {useContext} from 'react';
import {
    View,
} from 'react-native';
import CoreStyles from '@styles/core_styles';
import PlayButton from '@shared/play_button';
import ContentCard from '@shared/content_card';

import TabSwipeStatus from '@context/swipe_toggle';
import VocabPandaTextInput from '@shared/text_input';

const HomeScreen = (props: Object) =>{

    const navDestination: types.destination = {
        screen: "game",
        screenParams: {
            screen: "MyModal"
        }
    }

    const setSwipeStatus = useContext(TabSwipeStatus)



return (
   
        <View style={[CoreStyles.defaultScreen, {justifyContent: "center", alignItems:"center"}]}>
             <ContentCard {...props} cardStylings={cardStylings}>
                <VocabPandaTextInput/>
                <PlayButton {...props} dest={navDestination} setSwipeStatus={setSwipeStatus}/>
            </ContentCard>
        </View>

)
}

const cardStylings: types.CustomCardStyles = {
    height: 200,
    width:200,
}

export default HomeScreen;