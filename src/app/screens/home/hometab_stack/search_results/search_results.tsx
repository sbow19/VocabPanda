/* eslint-disable */

import {
    View,
    Text
} from 'react-native'
import React from 'react'
import * as types from '@customTypes/types.d'
import CoreStyles from 'app/shared_styles/core_styles';
import ContentCard from 'app/shared/content_card';
import windowDimensions from 'app/context/dimensions';
import SearchResultTable from './results_table';
import AdBanner from 'app/shared/ad_banner';
import AppButton from 'app/shared/app_button';
import DefaultAppSettingsContext from 'app/context/default_app_settings_context';

const SearchResults: React.FC = props=>{

    const [appSettings] = React.useContext(DefaultAppSettingsContext)

    const gameNav = ()=>{

        props.navigation.navigate("game", {
            screen: "game home",
            params: {
                reDirectContent: true,
                gameMode: props.route.params.gameMode,
                project: props.route.params.project, //Result array given by search results
                resultArray: props.route.params.resultArray //Result array given by search results
            }
        })
    }

    return(
        <>
        <View
            style={CoreStyles.defaultScreen}
        >
            <View
                style={{
                    height: windowDimensions.HEIGHT * 0.15,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            
            >
                <ContentCard
                    cardStylings={customCardStylesHeader}
                >
                    <Text
                        style={CoreStyles.contentTitleText}
                    >
                        Results
                    </Text>

                </ContentCard>

            </View>

            <View
                style={{
                    height: windowDimensions.HEIGHT * 0.7,
                    justifyContent: "center",
                    alignItems: "center"
                }}
        
            >
                <SearchResultTable {...props} searchResults={props.route.params.resultArray}/>
            </View>

            <View
                style={{
                    height: windowDimensions.HEIGHT * 0.05,
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    flexDirection: "row"
                }}
            >
                <View
                    style={{
                    width: windowDimensions.WIDTH*0.3,
                }}>
                    <AppButton
                        onPress={()=>{
                            props.navigation.pop()
                        }}
                        customStyles={CoreStyles.backButtonColor}
                    >
                        <Text style={CoreStyles.backButtonText}
                        >Go Back
                        </Text>

                    </AppButton>
                </View>
                    

                <View
                    style={{
                    width: windowDimensions.WIDTH*0.3,
                }}>
                    <AppButton
                        onPress={()=>{
                            console.log("Export")
                        }}
                    >
                        <Text style={CoreStyles.actionButtonText}>Export</Text>
                    </AppButton>
                </View>

                <View
                    style={{
                    width: windowDimensions.WIDTH*0.3,
                }}>
                    <AppButton
                        customStyles={CoreStyles.playButtonColor}     
                        onPress={()=>gameNav()}
                    >
                        <Text style={CoreStyles.actionButtonText}>Play</Text>
                    </AppButton>
                </View>

                    
            </View>
            
        </View>

        {!appSettings.premium.premium ? <AdBanner/>:null}
        </>
    )
}

const customCardStylesHeader: types.CustomCardStyles = {

    width: windowDimensions.WIDTH * 0.9,
    height: windowDimensions.HEIGHT * 0.1,
    alignItems: "center"

}

export default SearchResults;