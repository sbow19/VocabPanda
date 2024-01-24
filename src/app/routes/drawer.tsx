/* eslint-disable */

import * as types from '@customTypes/types.d';


import appColours from '@styles/app_colours';
import CoreStyles from '@styles/core_styles';

import React from 'react';

import { 
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerNavigationOptions
} from '@react-navigation/drawer';

import {
    View,
    Text,
    Image,
    StatusBar,
} from 'react-native'

import {default as MaterialIcon} from 'react-native-vector-icons/MaterialIcons'
import {default as OcticonIcon} from 'react-native-vector-icons/Octicons'

import HomeStack from 'app/routes/homestack';
import Account from '@screens/account/account';
import About from '@screens/about/about';
import ManageProjectsStack from 'app/routes/manage_projects_stack';
import AppButton from 'app/shared/app_button';
import MainHeader from '@shared/main_header';


const MainDrawer = createDrawerNavigator();

const AppMainDrawer: React.FC = props => {  

    /* General styles for the draw list */
    const BasicDrawerConfig: DrawerNavigationOptions = {

        drawerStyle: CoreStyles.drawerStyles.drawerStyle ,

        header: props=>{

            return(
                <MainHeader {...props}/>
            )
        }
    };

    const BasicDrawerItemConfig: DrawerNavigationOptions = {

        drawerLabelStyle: CoreStyles.drawerStyles.drawerLabelStyle,
        
        drawerItemStyle: CoreStyles.drawerStyles.drawerItemStyle,

        drawerActiveBackgroundColor: appColours.darkGreen,

        drawerInactiveBackgroundColor: "rgba(43, 255, 43, 0.3)",

        overlayColor: "(rgba0,0,0,0)"
    };

    return(
            <MainDrawer.Navigator 
                initialRouteName="Home" 
                backBehavior='initialRoute' 
                drawerContent={(props)=>{return(<VocabDrawerContent {...props}/>)}}
                screenOptions={BasicDrawerConfig}
                
            >

                    <MainDrawer.Screen name="Home" component={HomeStack} options={{...BasicDrawerItemConfig, ...HomeSpecificConfig}}/>
                    <MainDrawer.Screen name="Projects" component={ManageProjectsStack} options={{...BasicDrawerItemConfig, ...ProjectsSpecificConfig}}/>
                    <MainDrawer.Screen name="Account" component={Account} options={{...BasicDrawerItemConfig, ...AccountSpecificConfig}}/>
                    <MainDrawer.Screen name="About" component={About} options={{...BasicDrawerItemConfig, ...AboutSpecificConfig}}/>
                
            </MainDrawer.Navigator>
    )
};

/* Drawer item configuration */

const HomeSpecificConfig: DrawerNavigationOptions = {

    drawerIcon: ({focused})=>{

        const IconStyles = {
            color: focused ? appColours.white : appColours.black,
            marginRight: 0 ,
            padding: 0
        }

        return(
            <OcticonIcon name='home' size={focused ? 24 : 16} style={IconStyles}/>
        )
    }

}
const AboutSpecificConfig: DrawerNavigationOptions = {

    drawerIcon: ({focused})=>{

        const IconStyles = {
            color: focused ? appColours.white : appColours.black,
            marginRight: 0 ,
            padding: 0
        }

        return(
            <MaterialIcon name='info' size={focused ? 24 : 16} style={IconStyles}/>
        )
    },
    
}
const ProjectsSpecificConfig: DrawerNavigationOptions = {

    unmountOnBlur: true,
    drawerIcon: ({focused})=>{

        const IconStyles = {
            color: focused ? appColours.white : appColours.black,
            marginRight: 0 ,
            padding: 0
        }

        return(
            <MaterialIcon name='library-books' size={focused ? 24 : 16} style={IconStyles}/>
        )
    },
    
    
}
const AccountSpecificConfig: DrawerNavigationOptions = {

    drawerIcon: ({focused, color})=>{

        const IconStyles = {
            color: focused ? appColours.white : appColours.black,
            marginRight: 0 ,
            padding: 0
        }

        return(
            <MaterialIcon name='account-circle' size={focused ? 24 : 16} style={IconStyles}/>
        )
    },
    
    
}

const VocabDrawerContent = props=>{

    const nav = ()=>{

        props.navigation.navigate("game",{
            screen: "game home",
            params: {
                reDirectContent: true,
                gameMode: "All Words",
                project: "",
                resultArray: []
            }
        })
    }

    return(
        <>
        <StatusBar backgroundColor={appColours.darkGreen} barStyle="dark-content" />
    <View style={{flex: 1, justifyContent: "space-around", margin:2}}>

        <View style={{ flex: 3, justifyContent: "center", alignItems:"center" }}>
            <Image source={require("../../assets/icons/AppIcons/android/mipmap-xhdpi/ic_launcher.png")}/>
            <Text style={CoreStyles.drawerStyles.drawerTitle}>
                Vocab Panda
            </Text>
        </View>
        <View style={{flex:9, justifyContent: "center"}}>
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        </View>
        <View style={{flex:1.5, justifyContent:"center", alignItems:"center", backgroundColor:"grey"}}>
            <AppButton {...props} onPress={nav}>
                <Text
                    style={CoreStyles.actionButtonText}
                
                >Play</Text>
            </AppButton>
        </View>
    </View>
    </>
    )
}




export default AppMainDrawer;
