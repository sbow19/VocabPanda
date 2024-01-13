/* eslint-disable */

import { StyleSheet } from "react-native";
import windowDimensions from "@context/dimensions";
import appColours from "@styles/app_colours";
import * as types from '@customTypes/types.d'

const CoreStyles = StyleSheet.create({
    contentText: {
        color: appColours.black,
        fontFamily: "Exo2-Black",
        lineHeight: 28
    },

    contentTitleText: {
        color: appColours.black,
        fontFamily: "Exo2-Black",
        fontSize: 24

    },

    defaultScreen: {
        flex: 1,
        backgroundColor: appColours.white,
        padding: 0, 
        width: "100%"
    },

    actionButtonText: {
        fontSize: 16,
        fontFamily: "Exo2-Bold",
        color: appColours.white
    },
    
    mainHeaderStyles:
    {
        mainHeader: {
            borderBottomColor: appColours.black,
            borderBottomWidth: 2,
            backgroundColor: appColours.darkGreen,
        },

        mainHeaderText: {
            flex:1,
            marginTop:10,
            fontFamily:"Exo2-Bold",
            fontSize: 22,
            width: (windowDimensions.WIDTH * 0.27),
            paddingLeft:10
        },

        accountOpenWrapperStyle: {

            width:"50%",
            height: "80%",
            position: "relative",
            right: 20,
            justifyContent: "center",
            alignItems: "center",
            elevation: 1,
            borderRadius: 3
        },

        drawerOpenWrapperStyle: {

            width:"50%",
            height: "80%",
            position: "relative",
            left: 20,
            justifyContent: "center",
            alignItems: "center",
            elevation: 1,
            borderRadius: 3
        }


    },

    drawerStyles:{
        drawerStyle: {
            backgroundColor: appColours.white,
            width: 200,
            borderTopRightRadius: 10,
            marginTop: ((windowDimensions.HEIGHT * 0.075) -30),
            height: windowDimensions.HEIGHT* 0.965,
            borderColor: appColours.black,
            borderWidth: 1.5
            
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
        drawerTitle: {
            fontSize: 26,
            color: appColours.black,
            fontFamily: "Exo2-ExtraBold"
        }
    },

    homeTabNavBarStyles: {
        homeTabBarStyle:{
            height: (windowDimensions.HEIGHT * 0.075 - 5),
        },
        homeTabBarLabelStyle:{
            fontFamily: "Exo2-Black",
            color: appColours.black,
            padding:0,
            margin: 0,
            fontSize: 11
        },
        homeTabBarLabelFocusedStyle:{
            fontFamily: "Exo2-Black",
            color: appColours.black,
            padding:0,
            margin: 0,
            fontSize: 12,
        },
     
        homeTabBarItemStyle:{
            borderColor: appColours.blue,
            borderWidth: 2,
            justifyContent: "center",
            backgroundColor: appColours.lightGreen,
            padding: 0,
            margin: 0,
            
        },
        
        homeTabBarIndicatorStyle: {
            backgroundColor: appColours.black,
            borderRadius: 10
        },
    },

    sliderStyle: {
        width: (windowDimensions.WIDTH * 0.5),
        height: (windowDimensions.HEIGHT * 0.05)
    },

    dropDownStyles: {
        dropdownContainerStyle: {
            backgroundColor: appColours.white,
            borderColor: appColours.black,
            borderWidth: 2,
            width: (windowDimensions.WIDTH * 0.8),
            borderRadius: 10,
            paddingLeft: 5,
            elevation: 10,
        },

        buttonContainerStyle: {
            backgroundColor: appColours.white,
            borderRadius:10,
            elevation: 10,
            borderColor: appColours.black,
            borderWidth: 2,
            padding: 5,
            width: (windowDimensions.WIDTH * 0.8),
        },

        buttonTextStyle: {

            fontSize: 14,
            fontFamily: "Exo2-Regular",
            color: appColours.black

        },

        rowTextStyle: {
            fontSize: 14,
            fontFamily: "Exo2-Regular",
            color: appColours.black
        }
    }
    
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