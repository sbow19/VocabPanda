/* eslint-disable */

import { StyleSheet } from "react-native";
import windowDimensions from "../context/context";


export type CoreColours = {
    black: "#3E3B3F"
    white: "#F5F5F5"
    lightGreen: "#46EC8B"
    darkGreen: "#15CB61"
    blue: "#99F5FF"
};

export const appColours: CoreColours = {
    black: "#3E3B3F",
    white: "#F5F5F5",
    lightGreen: "#46EC8B",
    darkGreen: "#15CB61",
    blue: "#99F5FF"
}


const CoreStyles = StyleSheet.create({
    contentText: {
        color: appColours.black,
        fontFamily: "Exo2-Black",
        lineHeight: 28
    },

    defaultScreen: {
        flex: 1,
        backgroundColor: appColours.white,
        padding: 0, 
    },

    playButton: {

    },

    actionButtonText: {
        fontSize: 16,
        fontFamily: "Exo2-Bold",
        color: appColours.white
    },

    textCard: {

    },

    mainHeader: {

        height: (windowDimensions.HEIGHT * 0.075),
        backgroundColor: appColours.darkGreen,
        alignItems: "center",
        justifyContent: "center",
        borderColor: appColours.black,
        borderWidth: 5,

    },

    mainHeaderText: {

        fontSize: 20,
        color: appColours.black,
        fontFamily: "Exo2-ExtraBold",
        fontSize: 25

    },

    drawerStyle: {
        backgroundColor: appColours.white,
        width: 200,
        borderTopRightRadius: 10,
        marginTop: ((windowDimensions.HEIGHT * 0.075) -30)
    },

    drawerLabelStyle: {
        fontFamily: "Exo2-Medium",
        padding: 0,
        color: "black",
        fontSize: 18,
        flexWrap: "wrap",
    },
    
    drawerItemStyle: {
        flex: 1,
        borderColor: "black",
        borderWidth: 1,
    },

    homeTabBarStyle:{
        height: (windowDimensions.HEIGHT * 0.075 - 5),
    },

    homeTabBarLabelStyle:{
        fontFamily: "Exo2-Black",
        color: appColours.black,
        padding:0,
        margin: 0,
        fontSize: 12

    },
    homeTabBarContentContainerStyle:{
        justifyContent: "flex-start",
        backgroundColor: appColours.lightGreen,
        padding: 0,
        margin: 0,
    },
    
    homeTabBarIndicatorStyle: {
        backgroundColor: appColours.black,
        borderRadius: 10
    },
    homeTabBarIndicatorContainerStyle: {
        backgroundColor: "powderblue",
        opacity:0.5
    },

    drawerTitle: {
        fontSize: 26,
        color: appColours.black
    },
    
})

export const shadowSettings = {
    sides: {
        "start":false,
        "end":true, 
        "top":false, 
        "bottom": true
    },
    corners: {
        "topStart":false, 
        "topEnd":true, 
        "bottomStart":true, 
        "bottomEnd": true
    },
    offset: [2,3],
    distance: 2,
    endColor: appColours.blue
}




export default CoreStyles;