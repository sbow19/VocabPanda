/* eslint-disable */

import { 
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
    DrawerNavigationOptions
} from '@react-navigation/drawer';

import {
    View,
    Text,
} from 'react-native'

import {default as MaterialIcon} from 'react-native-vector-icons/MaterialIcons'
import {default as OcticonIcon} from 'react-native-vector-icons/Octicons'


import { getHeaderTitle } from '@react-navigation/elements';


import HomeStack from '../screens/home/homestack';
import Account from '../screens/account/account';
import About from '../screens/about/about';
import ManageProjectsStack from '../screens/manage_projects/manage_projects_stack';

import { appColours } from '../shared_styles/core_styles';
 import CoreStyles from '../shared_styles/core_styles';

import PlayButton from '../shared/playButton';

import MainHeader from '../shared/main_header';


const MainDrawer = createDrawerNavigator();

const AppMainDrawer: React.FC = props => {    

    /* General styles for the draw list */
    const BasicDrawerConfig: DrawerNavigationOptions = {

        drawerStyle: CoreStyles.drawerStyle ,

        header: props=>{

            return(
                <MainHeader {...props}/>
            )
        }
    };

    const BasicDrawerItemConfig: DrawerNavigationOptions = {

        drawerLabelStyle: CoreStyles.drawerLabelStyle,
        
        drawerItemStyle: CoreStyles.drawerItemStyle,

        drawerActiveBackgroundColor: appColours.darkGreen,

        drawerInactiveBackgroundColor: "rgba(43, 255, 43, 0.3)"
    }

    return(
            <MainDrawer.Navigator 
            initialRouteName="Home" 
            backBehavior='initialRoute' 
            drawerContent={(props)=>{return(<VocabDrawerContent {...props}/>)}}
            screenOptions={BasicDrawerConfig}>

                    <MainDrawer.Screen name="Home" component={HomeStack} options={{...BasicDrawerItemConfig, ...HomeSpecificConfig}}/>
                    <MainDrawer.Screen name="About" component={About} options={{...BasicDrawerItemConfig, ...AboutSpecificConfig}}/>
                    <MainDrawer.Screen name="Projects" component={ManageProjectsStack} options={{...BasicDrawerItemConfig, ...ProjectsSpecificConfig}}/>
                    <MainDrawer.Screen name="Account" component={Account} options={{...BasicDrawerItemConfig, ...AccountSpecificConfig}}/>
                
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
    }
    
}

const VocabDrawerContent = props=>{

    const navDestination = {
        screen: "game",
        screenParams: {
            screen: "MyModal"
        }
    }

    return(
    <View style={{flex: 1, justifyContent: "space-around", margin:2}}>

        <View style={{ flex: 3, justifyContent: "center", alignItems:"center" }}>
            <Text style={CoreStyles.drawerTitle}>
                Vocab Panda
            </Text>
        </View>
        <View style={{flex:9, justifyContent: "center"}}>
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        </View>
        <View style={{flex:1.5, justifyContent:"center", alignItems:"center", backgroundColor:"grey"}}>
            <PlayButton {...props} dest={navDestination}/>
        </View>
    </View>
    )
}




export default AppMainDrawer;
