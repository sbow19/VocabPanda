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
import GameLoadingScreen from './loading_screen ';

import GameLogic from './game _logic/game_logic';
import CurrentUserContext from 'app/context/current_user';
import UserDatabaseContext from 'app/context/current_user_database';
import AppButton from 'app/shared/app_button';

const VocabGame: React.FC = props=>{

    /* Game state object */

    const gameState = React.useRef([])

    /* No of turns state */
    const [currentTurn, setCurrentTurn] = React.useState(1)

    /* Current user state */
    
    const[currentUser] = React.useContext(CurrentUserContext)

    /* Current user database object */
    const[databaseObject] = React.useContext(UserDatabaseContext)

    /* Loading state */

    const [isLoading, setIsLoading] = React.useState(true)

    /* Time left */

    const [timeLeft, setTimeLeft] = React.useState(null)

    /* Trigger end turn sequence */

    const [endTurnSequence, setEndTurnSequence] = React.useState(false)

    /* Set next button */

    const [nextButton, setNextButton] = React.useState(false)

    /* Game Logic load */

    React.useEffect(()=>{

        if(isLoading == true){

            async function setUpGame(){


                let myGameState=  new GameLogic(props.route.params, currentUser, databaseObject)

                await myGameState.fetchArray()

                gameState.current = myGameState

                /* Then fetch game rows used for game with this line below */

                setIsLoading(false)
        
            }
    
            setUpGame()
        }
    }, [isLoading])
    

    /* Reset timer logic on turn change */
    React.useEffect(()=>{

        if(!isLoading){

            let thisTurnTime;

             /* Set turn type */
             gameState.current.getTurnType

            if(gameState.current.timerOn){

                /* Set timer if user selected timer on on select screen */

                thisTurnTime = gameState.current.getTurnTime()

            }

            /* If timer is not on, then interval countdown not set */
            if(gameState.current.timerOn == true){

                setTimeLeft(thisTurnTime)

                let interval = setInterval(()=>{

                    if(thisTurnTime > 0){

                        setTimeLeft(prevTime => prevTime-1)

                        thisTurnTime -= 1

                    } else {
                        clearInterval(interval)
                    }

                }, 1000)

                return ()=>{

                    clearInterval(interval)
                }
            }
        }        

    }, [currentTurn, isLoading])

    const triggerNextTurn = ()=>{


        if(currentTurn === gameState.current.noOfTurns){
            /* Trigger end game sequence when final turn reached */
        } else {

            setEndTurnSequence(false)
            setNextButton(false)

            gameState.current.turnNumber = currentTurn + 1
            setCurrentTurn(currentTurn + 1)
        }
    }


    return(
    <>
        { isLoading ? 

        (<GameLoadingScreen/>) : 
        
        (<>
            <GameHeader {...props} gameState={gameState} timeLeft={timeLeft}/>
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
                            Target Language: {
                            gameState.current.turnType === "target" ? 
                            gameState.current.gameArray[currentTurn-1].target_language_lang : 
                            gameState.current.gameArray[currentTurn-1].output_language_lang
                            }
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
                            {
                            gameState.current.turnType === "target" ? 
                            gameState.current.gameArray[currentTurn-1].target_language : 
                            gameState.current.gameArray[currentTurn-1].output_language
                            }
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
                            Output Language: {
                            gameState.current.turnType === "target" ? 
                            gameState.current.gameArray[currentTurn-1].output_language_lang : 
                            gameState.current.gameArray[currentTurn-1].target_language_lang
                            }
                        </Text>
                    </View>
                    <View
                        style= {cardContentWrapper}
                    >
                        <Formik
                            initialValues={{input: ""}}
                            onSubmit={(values, actions)=>{

                                /* Pause timer */
                                /* Score determiner */
                                let score: number = 0;

                                if(gameState.current.turnType === "target"){
                                    score = gameState.current.checkAnswer(
                                        values.input, 
                                        gameState.current.gameArray[currentTurn-1].output_language,
                                        timeLeft
                                    )
                                } else if (gameState.current.turnType === "output"){
                                    score = gameState.current.checkAnswer(
                                        values.input,
                                        gameState.current.gameArray[currentTurn-1].target_language,
                                        timeLeft
                                    )
                                }


                                gameState.current.currentPoints = gameState.current.currentPoints + score

                                setEndTurnSequence(true)
                                setNextButton(true)
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
                {endTurnSequence ? <TurnEndCard gameState={gameState}/> : null}
                {nextButton ? <NextButton {...props} onPress={triggerNextTurn}/> : null}
            </View>
        </>)}
    </>
    )
}

const NextButton = props=>{

    return(
        <View
            style={{
                height: 100,
                width: 100
            }}
        >
            <AppButton
              onPress={props.onPress}
            >
                <Text
                    style={CoreStyles.actionButtonText}
                >
                    Next
                </Text>
            </AppButton>

        </View>
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
                    >  
                        {
                            `${props.gameState.current.turnNumber} / ${props.gameState.current.noOfTurns}`
                        }
                    </Text>
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
                    > 
                    
                     {props.gameState.current.timerOn ? props.timeLeft : null}
                     
                    </Text>
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
                    > 
                        {props.gameState.current.currentPoints}
                    </Text>
                </View>
            </View>
        </View>
    )
}

const TurnEndCard = props =>{


    return(
        <ContentCard
            cardStylings={endTurnCardStyle}
        >
             <View style= {[
                cardTitleWrapper,
                {justifyContent: "flex-start", alignItems: "center"}
            ]}>
                        <Text
                            style={
                                [
                                    CoreStyles.contentTitleText,
                                    {fontSize: 18}
                                ]}
                        >
                            You Scored {props.gameState.current.lastRoundScore} Points!

                        </Text>
            </View>

            <View>
                <View
                    style= {cardContentWrapper}
                >
                    <Text
                    style={
                        [
                            CoreStyles.contentTitleText,
                            {fontSize: 18}
                        ]}>
                        Answer: {props.gameState.current.lastRoundAnswer}
                    </Text>
                </View>

            </View>

        </ContentCard>
    )
}

const endTurnCardStyle: ViewStyle = {

    width: windowDimensions.WIDTH * 0.85,
    height: windowDimensions.HEIGHT * 0.25,
    justifyContent: "space-evenly",
    marginBottom: 10
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
    marginBottom: 30

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