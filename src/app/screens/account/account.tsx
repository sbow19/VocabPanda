/* eslint-disable */

import * as types from '@customTypes/types.d'

import React from 'react';
import {
    ScrollView,
    View,
    ViewStyle, 
    Text,
    Alert,
} from 'react-native';
import CoreStyles from '@styles/core_styles';
import ContentCard from 'app/shared/content_card';
import windowDimensions from 'app/context/dimensions';
import AppButton from 'app/shared/app_button';
import appColours from 'app/shared_styles/app_colours';

import { Overlay } from '@rneui/base';
import LoggedInStatus from 'app/context/loggedIn';
import VocabPandaTextInput from 'app/shared/text_input';


const Account: React.FC = props=>{

    /* Get sign in context here */

    const [isLoggedIn, setIsLoggedIn] = React.useContext(LoggedInStatus)
    /* use free/premium status here */

    const [emailOverlay, setEmailOverlay] = React.useState(false)
    const [passwordOverlay, setPasswordOverlay] = React.useState(false)
    const [usernameOverlay, setUsernameOverlay] = React.useState(false)


    const signOutAlert = ()=>{

        Alert.alert(
            "Sign out",
            "Are you sure you want to sign out?",
            [
                {
                    text: "Go back",
                    onPress: ()=>{}
                },
                {
                    text: "Sign out",
                    onPress: ()=>{
                        /* trigger sign out procedure */
                        setIsLoggedIn(false)
                    }
                }

            ],
            {
                cancelable: true
            }
        )

    }

    return (
        <ScrollView
        contentContainerStyle={[{ flexGrow: 1 }, {marginTop: 10}]}      
        >
            <View style={
                [
                    CoreStyles.defaultScreen,
                    {alignItems: "center"}
                ]}
            >
                <ContentCard

                    cardStylings={signInCardStyle}
                
                >
                    <AppButton
                        customStyles={signOutButtonStyle}
                        onPress={signOutAlert}
                    >
                        <Text style={[CoreStyles.actionButtonText, {color: appColours.black}]}> Sign Out </Text>
                    </AppButton>

                </ContentCard>

                <ContentCard
                    cardStylings={manageCardStyle}
                >
                     <AppButton
                        customStyles={manageButtonStyle}
                        onPress={()=>setEmailOverlay(true)}
                        
                    >
                        <Text style={[CoreStyles.actionButtonText]}> Change E-mail  </Text>
                    </AppButton>

                    <AppButton
                        customStyles={manageButtonStyle}
                        onPress={()=>{setPasswordOverlay(true)}}
                        
                    >
                        <Text style={[CoreStyles.actionButtonText]}> Change Password </Text>
                    </AppButton>

                    <AppButton
                        customStyles={manageButtonStyle}
                        onPress={()=>{setUsernameOverlay(true)}}
                    >
                        <Text style={[CoreStyles.actionButtonText]}> Change Username</Text>
                    </AppButton>
                    
                </ContentCard>

                <UpgradeContentCard/>

                <ContentCard
                    cardStylings={signInCardStyle}
                >
                    <AppButton
                        customStyles={deleteAccountButton}
                    >
                        <Text style={[CoreStyles.actionButtonText]}> Delete Account </Text>
                    </AppButton>
                    
                </ContentCard>

                <Overlay
                    isVisible={emailOverlay}
                    overlayStyle={customOverlayStyles}
                >
                     <ContentCard
                     cardStylings={overlayCardStyle}
                    >
                        <Text> Your email is ...</Text>
                        <VocabPandaTextInput
                            multiline={false}
                            placeholder="Enter email..."
                            placeholderTextColor="grey"
                            inputMode="email"
                            keyboardType="email-address"

                        />

                    </ContentCard>

                    <View style={{flex:1, flexDirection: "row", justifyContent: "space-evenly"}}>
                        <AppButton
                            onPress={()=>setEmailOverlay(false)}
                        >
                            <Text style={CoreStyles.actionButtonText}>
                                Close
                            </Text>

                        </AppButton>

                        <AppButton>
                            <Text style={CoreStyles.actionButtonText}>
                                Set
                            </Text>
                        </AppButton>

                    </View>
                   

                </Overlay>

                <Overlay
                    isVisible={passwordOverlay}
                    overlayStyle={customOverlayStyles}
                
                >
                     <ContentCard
                     cardStylings={overlayCardStyle}
                    >
                        <VocabPandaTextInput
                            secureTextEntry={true}
                            multiline={false}
                            placeholder="Enter password..."
                            placeholderTextColor="grey"

                        />
                        <VocabPandaTextInput
                            secureTextEntry={true}
                            multiline={false}
                            placeholder="Re-enter password..."
                            placeholderTextColor="grey"
                        />

                    </ContentCard>

                    <View style={{flex:1, flexDirection: "row", justifyContent: "space-evenly"}}>
                        <AppButton
                            onPress={()=>setPasswordOverlay(false)}
                        >
                            <Text style={CoreStyles.actionButtonText}>
                                Close
                            </Text>

                        </AppButton>

                        <AppButton>
                            <Text style={CoreStyles.actionButtonText}>
                                Set
                            </Text>
                        </AppButton>

                    </View>
                    
                </Overlay>

                <Overlay
                    isVisible={usernameOverlay}
                    overlayStyle={customOverlayStyles}
                
                >
                      <ContentCard
                     cardStylings={overlayCardStyle}
                    >
                        <Text> Your username is ...</Text>
                        <VocabPandaTextInput
                            secureTextEntry={false}
                            multiline={false}
                            placeholder="Enter username..."
                            placeholderTextColor="grey"

                        />

                    </ContentCard>

                    <View style={{flex:1, flexDirection: "row", justifyContent: "space-evenly"}}>
                        <AppButton
                            onPress={()=>setUsernameOverlay(false)}
                        >
                            <Text style={CoreStyles.actionButtonText}>
                                Close
                            </Text>

                        </AppButton>

                        <AppButton>
                            <Text style={CoreStyles.actionButtonText}>
                                Set
                            </Text>
                        </AppButton>

                    </View>    
                </Overlay>


                
            </View>
        </ScrollView>
    )
}

