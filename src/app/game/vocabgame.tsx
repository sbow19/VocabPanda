/* eslint-disable */

import {
    View,
    Text,
    ViewStyle,
    KeyboardAvoidingView,
    Animated,
    Easing
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
import AppButton from 'app/shared/app_button';

const VocabGame: React.FC = (props)=>{

    /* Game state object */
    const gameState = React.useRef<GameLogic>([])

    /* No of turns state */
    const [currentTurn, setCurrentTurn] = React.useState(1)

    /* Current user state */
    
    const[currentUser] = React.useContext(CurrentUserContext)

    /* Loading state */

    const [isLoading, setIsLoading] = React.useState(true)

    /* Time left */

    const [timeLeft, setTimeLeft] = React.useState<number | null>(null)

    /* Trigger end turn sequence */

    const [endTurnSequence, setEndTurnSequence] = React.useState(false)

    /* Set next button */
    const [nextButton, setNextButton] = React.useState(false)

    /* countdown interval id */
    const interval  = React.useRef({})

    /* Slide Anim target content card */
    const slideAnimTarget = React.useRef(new Animated.Value(0)).current

    /* Slide Anim target content card */
    const slideAnimOutput = React.useRef(new Animated.Value(0)).current

    /* Game Logic load */

    React.useEffect(()=>{

        if(isLoading == true){

            async function setUpGame(){
            
                /* Logic to set up game depending on the game mode */

                const myGameState=  new GameLogic(props.route.params, currentUser, props.route.params.resultArray);

                /* Then fetch game rows used for game with this line below */
                await myGameState.fetchArray();

                //Set game state to reference
                gameState.current = myGameState;

                setIsLoading(false);
        
            }
    
            setUpGame();
        }
    }, [isLoading])
    

    /* Reset timer logic on turn change */
    React.useEffect(()=>{

        //Timer doesn't start until slide in animation complete
        setTimeout(()=>{
            
            if(!isLoading){

                let thisTurnTime: number | null;

                if(gameState.current.timerOn){

                    /* Set timer if user selected timer on on select screen */

                    thisTurnTime = gameState.current.getTurnTime()

                }

                /* If timer is not on, then interval countdown not set */
                if(gameState.current.timerOn == true){

                    setTimeLeft(thisTurnTime)

                    interval.current = setInterval(()=>{

                        if(thisTurnTime > 0){

                            setTimeLeft(prevTime => prevTime-1)

                            thisTurnTime -= 1

                        } else {
                            clearInterval(interval.current)
                        }

                    }, 1000)

                    return ()=>{

                        clearInterval(interval.current)
                    }
                }
            } 
        }, 500)       

    }, [currentTurn, isLoading])

    /* Pauxe the timer when stopped */
    React.useEffect(()=>{


        if(endTurnSequence){
            /* Set turn type */
        
            clearInterval(interval.current)
        }

    }, [endTurnSequence])

    React.useEffect(()=>{

        Animated.timing(slideAnimTarget,  {
            toValue: 1,
            duration: 700,
            easing: Easing.elastic(1),
            useNativeDriver: true
        }).start()

        Animated.timing(slideAnimOutput,  {
            toValue: 1,
            duration: 700,
            easing: Easing.elastic(1),
            useNativeDriver: true
        }).start()
    },[slideAnimTarget, slideAnimOutput, currentTurn])



    const triggerNextTurn = ()=>{

        Animated.timing(slideAnimTarget,  {
            toValue: 0,
            duration: 700,
            easing: Easing.quad,
            useNativeDriver: true
        }).start()

        Animated.timing(slideAnimOutput,  {
            toValue: 0,
            duration: 700,
            easing: Easing.quad,
            useNativeDriver: true
        }).start()

        gameState.current.turnNumber = currentTurn + 1

        // Wait until above animations are done before triggering next turn (current turn), thereby restarting 
        //Animations
        setTimeout(()=>{ 

            gameState.current.setTurnType()
            
            if(currentTurn === gameState.current.noOfTurns){
                /* Trigger end game sequence when final turn reached */
                gameState.current.gameFinished = true
            } else {

                setEndTurnSequence(false)
                setNextButton(false)
                setCurrentTurn(currentTurn + 1)
            }
        }, 800)
    }

    return(
    <>
        { isLoading ? 

        <GameLoadingScreen/> : 
        
        <>
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
                
                <Animated.View
                    style={{
                        transform:[
                            {
                                translateX: slideAnimTarget.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-400, 0]
                                })
                            }
                        ]
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
                            Target Language: {
                            gameState.current.turnType === "target" ? 
                            gameState.current.gameArray[currentTurn-1].targetLanguage : 
                            gameState.current.gameArray[currentTurn-1].outputLanguage
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
                            gameState.current.gameArray[currentTurn-1].targetLanguageText : 
                            gameState.current.gameArray[currentTurn-1].outputLanguageText
                            }
                        </Text>
                    </View>
                </ContentCard>
                </Animated.View>

            {/* These are remounted on next slide, some animation to transition */}

                <Animated.View
                    style={{
                        transform:[
                            {
                                translateX: slideAnimOutput.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [400, 0]
                                })
                            }
                        ]
                    }}
                >
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
                            gameState.current.gameArray[currentTurn-1].outputLanguage : 
                            gameState.current.gameArray[currentTurn-1].targetLanguage
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
                                        gameState.current.gameArray[currentTurn-1].outputLanguageText,
                                        timeLeft
                                    )
                                } else if (gameState.current.turnType === "output"){
                                    score = gameState.current.checkAnswer(
                                        values.input,
                                        gameState.current.gameArray[currentTurn-1].targetLanguageText,
                                        timeLeft
                                    )
                                }

                                gameState.current.currentPoints = gameState.current.currentPoints + score

                                setEndTurnSequence(true)
                                
                                setTimeout(() => {

                                    setNextButton(true)
                                    
                                }, 700);
                                actions.resetForm()
                            }}
                        >
                            {({values, handleChange, handleSubmit})=>(
      
                                <VocabPandaTextInput
                                        state={currentTurn}
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
                                        keyboardType='visible-password'
                                        
                                />
                            )}
                         </Formik>
                   
                    </View>
                
                </ContentCard>
                </Animated.View>
                </KeyboardAvoidingView>
                {endTurnSequence || timeLeft === 0 ? <TurnEndCard {...props} gameState={gameState} timeLeft={timeLeft}/> : null}
                {nextButton || timeLeft === 0 ? <NextButton {...props} gameState={gameState} onPress={triggerNextTurn}/> : null}
            </View>
        </>}
    </>
    )
}

