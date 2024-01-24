/* eslint-disable */

import CoreStyles from "app/shared_styles/core_styles"
import * as types from '@customTypes/types.d'
import appColours from "app/shared_styles/app_colours"
import { ActivityIndicator, View, Image } from "react-native"
import windowDimensions from "app/context/dimensions"

const GameLoadingScreen = props =>{

    return(
        <View
            style={[
                CoreStyles.defaultScreen,
                {
                    backgroundColor: appColours.lightGreen,
                    width: windowDimensions.WIDTH,
                    justifyContent: "center",
                    alignItems: "center"
                }
            ]}
        >

            <View
                style={
                    {
                        marginBottom: 20
                    }
                }
            >
                <Image source={require("../../assets/icons/AppIcons/android/mipmap-xxxhdpi/ic_launcher.png")}/>

            </View>

            <View>
                <ActivityIndicator size={"large"}/>
            </View>



        </View>

    )
}

export default GameLoadingScreen