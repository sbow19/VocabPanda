/* eslint-disable */

import * as types from '@customTypes/types.d'

import React, { useContext } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    ViewStyle
} from 'react-native';
import CoreStyles from '@styles/core_styles';
import SearchButton from '@shared/search_button';
import appColours from '@styles/app_colours';

import TabSwipeStatus from '@context/swipe_toggle';
import VocabPandaTextInput from '@shared/text_input';


const VocabSearch: React.FC = props=>{

    const addedStyles: CustomButtonStyles = {
        width: 115,
        backgroundColor: appColours.lightGreen
    }

    const setSwipeStatus = useContext(TabSwipeStatus)

    return(
        
            <View style={[CoreStyles.defaultScreen, additionalStyles]}>
                <KeyboardAvoidingView behavior='padding' style={[CoreStyles.defaultScreen, additionalStyles]}>
                    <VocabPandaTextInput/>
                    <SearchButton {...props} addedStyles={addedStyles} setSwipeStatus={setSwipeStatus} >
                        <Text style={[CoreStyles.actionButtonText,]}> Search </Text>
                    </SearchButton>
                </KeyboardAvoidingView>
            </View>

    )
}

const additionalStyles: ViewStyle = {
    justifyContent: "center",
    alignItems: "center"
}

export default VocabSearch;