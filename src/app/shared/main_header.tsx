/* eslint-disable */

import React, {useState} from 'react'
import { 
    TouchableOpacity,
    View
 } from 'react-native'

import {Header} from '@react-navigation/elements';
import { appColours } from '../shared_styles/core_styles';

console.log(appColours)
import CoreStyles from '../shared_styles/core_styles';


import {default as EntypoIcon} from 'react-native-vector-icons/Entypo'
import { default as MaterialIcon} from 'react-native-vector-icons/MaterialIcons'
import Account from '../screens/account/account';

const MainHeader: React.FC = props=>{

    const headerTitle = props.route.name

    return(

  
            <Header
                title={headerTitle}
                headerStyle={headerStyle}
                headerTitleStyle={headerTitleStyles}
                headerTitleAlign="center"
                headerLeftContainerStyle={headerLeftContainerStyle}
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

const headerStyle= {
    borderBottomColor: appColours.black,
    borderBottomWidth: 2,
    backgroundColor: appColours.darkGreen,
}

const headerTitleStyles = {
 
    flex:1,
    marginTop:7,
    fontFamily:"Exo2-Bold",
    fontSize: 28

}

const headerLeftContainerStyle = {
    
}

const DrawerOpen: React.FC = props=>{

    const [pressState, setPressState] = useState(false)

    return(


            <TouchableOpacity onPress={()=>{

                props.navigation.openDrawer()

            }}
            style={drawerOpenWrapperStyle}>

                <EntypoIcon 
                    name="menu" 
                    color={appColours.black}
                    size= {38}
                />
            </TouchableOpacity>

    )
}

const AccountOpen: React.FC = props=>{

    const [pressState, setPressState] = useState(false)

    return(


            <TouchableOpacity onPress={()=>{

                props.navigation.navigate("Account")

            }}
            
            style={AccountOpenWrapperStyle}>
                <MaterialIcon 
                    name="account-circle" 
                    color={appColours.black}
                    size= {30}
                />
            </TouchableOpacity>

    )
}

const drawerOpenWrapperStyle = {

    width:"50%",
    height: "80%",
    position: "relative",
    left: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    borderRadius: 3
}

const AccountOpenWrapperStyle = {

    width:"50%",
    height: "80%",
    position: "relative",
    right: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    borderRadius: 3
}

export default MainHeader;