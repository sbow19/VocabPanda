/* eslint-disable */

import { Overlay } from "@rneui/base"
import AppButton from "app/shared/app_button"
import { 
    Text, 
    ViewStyle, 
    View } 
from "react-native"
import CoreStyles from "app/shared_styles/core_styles"
import appColours from "app/shared_styles/app_colours"
import React from 'react'
import EditTextContext from "app/context/edit_text_context"
import windowDimensions from "app/context/dimensions"
import ContentCard from "app/shared/content_card"
import { CustomCardStyles } from "app/types/types.d"

const EditTextView: React.FC  = props=>{


    const editTextOverlayObject = React.useContext(EditTextContext)

    return(
        <Overlay
            isVisible={editTextOverlayObject.visible}
            overlayStyle={overlayStyle}
            backdropStyle={{
                opacity: 0.1
            }}
        >
            <ContentCard
                cardStylings={targetTextCard}
            >
                <View
                     style= {cardTitleWrapper}
                >
                    <Text
                        style={
                            [
                                CoreStyles.contentTitleText,
                                {fontSize: 18}
                            ]}
                    >
                        Target Language: {/* Target language placeholder */}
                    </Text>
                </View>
                <View
                    style= {cardContentWrapper}
                >
                    <Text
                        style={[
                            CoreStyles.contentText, 
                            { lineHeight: 20}
                        ]
                        }
                    >

                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, illo? Quasi nihil eius ratione quisquam eum, iusto obcaecati aperiam animi ipsam
                    </Text>
                </View>

            </ContentCard>

            <ContentCard
                cardStylings={outputTextCard}
            >
                 <View
                    style= {cardTitleWrapper}
                 >
                    <Text
                        style={
                            [
                                CoreStyles.contentTitleText,
                                {fontSize: 18}
                            ]}
                    >
                        Output Language: {/* Output language placeholder */}
                    </Text>
                </View>
                <View
                    style= {cardContentWrapper}
                >
                    <Text
                         style={[
                            CoreStyles.contentText, 
                            { lineHeight: 20}
                        ]
                        }
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, illo? Quasi nihil eius ratione quisquam eum, iusto obcaecati aperiam animi ipsam

                    </Text>
                </View>

            </ContentCard>


            <View
                style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "center",
                    height: windowDimensions.HEIGHT * 0.06
                }}
            >
                <AppButton
                    onPress={()=>{
                        editTextOverlayObject.setEditTextVisible(!editTextOverlayObject.visible)
                    }}
                >

                    <Text
                        style={CoreStyles.actionButtonText}
                    >Close
                    </Text>
                </AppButton>
            </View>

        </Overlay>
    )
}

const overlayStyle: ViewStyle = {

    height: windowDimensions.HEIGHT * 0.55,
    width: windowDimensions.WIDTH * 0.9,
    backgroundColor: appColours.white,
    borderRadius: 10,
    borderColor: appColours.black,
    borderWidth: 2,
    justifyContent: "space-evenly"
    
}

const targetTextCard: CustomCardStyles = {

    height: windowDimensions.HEIGHT * 0.2,
    width: windowDimensions.WIDTH * 0.8,
    marginBottom: 10

}

const outputTextCard: CustomCardStyles = {

    height: windowDimensions.HEIGHT * 0.2,
    width: windowDimensions.WIDTH * 0.8,
    marginBottom: 10

}

const cardTitleWrapper: ViewStyle ={

    height: windowDimensions.HEIGHT * 0.05,
    width: windowDimensions.WIDTH * 0.79,

}

const cardContentWrapper: ViewStyle = {

    height: windowDimensions.HEIGHT * 0.14,
    width: windowDimensions.WIDTH * 0.79

}
export default EditTextView