/* eslint-disable */

import * as types from '@customTypes/types.d';
import windowDimensions from 'app/context/dimensions';
import appColours from 'app/shared_styles/app_colours';
import {
    View,
    ViewStyle,
    Text
} from 'react-native';



const AdBanner: React.FC<types.CustomAdBannerProps> = props=>{

    let customStyles = {}

    if(props.customStyles){
        customStyles = props.customStyles

    }

    return(
        <View style={
            [adBannerStyles,
            customStyles]}>
            <Text>

                Ad banner placeholder
                
            </Text>

        </View>
    )
}

const adBannerStyles: ViewStyle = {
    height: 50,
    width: (windowDimensions.WIDTH),
    backgroundColor: appColours.black,
    position: "relative",
}

export default AdBanner;