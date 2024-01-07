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


import { getHeaderTitle } from '@react-navigation/elements';

import HomeStack from '../screens/home/homestack';
import Account from '../screens/account/account';
import About from '../screens/about/about';
import ManageProjectsStack from '../screens/manage_projects/manage_projects_stack';
import { useContext } from 'react';
import WindowDimensions from '../context/context';



const MainDrawer = createDrawerNavigator();

const AppMainDrawer: React.FC = () => {

    const {height} = useContext(WindowDimensions)

    
    /* General styles for the draw list */
    const BasicDrawerConfig: DrawerNavigationOptions = {

        drawerStyle:{
            backgroundColor: '#c6cbef',
            width: 200,
            marginTop: ((height * 0.075) -30),
            borderTopRightRadius: 10,
            elevation: 1,
            shadowColor: "black"

        },

        header: ({route, options})=>{

            const title = getHeaderTitle(options, route.name);

            return(
                <View style={{height: (height * 0.075)}}>
                    <Text style={{color:"black"}}> {title}</Text>
                </View>
            )
        }
    }

    return(
            <MainDrawer.Navigator 
            initialRouteName="Home" 
            backBehavior='initialRoute' 
            drawerContent={(props)=>{return(<VocabDrawerContent {...props}/>)}}
            screenOptions={BasicDrawerConfig}>

                    <MainDrawer.Screen name="Home" component={HomeStack} options={BasicDrawerItemConfig}/>
                    <MainDrawer.Screen name="About" component={About} options={BasicDrawerItemConfig}/>
                    <MainDrawer.Screen name="Manage Projects" component={ManageProjectsStack} options={BasicDrawerItemConfig}/>
                    <MainDrawer.Screen name="Account" component={Account} options={BasicDrawerItemConfig}/>
                
            </MainDrawer.Navigator>
    )
};

const BasicDrawerItemConfig: DrawerNavigationOptions = {

    drawerLabelStyle: {
        fontFamily: "Exo2-Medium",
        padding: 0,
        color: "black",
        fontSize: 16,
    },
    
    drawerItemStyle: {
        flex: 1,
        borderColor: "black",
        borderWidth: 1
    }
}

const VocabDrawerContent = (props)=>{

    return(
    <View style={{flex: 1, justifyContent: "space-around"}}>

        <View style={{ flex: 3, justifyContent: "center", alignItems:"center", elevation:1, shadowColor: "black" }}>
            <Text style={{ fontSize: 26, fontFamily: "Exo2-Bold"}}>
                Vocab Panda
            </Text>
        </View>
        <View style={{flex:9, justifyContent: "center"}}>
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        </View>
        <View style={{flex:1}}>
            <DrawerItem 
                    
                    label="Test Yourself"
                    onPress={()=>{
                        /* Render game modal */
                        console.log("Hello world");
                        props.navigation.navigate('game', {screen: "MyModal"})
                        
                    }}

                    style={{
                        backgroundColor: "red",
                        justifyContent: "center", 
                        padding: 0,
                        marginLeft: 10
                    }}

                    labelStyle={{
                        fontFamily: "Exo2-BoldItalic"
                    }}
                    />
        </View>
    </View>
    )
}




export default AppMainDrawer;
