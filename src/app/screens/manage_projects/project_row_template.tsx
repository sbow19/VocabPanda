/* eslint-disable */
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { ScrollView, View, Text, ViewStyle, TouchableOpacity } from 'react-native';
import appColours from 'app/shared_styles/app_colours';
import windowDimensions from 'app/context/dimensions';
import CoreStyles from 'app/shared_styles/core_styles';

import OptionsOverlayContext from 'app/context/options_context';
import React, { useContext } from 'react';

import FullTextContext from 'app/context/view_full_text_context';

import {default as SimpleIcon} from 'react-native-vector-icons/SimpleLineIcons'

const RowTemplate: React.FC = props=>{

    const optionsObject = useContext(OptionsOverlayContext)

    const fullTextOverlayObject = useContext(FullTextContext)

    console.log

    const options =  ()=>{

        return(
            <TouchableOpacity
                style={{
                    backgroundColor: appColours.black,
                    height: 32,
                    width: 32,
                    borderRadius: 16,
                    alignItems: "center",
                    justifyContent: "center"
                }}

                onPress={()=>{
                    optionsObject.setOptionsOverlayVisible(!optionsObject.visible)
                }}
                
            >
                <SimpleIcon name="options-vertical" size={24} color={appColours.white}/>
            </TouchableOpacity>
        )

    }

    const targetLang =  ()=>{

        return(
            <TouchableOpacity
                style={{
                    height: "100%", 
                    width: "100%",
                    backgroundColor: "rgba(217, 254, 217, 1)",
                    borderRadius: 10
                }}
                onPress={()=>{
                    fullTextOverlayObject.setFullTextVisible(!fullTextOverlayObject.visible)
                }}
            >
                <View
                    style={{height: "100%", width: "100%", padding: 3}}
                    
                >
                    
                    <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={
                            [
                                CoreStyles.contentText,
                                {
                                    fontSize: 12,
                                    lineHeight: 20
                                }

                            ]}
                    >
                        {/* Language prefix */}
                        
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo quos ullam sequi. Debitis, soluta sapiente! Illum repellendus accusantium facere odio exercitationem eligendi quisquam explicabo ducimus sint ea tenetur, ad temporibus!
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    const outputLang =  ()=>{

        return(
            <TouchableOpacity
                style={{
                    height: "100%", 
                    width: "100%",
                    backgroundColor: "rgba(217, 254, 217, 1)",
                    borderRadius: 10
                }}
                onPress={()=>{
                    fullTextOverlayObject.setFullTextVisible(!fullTextOverlayObject.visible)
                }}
            >
                <View
                    style={{height: "100%", width: "100%", padding: 3}}
                    
                >
                    <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={
                            [
                                CoreStyles.contentText,
                                {
                                    fontSize: 12,
                                    lineHeight: 20
                                }

                            ]}
                    >
                        {/* Language prefix */}

                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo quos ullam sequi. Debitis, soluta sapiente! Illum repellendus accusantium facere odio exercitationem eligendi quisquam explicabo ducimus sint ea tenetur, ad temporibus!
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    return(<>

                    <TableWrapper
                        style={wrapperStyle}    
                    >

                        <Cell
                            style={targLangCellStyle}
                            data={targetLang()}
                            textStyle={CoreStyles.contentText}
                        />

                        <Cell
                            style={outputLangCellStyle}
                            data={outputLang()}
                            textStyle={CoreStyles.contentText}
                            
                        />

                        <Cell
                            style={buttonCellStyle}
                            data={options()}
                            textStyle={CoreStyles.contentText}          
                        />

                    </TableWrapper>
            
            </>
    )
}

export default RowTemplate


const targLangCellStyle = {

    height: windowDimensions.HEIGHT*0.08,
    backgroundColor: appColours.white,
    flex:4,
    margin:2,
    alignItems: "center"}

const outputLangCellStyle:ViewStyle = {

    height: windowDimensions.HEIGHT*0.08,
    backgroundColor: appColours.white,
    flex: 4,
    margin: 2,
    alignItems: "center",
    
}

const buttonCellStyle = {

    height: windowDimensions.HEIGHT*0.08,
    backgroundColor: appColours.white,
    flex:1,
    alignItems: "center",
    margin: 1
}

const wrapperStyle: ViewStyle = {
    flexDirection: "row"
}