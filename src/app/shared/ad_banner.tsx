/* eslint-disable */

import * as types from '@customTypes/types.d';
import windowDimensions from 'app/context/dimensions';
import appColours from 'app/shared_styles/app_colours';
import {
    View,
    ViewStyle,
    Text
} from 'react-native';



const AdBanner = ()=>{

    return(
        <View style={adBannerStyles}>
            <Text>

                Ad banner placeholder
                
            </Text>

        </View>
    )
}

const adBannerStyles: ViewStyle = {
    height: 50,
    width: (windowDimensions.WIDTH),
    backgroundColor: appColours.black
}

export default AdBanner;