/* eslint-disable */

import { View, TouchableOpacity, Text } from "react-native";
import windowDimensions from "app/context/dimensions";
import CoreStyles from "app/shared_styles/core_styles";

const UpgradeBanner: React.FC = props =>{

    return(
        <View
        style={{
            width: windowDimensions.WIDTH,
            height: windowDimensions.HEIGHT*0.04,
            backgroundColor: "orange",
            position: "relative",
            zIndex:1
            
        }}
    >
        
        {/* Render turns left if not premium version */}
        <TouchableOpacity
            style={{
                width: windowDimensions.WIDTH,
                height: windowDimensions.HEIGHT*0.04,
                alignItems: "center"
            }}
        >
            <Text
                 style={CoreStyles.contentText}
            > Upgrade to premium for full content!</Text>


        </TouchableOpacity>
    </View>
    )
}

export default UpgradeBanner;