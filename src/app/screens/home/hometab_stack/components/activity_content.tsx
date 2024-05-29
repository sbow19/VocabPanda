/* eslint-disable */

import CoreStyles from "app/shared_styles/core_styles";
import { 
    View,
    Text
 } from "react-native";
import React, {useContext} from "react";
import HomeTable from "../table/table_template_home";
import CurrentUserContext from "app/context/current_user";



const ActivityContent: React.FC = props=>{

    const [currentUser, setCurrentUser] = React.useContext(CurrentUserContext)

    return(

        <View
            style={{
                height: "100%",
                width: "100%",
                justifyContent: "space-evenly",
                alignItems: "center"
        }}
        >

            <View
                style={{
                    height: "21%",
                    width: "95%"
                }}
            
            >
                <Text
                    style={[
                        CoreStyles.contentText,
                        {lineHeight: 20,
                        fontSize: 14}
                    ]}
                > 
                    You've been busy {currentUser.username}! Here is a summary of your activity since you last logged in
                </Text>
            </View>

            <View
                style={{
                    height: "82%",
                    width: "95%"
                }}
            >
                <HomeTable {...props}/>

            </View>
            
        </View>

    )
}

export default ActivityContent;