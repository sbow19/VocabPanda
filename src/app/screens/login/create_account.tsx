/* eslint-disable */

import CoreStyles from "app/shared_styles/core_styles"
import appColours from "app/shared_styles/app_colours"
import * as types from '@customTypes/types.d'
import SignInTemplate from "./signupscreen_template"
import windowDimensions from "app/context/dimensions"

import {
    View,
    ViewStyle,
    TouchableOpacity,
    Keyboard,
    Text
} from 'react-native'

import VocabPandaTextInput from "app/shared/text_input"
import AppButton from "app/shared/app_button"

const CreateAccount: React.FC = props=>{

    return(
        <TouchableOpacity
            onPress={()=>Keyboard.dismiss()}
            style={CoreStyles.defaultScreen}
            activeOpacity={1}
        >
            <SignInTemplate>
                

                    <View
                        style={inputWrapperStyles}
                    >
                        <VocabPandaTextInput
                            multiline={false}
                            placeholder="Enter email..."
                            placeholderTextColor="grey"
                            inputMode="email"
                            keyboardType="email-address"
                        />
                    </View>

                    <View
                        style={inputWrapperStyles}
                        
                    >
                        <VocabPandaTextInput
                            secureTextEntry={false}
                            multiline={false}
                            placeholder="Enter username..."
                            placeholderTextColor="grey"
                        />
                    </View>

                   
                    <View
                    style={inputWrapperStyles}
                    
                    >
                        <VocabPandaTextInput

                            secureTextEntry={true}
                            multiline={false}
                            placeholder="Enter password..."
                            placeholderTextColor="grey"
                        
                        />

                        
                    </View>

                    <View
                        style={inputWrapperStyles}
                    >
                        <VocabPandaTextInput
                            secureTextEntry={true}
                            multiline={false}
                            placeholder="Re-enter password..."
                            placeholderTextColor="grey"
                    
                        />    
                    </View>
                   

                    <View
                        style={[
                            inputWrapperStyles, 
                            {
                                justifyContent: "space-evenly",
                                flexDirection: "row",
                                width: windowDimensions.WIDTH *0.8
                                
                            }

                        ]}
                    >
                        <AppButton
                            customStyles={{backgroundColor:appColours.darkGreen}}
                            onPress={()=>{props.navigation.pop()}}
                        >
                            <Text style={CoreStyles.actionButtonText}>Go back</Text>
                        </AppButton>

                        <AppButton
                            customStyles={{backgroundColor:appColours.darkGreen}}
                            onPress={()=>{props.navigation.pop()}}
                        >
                            <Text style={CoreStyles.actionButtonText}>Submit</Text>
                        </AppButton>
                    </View>
            
            </SignInTemplate>
        </TouchableOpacity>
    )
}

const inputWrapperStyles: ViewStyle = {

    height: windowDimensions.HEIGHT*0.1

}


export default CreateAccount