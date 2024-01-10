/* eslint-disable */

import * as types from '@customTypes/types.d'

import React, {useState} from 'react'
import { 
    TouchableOpacity,
 } from 'react-native'

import {Header} from '@react-navigation/elements';
import appColours from '@styles/app_colours';
import CoreStyles from 'app/shared_styles/core_styles';



import {default as EntypoIcon} from 'react-native-vector-icons/Entypo'
import { default as MaterialIcon} from 'react-native-vector-icons/MaterialIcons'

const MainHeader: React.FC = props=>{

    const headerTitle = props.route.name

    return(
            <Header
                title={headerTitle}
                headerStyle={CoreStyles.mainHeaderStyles.mainHeader}
                headerTitleStyle={CoreStyles.mainHeaderStyles.mainHeaderText}
                headerTitleAlign="center"
                headerLeft={()=>{
                    return(
                        <DrawerOpen {...props}/>
                    )
                }}
                headerRight={()=>{
                    return(
                        <AccountOpen {...props}/>
                    )
                }}
            
            />         
    )
}

const DrawerOpen: React.FC = props=>{
    return(
            <TouchableOpacity onPress={()=>{

                props.navigation.openDrawer()

            }}
            style={CoreStyles.mainHeaderStyles.drawerOpenWrapperStyle}>

                <EntypoIcon 
                    name="menu" 
                    color={appColours.black}
                    size= {38}
                />
            </TouchableOpacity>

    )
}

const AccountOpen: React.FC = props=>{

    return(


            <TouchableOpacity onPress={()=>{

                props.navigation.navigate("Account")

            }}
            
            style={CoreStyles.mainHeaderStyles.accountOpenWrapperStyle}>
                <MaterialIcon 
                    name="account-circle" 
                    color={appColours.black}
                    size= {30}
                />
            </TouchableOpacity>

    )
}

export default MainHeader;