/* eslint-disable */

import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import GameHome from "./game_start_screen";
import VocabGame from "./vocabgame";
import CoreStyles from "app/shared_styles/core_styles";
import {default as FontAwesome5Icon} from 'react-native-vector-icons/FontAwesome5'

import {
    View,
    Text,
    TouchableOpacity
 } from 'react-native'
import appColours from "app/shared_styles/app_colours";
import windowDimensions from "app/context/dimensions";

const GameStackNavigator = createNativeStackNavigator();

const GameStack = props=>{

    /* General styles for the draw list */
    const gameSettingsConfig: NativeStackNavigationOptions = {

        header: ()=><SettingsHeader {...props}/>
        
    };

    return(
        <GameStackNavigator.Navigator 
            screenOptions={{}}
        >

            <GameStackNavigator.Screen name="game home" component={GameHome} options={gameSettingsConfig}/>
            <GameStackNavigator.Screen name="vocab game" component={VocabGame} options={{
                headerShown: false
            }}/>

        </GameStackNavigator.Navigator>
    )
}

const SettingsHeader: React.FC = props =>{


    return(
        <View
            style={[
                CoreStyles.mainHeaderStyles,
                {
                    backgroundColor:appColours.darkGreen,
                    flexDirection: "row",
                    height: windowDimensions.HEIGHT* 0.08,
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
                        height: "90%",
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
                style={{
                    width: windowDimensions.WIDTH*0.6,
                    alignItems: "center"
                }}
            >

                <Text
                    style={[
                        CoreStyles.contentTitleText,
                        {fontSize: 22}
                    ]}
                > Flashcards </Text>

            </View>
            <View
                style={{
                    width: windowDimensions.WIDTH*0.20,
                    alignItems: "flex-start"
                }}
            >

                <TouchableOpacity
                    style={{
                        height: "90%",
                        width: "80%",
                        justifyContent: "center",
                        alignItems: "center",
                        elevation:1,
                        borderRadius: 3
                    
                    }}
                >
                    <FontAwesome5Icon name="info-circle" size={28} color={appColours.black}/>
                </TouchableOpacity>

            </View>
        </View>
    )
}






export default GameStack