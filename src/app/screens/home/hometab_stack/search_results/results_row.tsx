/* eslint-disable */
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { ScrollView, View, Text, ViewStyle, TouchableOpacity } from 'react-native';
import appColours from 'app/shared_styles/app_colours';
import windowDimensions from 'app/context/dimensions';
import CoreStyles from 'app/shared_styles/core_styles';
import FullTextContext from 'app/context/view_full_text_context';
import React from 'react';

const ResultsRowTemplate: React.FC = props=>{

    /* Full text view context */

    const fullTextOverlayObject = React.useContext(FullTextContext)

    const projectNav = ()=>{

        props.navigation.navigate("Projects", {
            screen: "project view",
            params: {
                project: "Hello"
            }
        })
    }

    const options =  data=>{

        return(

            <TouchableOpacity
            style={{
                height: "100%", 
                width: "100%",
                backgroundColor: "rgba(217, 254, 217, 1)",
                borderRadius: 10
            }}
            onPress={()=>{
                projectNav()
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

    const targetLang =  data=>{

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

    const outputLang =  data=>{

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

    return(

                <TableWrapper
                        style={wrapperStyle}    
                    >

                        <Cell
                            style={targCellStyle}
                            data={targetLang(props)}
                            textStyle={CoreStyles.contentText}
                        />

                        <Cell
                            style={outputCellStyle}
                            data={outputLang(props)}
                            textStyle={CoreStyles.contentText}
                            
                        />

                        <Cell
                            style={projectCellStyle}
                            data={options(props)}
                            textStyle={CoreStyles.contentText}          
                        />

                    </TableWrapper>
    )
}

export default ResultsRowTemplate


const targCellStyle = {

    height: windowDimensions.HEIGHT*0.08,
    backgroundColor: appColours.white,
    flex:3,
    margin:2,
    alignItems: "center",
    justifyContent: "center"

}

const outputCellStyle:ViewStyle = {

    height: windowDimensions.HEIGHT*0.08,
    backgroundColor: appColours.white,
    flex: 3,
    margin: 2,
    alignItems: "center",
    justifyContent: "center"
    
}

const projectCellStyle = {

    height: windowDimensions.HEIGHT*0.08,
    flex:1.5,
    alignItems: "center",
    margin: 1,
    backgroundColor: "rgba(217, 254, 217, 1)",
    justifyContent: "center"
    
}

const wrapperStyle: ViewStyle = {
    flexDirection: "row"
}
