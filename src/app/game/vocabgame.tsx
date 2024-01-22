/* eslint-disable */

import {
    View,
    Text,
    ViewStyle,
    KeyboardAvoidingView,
} from 'react-native'

import * as types from '@customTypes/types.d'
import CoreStyles from 'app/shared_styles/core_styles';
import appColours from 'app/shared_styles/app_colours';
import windowDimensions from 'app/context/dimensions';
import { TouchableOpacity } from 'react-native';
import {default as FontAwesome5Icon} from 'react-native-vector-icons/FontAwesome5'
import ContentCard from 'app/shared/content_card';
import { CustomCardStyles } from '@customTypes/types.d';
import VocabPandaTextInput from 'app/shared/text_input';
import AdBanner from 'app/shared/ad_banner';
import React from 'react';
import { Formik } from 'formik';

const VocabGame: React.FC = props=>{

    /* Timer state */

    /* Points state */

    /* No of turns state */

    /*  */

    console.log(props.route.params)

    return(
        <>
            <GameHeader {...props}/>
            <AdBanner
                customStyles={{
                    marginBottom: 5
                }}
            />
            
            <View
                style={{
                    width: windowDimensions.WIDTH,
                    alignItems: "center"
                }}
            >

                <KeyboardAvoidingView>
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
                                {  
                                    lineHeight: 20,
                                    fontSize: 18
                                }
                            ]
                            }
                        >

                            Bien hecho
                        </Text>
                    </View>

                </ContentCard>

{/* These are remounted on next slide, some animation to transition */}
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
                        <Formik
                            initialValues={{input: ""}}
                            onSubmit={(values, actions)=>{

                                /* Compare to answer, trigger animation, etc  */
                                console.log(values)
                                actions.resetForm()

                            }}
                        >
                            {({values, handleChange, handleSubmit})=>(
      
                                <VocabPandaTextInput
                                        numberOfLines={4}
                                        maxLength={100}
                                        style={{
                                            height: windowDimensions.HEIGHT*0.12,
                                            width: windowDimensions.WIDTH*0.8,
                                            fontSize: 16,
                                        }}  

                                        autoFocus={true}
                                        editable={true}
                                        value={values.input}
                                        onChangeText={handleChange("input")}
                                        placeholder=''
                                        onSubmit={handleSubmit}
                                        
                                />


                            )}
                         </Formik>
                   
                    </View>
                
                </ContentCard>
                </KeyboardAvoidingView>
            </View>
        </>
    )
}

const GameHeader: React.FC = props =>{

    /* Use game state logic to determine indiv header items,*/
    return(
        <View
            style={[
                CoreStyles.mainHeaderStyles,
                {
                    backgroundColor:appColours.darkGreen,
                    flexDirection: "row",
                    height: windowDimensions.HEIGHT* 0.1,
                    borderBottomColor: appColours.black,
                    borderBottomWidth: 2,
                    width: windowDimensions.WIDTH,
                    alignItems: "center"
                }
            ]}
        >
            <View
                style={{
                    width: windowDimensions.WIDTH*0.20,
                    alignItems: "flex-end",
                }}
            >
                <TouchableOpacity
                style={
                    {
                        height: "70%",
                        width: "80%",
                        justifyContent: "center",
                        alignItems: "center",
                        elevation: 1,
                        borderRadius: 3
                    }
                }
                onPress={()=>{
                    props.navigation.pop()
                }}
                >
                    <FontAwesome5Icon name="arrow-circle-left" size={28} color={appColours.black}/>
                </TouchableOpacity>
            </View>

            <View
                style={gameStatsWrapper}
            >
                <View
                  style={{
                    height: "100%",
                    width: windowDimensions.WIDTH * 0.2,
                    justifyContent: "center"
                  }}
                >
                    <Text
                        style={CoreStyles.actionButtonText}
                    >  20/20{/* turn number */}</Text>
                </View>
                <View
                    style={{
                        height: "100%",
                        width: windowDimensions.WIDTH * 0.2,
                        justifyContent: "center"
                    }}
                >
                    <Text
                        style={CoreStyles.actionButtonText}
                    > 0:30 {/* timer, determined by length of string */}</Text>
                </View>
                <View
                    style={{
                        height: "100%",
                        width: windowDimensions.WIDTH * 0.2,
                        justifyContent: "center"
                    }}
                >
                    <Text
                        style={CoreStyles.actionButtonText}
                    > 200 {/* Points, determined by points rating system */}</Text>
                </View>

            </View>

        
        </View>
    )
}

const gameStatsWrapper: ViewStyle = {

    width: windowDimensions.WIDTH * 0.8,
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
    
}

const targetTextCard: CustomCardStyles = {

    height: windowDimensions.HEIGHT * 0.19,
    width: windowDimensions.WIDTH * 0.9,
    marginBottom:10

}

const outputTextCard: CustomCardStyles = {

    height: windowDimensions.HEIGHT * 0.19,
    width: windowDimensions.WIDTH * 0.9,
    marginBottom: 10

}

const cardTitleWrapper: ViewStyle ={

    height: windowDimensions.HEIGHT * 0.05,
    width: windowDimensions.WIDTH * 0.79,

}

const cardContentWrapper: ViewStyle = {

    height: windowDimensions.HEIGHT * 0.14,
    width: windowDimensions.WIDTH * 0.79,
    justifyContent: "center"

}
export default VocabGame;