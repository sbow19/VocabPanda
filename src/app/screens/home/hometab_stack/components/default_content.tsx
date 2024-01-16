/* eslint-disable */

import CoreStyles from "app/shared_styles/core_styles";
import { 
    View,
    Text
 } from "react-native";
import React, {useContext} from "react";
import * as types from "@customTypes/types.d"


const DefaultContent: React.FC = props=>{

    
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
                    width: "80%"
                }}
            >
                <Text
                    style={[
                        CoreStyles.contentText,
                        {fontSize: 20}
                    ]}
                >
                    There has been no activity since you last logged in.
                </Text>
            </View>
            




        </View>
            
    

    )
}

export default DefaultContent;