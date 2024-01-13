/* eslint-disable */

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginHub from "./login_hub";
import LoginScreen from "./login_screen";
import CreateAccount from "./create_account";

const LoginStackNavigator = createNativeStackNavigator()

const LoginStack: React.FC = props =>{

    return(
        <LoginStackNavigator.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <LoginStackNavigator.Screen name="hub" component={LoginHub}/>
            <LoginStackNavigator.Screen name="login" component={LoginScreen}/>
            <LoginStackNavigator.Screen name="create account" component={CreateAccount}/>


        </LoginStackNavigator.Navigator>
        
    )
    
}

export default LoginStack