/*eslint-disable */

import { Overlay } from '@rneui/base';
import windowDimensions from 'app/context/dimensions';
import { ViewStyle } from 'react-native';
import { Animated, Easing, View, Text  } from 'react-native';
import React from 'react';
import ContentCard from 'app/shared/content_card';
import { TouchableWithoutFeedback } from 'react-native';
import appColours from 'app/shared_styles/app_colours';
import AppButton from 'app/shared/app_button';
import CoreStyles from 'app/shared_styles/core_styles';

const UpgradePrompt = props =>{

    React.useEffect(()=>{

        Animated.timing(animatedValue, {
            duration: 500, 
            toValue: 1,
            useNativeDriver: true,
            easing: Easing.elastic(1)
        }).start()


    }, [])

    const triggerReason = props.reason

    const animatedValue = React.useRef(new Animated.Value(0)).current
    


    return(<>

        <View
            style={{
                height: windowDimensions.HEIGHT,
                width: windowDimensions.WIDTH,
                opacity: 0.5,
                backgroundColor: appColours.black
            }}
        >
        </View>

        <Animated.View
                style={{
                    transform: [
                        {
                            translateX: animatedValue.interpolate({
                                inputRange: [0,1],
                                outputRange: [-400, 0]
                            })
                        }
                    ], 
                    position: 'absolute',
                    top: windowDimensions.HEIGHT*0.15,
                    left: windowDimensions.WIDTH *0.1,
                    
                }}
            >
                <ContentCard
                    cardStylings={{
                        height: windowDimensions.HEIGHT*0.4,
                        width: windowDimensions.WIDTH*0.8
                    }}
                >
                    



                    <View>
                        {/* Reason for upgrade text */}
                        <View
                            style={{
                                height: windowDimensions.HEIGHT*0.3,
                                width: "100%",
                                justifyContent: "center"
                            }}
                        >
                            {/* Reason text rendered here, switch statement */}
                            {(()=>{
                                
                                switch (triggerReason) {
                                case "20 Limit":

                                    return(
                                    <>
                                        <Text
                                            style={CoreStyles.contentText}
                                        >
                                            You can only have only 20 entries per project as a free user. Upgrade to premium to increase the amount of entries you can have.
                                        </Text>
                                            
                                    </>)
                                        
                                    break;
                            
                                default:

                                return(<></>)

                                    break;
                            }})()
                            }


                        </View>


                        {/* Buttons container  */}
                        <View
                            style={{
                                height: windowDimensions.HEIGHT*0.1,
                                width:"100%",
                                flexDirection: "row",
                                justifyContent: "space-evenly"
                            }}
                        >
                            <View
                                style={{
                                    height: windowDimensions.HEIGHT*0.08,
                                    width: windowDimensions.WIDTH*0.3
                                }}
                            >
                                <AppButton
                                    customStyles={CoreStyles.backButtonColor}
                                    onPress={props.setVisibleFunction}
                                >
                                    <Text
                                        style={CoreStyles.backButtonText}
                                    >
                                        Close
                                    </Text>

                                </AppButton>
                            </View>

                            <View
                                style={{
                                    height: windowDimensions.HEIGHT*0.08,
                                    width: windowDimensions.WIDTH*0.3
                                }}
                            >
                                <AppButton
                                    onPress={()=>{
                                        props.navigation.navigate("Account")
                                    }}
                                >
                                    <Text
                                        style={CoreStyles.actionButtonText}
                                    >
                                        Upgrade
                                    </Text>

                                </AppButton>
                            </View>
                        </View>
                    </View>
                    
                </ContentCard>
        </Animated.View>
    </>)
}

export default UpgradePrompt