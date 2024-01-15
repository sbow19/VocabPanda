/* eslint-disable */

import {
    View,
    Text
} from 'react-native'

import * as types from '@customTypes/types.d'
import CoreStyles from 'app/shared_styles/core_styles';
import appColours from 'app/shared_styles/app_colours';
import ContentCard from 'app/shared/content_card';
import windowDimensions from 'app/context/dimensions';
import SearchResultTable from './results_table';
import AdBanner from 'app/shared/ad_banner';
import AppButton from 'app/shared/app_button';

const SearchResults: React.FC = props=>{

    const gameNav = ()=>{

        props.navigation.pop()
        props.navigation.navigate("game")
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
                <SearchResultTable {...props}/>
            </View>

            <View
                style={{
                    height: windowDimensions.HEIGHT * 0.05,
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    flexDirection: "row"
                }}
            >
                    <AppButton
                        onPress={()=>{
                            props.navigation.pop()
                        }}
                        customStyles={backButton}
                    >
                        <Text style={
                            [
                            
                                CoreStyles.actionButtonText,
                                {color: appColours.black}
                            ]
                        }
                        >Go Back
                        </Text>

                    </AppButton>

                    <AppButton
                        onPress={()=>{
                            console.log("Export")
                        }}
                    >
                        <Text style={CoreStyles.actionButtonText}>Export</Text>
                    </AppButton>

                    <AppButton
                        customStyles={playButton}     
                        onPress={()=>gameNav()}
                    >
                        <Text style={CoreStyles.actionButtonText}>Play</Text>
                    </AppButton>
            </View>
            
        </View>
        <AdBanner/>
        </>
    )
}

const customCardStylesHeader: types.CustomCardStyles = {

    width: windowDimensions.WIDTH * 0.9,
    height: windowDimensions.HEIGHT * 0.1,
    alignItems: "center"

}

const backButton: types.CustomButtonStyles = {
    backgroundColor: appColours.white
}

const playButton: types.CustomButtonStyles = {
    backgroundColor: appColours.darkGreen,
}

export default SearchResults;