/* eslint-disable */

import React, { useContext } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import CoreStyles from '../../shared_styles/core_styles';
import SearchButton from '../../shared/search_button';
import { CustomButtonStyles } from '../../shared/appButton';
import { appColours } from '../../shared_styles/core_styles';

import TabSwipeStatus from '../../context/swipe_toggle';
import VocabPandaTextInput from '../../shared/text_input';


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

const additionalStyles = {
    justifyContent: "center",
    alignItems: "center"
}

export default VocabSearch;