/* eslint-disable */

import * as types from '@customTypes/types.d'

import CoreStyles from '@styles/core_styles'
import appColours from '@styles/app_colours'

import {
    View,
    ViewStyle,
    Text,
    Keyboard,
    Pressable
} from 'react-native';

import windowDimensions from 'app/context/dimensions';

import ContentCard from '@shared/content_card'

const ScreenTemplate: React.FC = props =>{

    let ScreenTitle: string = "";

    try{
        ScreenTitle = props.screenTitle

    }catch(e){
        console.log(e);
        console.log("No screen title submitted")
    }

    return(
        <View style={[CoreStyles.defaultScreen]}>
            <Pressable onPressIn={()=>{Keyboard.dismiss()}}>
                <View
                    style={topViewContainerStyle}
                >
                    <ContentCard cardStylings={customCardStylings}>
                        <Text style={CoreStyles.contentTitleText}>
                            {ScreenTitle}
                        </Text>
                    </ContentCard>
                    
                </View>

                <View
                    style={bottomViewContainerStyle}
                >
                    {props.children}
                </View>
            </Pressable>
        </View>
    )
};

const topViewContainerStyle: ViewStyle = {
    height: (windowDimensions.HEIGHT * 0.15),
    width: windowDimensions.WIDTH,
    backgroundColor: appColours.white,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight:10

};

const bottomViewContainerStyle: ViewStyle = {
    height: (windowDimensions.HEIGHT * 0.7),
    width: windowDimensions.WIDTH,
    backgroundColor: appColours.white,
    // borderColor: "black",
    // borderWidth: 2,
    paddingLeft: 10,
    paddingRight:10,
    alignItems: "center"
};

const customCardStylings: types.CustomCardStyles = {

    width: (windowDimensions.WIDTH * 0.9),
    height: (windowDimensions.HEIGHT * 0.10),
    alignItems: "center"

}

export default ScreenTemplate;