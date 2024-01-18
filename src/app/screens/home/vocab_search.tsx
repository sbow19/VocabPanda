/* eslint-disable */

import * as types from '@customTypes/types.d'

import React, { useContext } from 'react';
import {
    View,
    Text,
    ViewStyle,
    TouchableOpacity
} from 'react-native';
import CoreStyles from '@styles/core_styles';
import appColours from '@styles/app_colours';

import ScreenTemplate from 'app/shared/homescreen_template';
import VocabPandaTextInput from '@shared/text_input';
import Dropdown from 'app/shared/dropdown';

import ContentCard from '@shared/content_card'

import AdBanner from '@shared/ad_banner';
import windowDimensions from 'app/context/dimensions';
import AppButton from 'app/shared/app_button';

import { Formik } from 'formik';
import * as yup from 'yup'
import UpgradeBanner from 'app/shared/upgrade_banner';


const VocabSearch: React.FC<types.CustomButtonStylesProp> = props=>{

    const data: types.ProjectList = ["First proj", "vocab", "Spain"];

    const [currentProjectSelection, setCurrentProjectSelection] = React.useState("");

    const resultsNav = ()=>{

        props.navigation.navigate("results")
    }


    return(
        
            <View style={[CoreStyles.defaultScreen, additionalStyles, {height: windowDimensions.HEIGHT}]}>

                {/* Render depending on upgrade status */}
                <UpgradeBanner/>

                <ScreenTemplate screenTitle="Search Your Vocabulary!">

                    <ContentCard cardStylings={searchCardStyles}>

                        <View  style={{justifyContent:"center", flex:1} }>
                            <Text
                            style={[
                                CoreStyles.contentTitleText,
                                {fontSize: 20}
                            ]}>
                                Search by matches...
                            </Text>
                        </View>

                            <Formik
                                initialValues={{input: ""}}
                                onSubmit={(values, actions)=>{

                                    resultsNav()
                                    console.log(values.input)
                                    actions.resetForm()

                                }}
                                validationSchema={searchInputSchema}
                            >

                                {({values, handleChange, handleSubmit})=>(

                                    <>
                                        <View  style={{justifyContent:"center", flex:1.1} }>

                                            <VocabPandaTextInput 
                                                                        
                                            style={customTextInputStyle}
                                            placeholder='Type...'
                                            value={values.input}
                                            onChangeText={handleChange('input')}
                                            />

                                        </View>

                                        <View style={{justifyContent:"center", flex:1.2} }>
                                            <AppButton 
                                                onPress={handleSubmit}
                                            >
                                                <Text style={CoreStyles.actionButtonText}> Search </Text>
                                            </AppButton>
                                        </View>

                                    </>
                                )}

                            </Formik>


                    </ContentCard>

                    <ContentCard cardStylings={dropdownCardStyles}>

                        <View  style={{justifyContent:"center", flex:1} }>
                            <Text
                                style={[
                                    CoreStyles.contentTitleText,
                                    {fontSize: 20}
                                ]}
                            >
                                ...or by Project

                            </Text>
                        </View>

                        <View  style={{justifyContent:"center", flex:1.1} }>
                            <Dropdown
                                data={data}
                                defaultButtonText="Choose Project"
                                setSelection={setCurrentProjectSelection}
                            />
                        </View>

                        <View style={{justifyContent:"center", flex:1.2} }>
                            <AppButton
                                onPress={resultsNav}
                            >
                                <Text style={CoreStyles.actionButtonText}> Search </Text>
                            </AppButton>
                        </View>
                    </ContentCard>
                    
                        
                </ScreenTemplate> 
                <AdBanner/>
            </View>

    )
}

const customTextInputStyle: ViewStyle = {

    width: windowDimensions.WIDTH * 0.8

}

const searchCardStyles: types.CustomCardStyles = {

    width: windowDimensions.WIDTH * 0.9,
    height: windowDimensions.HEIGHT * 0.27,
    marginBottom: 20,
    alignItems: "center"

};

const dropdownCardStyles: types.CustomCardStyles = {

    width: windowDimensions.WIDTH * 0.9,
    height: windowDimensions.HEIGHT * 0.27,
    alignItems: "center"

}

const additionalStyles: ViewStyle = {
    justifyContent: "center",
    alignItems: "center"
}

const searchInputSchema = yup.object({
    input: yup.string()
        .max(24)
})

export default VocabSearch;