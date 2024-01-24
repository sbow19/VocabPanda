/* eslint-disable */

import CoreStyles from "@styles/core_styles"
import appColours from "@styles/app_colours"
import { 
    View,
    ViewStyle,
    Text,
    Image,
    StatusBar
} from "react-native"

const LoadingScreen: React.FC = props =>{

    return(

        <>
            <StatusBar backgroundColor={appColours.lightGreen}/>

            <View 
            style={[
                CoreStyles.defaultScreen,
                loadingScreenStyle
            ]}>
                <Image source={require("../../../assets/icons/AppIcons/android/mipmap-xxxhdpi/ic_launcher.png")}/>
                <Text style={CoreStyles.contentText}> Loading... </Text>

            </View>
        </>

    )
    
}

const loadingScreenStyle: ViewStyle = {
    
    backgroundColor: appColours.lightGreen,
    justifyContent: "center",
    alignItems: "center"

}

export default LoadingScreen