const NextButton = ({gameState, navigation, onPress})=>{

    const opacityValue = React.useRef(new Animated.Value(0)).current

    React.useEffect(()=>{

        Animated.timing(opacityValue, {

            toValue: 1,
            duration: 300,
            useNativeDriver: true
        }).start()

    }, [opacityValue])

    return(
        <Animated.View
            style={{
                opacity: opacityValue
            }}
        >
        <View
            style={{
                height: 100,
                width: 100
            }}
        >
            <AppButton
              onPress={gameState.current.noOfTurns === gameState.current.turnNumber? navigation.pop : 
            onPress}
            >
                <Text
                    style={CoreStyles.actionButtonText}
                >
                   {gameState.current.noOfTurns === gameState.current.turnNumber ? "End Game" : "Next"} 
                </Text>
            </AppButton>

        </View>
        </Animated.View>
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

    const slideInAnimEndCard = React.useRef(new Animated.Value(0)).current

    React.useEffect(()=>{
    
        Animated.timing(slideInAnimEndCard, {
            toValue: 1,
            duration: 700,
            easing: Easing.elastic(2), 
            useNativeDriver: true
        }).start()

    }, [])


    return(
        <Animated.View
            style={{
                transform: [
                    {translateX: slideInAnimEndCard.interpolate({

                        inputRange: [0, 1],
                        outputRange: [-400, 0]
                    })
                     }
                ]
            }}
        >
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
                           {props.timeLeft === 0 ? "Time's Up" : `You Scored ${props.gameState.current.lastRoundScore} Points!`}

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
        </Animated.View>
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