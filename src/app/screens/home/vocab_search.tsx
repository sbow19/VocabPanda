/* eslint-disable */

import React from 'react';
import {
    View,
    TextInput,
    Text
} from 'react-native';
import CoreStyles from '../../shared_styles/core_styles';
import SearchButton from '../../shared/search_button';
import { CustomButtonStyles } from '../../shared/appButton';
import { appColours } from '../../shared_styles/core_styles';

const VocabSearch: React.FC = props=>{

    const addedStyles: CustomButtonStyles = {
        width: 115,
        backgroundColor: appColours.lightGreen
    }

    return(
        <View style={CoreStyles.defaultScreen}>
            <SearchButton {...props} addedStyles={addedStyles}>
                <Text style={[CoreStyles.actionButtonText,]}> Search </Text>
            </SearchButton>

        </View>
    )
}

export default VocabSearch;