const signInCardStyle = {

    height: windowDimensions.HEIGHT*0.15,
    marginBottom: 20,
    width: windowDimensions.WIDTH * 0.9,
    alignItems:"center"
};

const manageCardStyle: types.CustomCardStyles = {

    height: windowDimensions.HEIGHT *0.4,
    width: windowDimensions.WIDTH * 0.9,
    marginBottom: 20,
    justifyContent: "space-evenly",
    alignItems:"center",
};

const manageButtonStyle: types.CustomButtonStyles = {

    width: windowDimensions.WIDTH * 0.42
}

const signOutButtonStyle: types.CustomButtonStyles = {

    backgroundColor: appColours.white
}

const upgradeCardStyle: types.CustomCardStyles = {

    height: windowDimensions.HEIGHT * 0.3,
    marginBottom: 20,
    width: windowDimensions.WIDTH * 0.9,
    alignItems: "center",
    justifyContent: "space-evenly"
}

const deleteAccountButton: types.CustomButtonStyles =  {

    backgroundColor: "red"
}

const customOverlayStyles: ViewStyle = {

    height: windowDimensions.HEIGHT * 0.45,
    width: windowDimensions.WIDTH * 0.85,
    backgroundColor: appColours.white,
    borderRadius: 10,
    borderColor: appColours.black,
    borderWidth: 2,
    justifyContent: "space-evenly"

}

const overlayCardStyle: ViewStyle = {

    marginBottom: 20,
    width: windowDimensions.WIDTH * 0.75,
    height: windowDimensions.HEIGHT * 0.3,
    justifyContent: "space-evenly"

}


const UpgradeContentCard: React.FC = props =>{
    return(
        <ContentCard
                    cardStylings={upgradeCardStyle}
                >
                    <View>
                        <Text style={CoreStyles.contentText}> 
                            You are currently using the free version of Vocab Panda. For unlimited flashcard turns and more vocab storage, you an upgrade to premium for £3.49!
                        </Text>
                    </View>
                    <View>
                        <AppButton
                        >
                           <Text style={CoreStyles.actionButtonText}>
                                Upgrade
                           </Text> 
                        </AppButton>
                    </View>
                    
        </ContentCard>
    )
}




export default Account;