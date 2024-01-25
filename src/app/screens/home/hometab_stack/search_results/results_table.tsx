/* eslint-disable */

import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { ScrollView, View, Text, ViewStyle, TouchableOpacity } from 'react-native';
import appColours from 'app/shared_styles/app_colours';
import windowDimensions from 'app/context/dimensions';
import CoreStyles from 'app/shared_styles/core_styles';
import React from 'react'

import ResultsRowTemplate from './results_row';

import FullTextView from 'app/shared/view_full_text';
import FullTextContext from 'app/context/view_full_text_context';

type FullTextObject = {
    target_language: string,
    target_language_lang: string,
    output_language: string,
    output_language_lang: string
}

const SearchResultTable = props => {

    /* View full text overlay state */

    const [fullTextVisible, setFullTextVisible] = React.useState(false);

    const [fullText, setFullText] = React.useState<FullTextObject>({
        target_language: "",
        target_language_lang: "",
        output_language: "",
        output_language_lang: ""
    })

    const fullTextOverlayObject = {
        visible: fullTextVisible,
        setFullTextVisible: setFullTextVisible,
        resultTextObject: fullText,
        setFullText: setFullText
    }

    return (

    <View
        style={
            [
                tableWrapperStyle
            ]
        }
    >
        <View
            style={
                [
                    headerWrapper
                ]}
        >
            <Table style={{headerWrapper}}>
                    <TableWrapper
                        style={wrapperStyle}
                    >
                        <Cell
                            style={headerCellStyle}
                            data="Target Text"
                            textStyle={CoreStyles.contentText}
                        />

                        <Cell
                            style={headerCellStyle}
                            data="Output Text"
                            textStyle={CoreStyles.contentText}          
                        />

                        <Cell
                            style={headerCellStyleProject}
                            data="Project"
                            textStyle={CoreStyles.contentText}          
                        />
                    </TableWrapper>
            </Table>
        </View>

        <FullTextContext.Provider value={fullTextOverlayObject}>
        <View
            style={
                [
                    bodyWrapper
                ]}
        >
            <ScrollView>
                <View onStartShouldSetResponder={()=>true}>
                    <Table>
                        {/* Results displayed here in rows; support pagination of up to 20, 100 per proj */}
                        {
                            (()=>{
                                
                                let listLength = props.searchResults.length
                                let resultRows = []

                                for(let i=0; i < listLength ; i++){

                                    let resultRow = props.searchResults[i]

                                    resultRows.push(<ResultsRowTemplate {...props} key={i} resultRow={resultRow}/>)

                                }

                                return resultRows
                            
                            })()
                        }
                       
                    </Table>
                </View>
            </ScrollView>

            <FullTextView/>
        </View>
        </FullTextContext.Provider>
    </View>
    )
}

    /* custom data parse */

const tableWrapperStyle: ViewStyle = {

    flex: 1, 
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center"
}

const headerWrapper: ViewStyle = {

    height: windowDimensions.HEIGHT * 0.05,
    width: windowDimensions.WIDTH * 0.98,

}

const bodyWrapper: ViewStyle = {

    height: windowDimensions.HEIGHT * 0.60,
    width: windowDimensions.WIDTH * 0.98,
    borderColor: "black",
    borderWidth: 2
}

const wrapperStyle: ViewStyle = {
    flexDirection: "row"
}

const headerCellStyle ={

    height: windowDimensions.HEIGHT*0.05,
    backgroundColor: appColours.lightGreen,
    flex: 3,
    alignItems:"center",
    borderTopStartRadius: 10,
    borderTopEndRadius: 10

}

const headerCellStyleProject: ViewStyle ={

    height: windowDimensions.HEIGHT*0.05,
    backgroundColor: appColours.lightGreen,
    flex: 1.8,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    alignItems:"center",

}

export default SearchResultTable;