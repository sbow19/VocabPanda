/* eslint-disable */

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VocabGame from "./vocabgame";

const VocabPandaModalStack = createNativeStackNavigator();

const VocabPandaGame: React.FC = () =>{

    return(
        <VocabPandaModalStack.Navigator screenOptions={{presentation: 'modal'}}>
            <VocabPandaModalStack.Screen name="MyModal" component={VocabGame}/>
        </VocabPandaModalStack.Navigator>
    )
}


export default VocabPandaGame;