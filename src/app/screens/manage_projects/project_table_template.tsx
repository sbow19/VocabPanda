/* eslint-disable */

import { Table, TableWrapper, Cell } from 'react-native-table-component';
import { ScrollView, View, Text, ViewStyle, TouchableOpacity } from 'react-native';
import * as types from '@customTypes/types.d'
import appColours from 'app/shared_styles/app_colours';
import windowDimensions from 'app/context/dimensions';
import CoreStyles from 'app/shared_styles/core_styles';
import React from 'react'

import RowTemplate from './project_row_template';
import OptionsOverlayContext from 'app/context/options_context';
import OptionsOverlay from './components/options_overlay';

import FullTextContext from 'app/context/view_full_text_context';
import FullTextView from 'app/shared/view_full_text';
import EditTextView from './components/edit_text_overlay';
import EditTextContext from 'app/context/edit_text_context';

import {default as MaterialIcon} from 'react-native-vector-icons/MaterialIcons'



const ResultTable = props => {

    /* options overlay state */

    const [optionsOverlayVisible, setOptionsOverlayVisible] = React.useState<boolean>(false)

    /* Options row id state */

    const [currentEntryId, setCurrentEntryId] = React.useState<string>("")

    const optionsOverlayObject: types.OptionsOverlay = {
        visible: optionsOverlayVisible,
        setOptionsOverlayVisible: setOptionsOverlayVisible,
        currentEntryId: currentEntryId,
        setCurrentEntryId: setCurrentEntryId,
        
    }

    /* View full text overlay state */

    const [fullTextVisible, setFullTextVisible] = React.useState<boolean>(false);

    const [fullText, setFullText] = React.useState<types.FullTextObject>({
        targetLanguageText: "",
        targetLanguage: "",
        outputLanguageText: "",
        outputLanguage: ""
    })

    const fullTextOverlayObject: types.FullTextOverlay = {
        visible: fullTextVisible,
        setFullTextVisible: setFullTextVisible,
        fullText: fullText,
        setFullText: setFullText
    }

    /* Edit text overlay state */

    const [editTextVisible, setEditTextVisible] = React.useState<boolean>(false);

    const [entryToEdit, setEntryToEdit] = React.useState<types.EntryDetails>({});


    const editTextOverlayObject: types.EditTextOverlay = {
        visible: editTextVisible,
        setEditTextVisible: setEditTextVisible,
        entryToEdit: entryToEdit,  //Result row attached to options 
        setEntryToEdit: setEntryToEdit//Allows the refresh after editing entry
    }

    const [deletedRowId, setDeletedRowId] = React.useState<string>("")

    /* All search results provided by project view */
    const [resultRows, setResultRows] = React.useState<Array<types.EntryDetails>>(props.searchResults); //Set array of entries.

    /* Displaye result rows */
    const [displayedResultRows, setDisplayedResultRows] = React.useState<Array<types.EntryDetails>>([])

    /* Set page number to be displayed on table */
    const [pageNumber, setPageNumber] = React.useState<number>(1);

    /* No of pages */
    const noOfPages = React.useRef(1)

    /* set the no of pages*/
    React.useMemo(()=>{

        const resultRowsLength = resultRows.length;

        noOfPages.current = Math.floor(resultRowsLength / 15) + 1 // Max number of rows displayed is 15

    }, [resultRows])

    //Trigger update of rows when entry to edi changes
    React.useEffect(()=>{

    if(Object.keys(entryToEdit).length > 0){

        const newResultRows = resultRows.map(row => {
        
            if(row["entryId"] === entryToEdit["entryId"]){
                return entryToEdit
            } else {
                return row
            }

        });

        setResultRows(newResultRows)
        
    }
    }, [entryToEdit])

    //Setting which 15 entries to display
    React.useEffect(()=>{

        const displayedRowsStartIndex = (pageNumber * 15) - 15
        const displayedRowsEndIndex = (pageNumber * 15)
        const displayedRows = resultRows.slice(displayedRowsStartIndex, displayedRowsEndIndex)
        
        const listLength = displayedRows.length;
        const resultRowsComp = [];

        console.log(displayedRows)


        for(let i=0; i < listLength ; i++){

            let resultRow = displayedRows[i];

            resultRowsComp.push(<RowTemplate {...props} key={resultRow["entryId"]} resultRow={resultRow}/>)
        }
        setDisplayedResultRows(resultRowsComp)
        

    }, [pageNumber, resultRows])

    //Trigger delete row based on id selected
    React.useEffect(()=>{

        if(typeof deletedRowId === "string"){

            const newResultRows = resultRows.filter(row => row["entryId"] != deletedRowId)

            setResultRows(newResultRows)
            
        }
    }, [deletedRowId])

  


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
                            style={[
                                headerCellStyle,
                                {borderTopStartRadius: 10}
                            ]}
                            data="Target Text"
                            textStyle={CoreStyles.contentText}
                        />

                        <Cell
                            style={headerCellStyle}
                            data="Output Text"
                            textStyle={CoreStyles.contentText}          
                        />

                        <Cell
                            style={headerCellStyleButton}
                            data=""
                            textStyle={CoreStyles.contentText}          
                        />
                    </TableWrapper>
            </Table>
        </View>


        <EditTextContext.Provider value={editTextOverlayObject}>
        <FullTextContext.Provider value={fullTextOverlayObject}>
        <OptionsOverlayContext.Provider value={optionsOverlayObject}>
            <View
                style={
                    [
                        bodyWrapper
                    ]}
            >
                <ScrollView>
                    <View onStartShouldSetResponder={()=>true}>
                        <Table>
                            {/* Results displayed here in rows */}
                            {displayedResultRows}
                        </Table>
                        
                    </View>
                </ScrollView>

                {/* Page number for results */}
                <View
                    style={{
                        width: "100%",
                        height: windowDimensions.HEIGHT* 0.075,
                        borderColor: appColours.black,
                        borderWidth: 2,
                        borderRadius: 10,
                        flexDirection: "row",
                        backgroundColor: appColours.paleGreen
                    }}
                >
                    <View
                        style={{
                            width: "25%",
                            height: windowDimensions.HEIGHT* 0.07,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                backgroundColor: appColours.lightGreen,
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 40,
                                height: "95%",
                                width: "55%"
                            }}
                            onPress={()=>{
                                if(pageNumber > 1){
                                    setPageNumber(prevNum => prevNum - 1)
                                }
                            }}
                            
                        >
                            <MaterialIcon name='keyboard-arrow-left' size={40}/>
                        </TouchableOpacity>

                    </View>
                    <View
                        style={{
                            width: "50%",
                            height: windowDimensions.HEIGHT* 0.07,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <View>
                            <Text
                                style={CoreStyles.backButtonText}
                            >
                                Page {pageNumber} / {noOfPages.current}

                            </Text>

                        </View>

                    </View>
                    <View
                        style={{
                            width: "25%",
                            height: windowDimensions.HEIGHT* 0.07,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                backgroundColor: appColours.lightGreen,
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 40,
                                height: "95%",
                                width: "55%"
                            }}
                            onPress={()=>{
                                if(pageNumber < noOfPages.current){
                                    setPageNumber(prevNum => prevNum + 1)
                                }
                            }}
                        >
                            <MaterialIcon name='keyboard-arrow-right' size={40}/>
                        </TouchableOpacity>

                    </View>

                </View>
                
            </View>

            <OptionsOverlay setDeletedRowId={setDeletedRowId}/>
            <FullTextView/>
            <EditTextView/>

        </OptionsOverlayContext.Provider>
        </FullTextContext.Provider>
        </EditTextContext.Provider>

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

    height: windowDimensions.HEIGHT * 0.54,
    width: windowDimensions.WIDTH * 0.98,
    borderColor: "black",
    borderWidth: 2,
    borderBottomEndRadius: 12,
    borderBottomStartRadius: 12
}

const wrapperStyle: ViewStyle = {
    flexDirection: "row"
}

const headerCellStyle ={

    height: windowDimensions.HEIGHT*0.05,
    backgroundColor: appColours.lightGreen,
    flex: 4,
    alignItems:"center",

}

const headerCellStyleButton: ViewStyle ={

    height: windowDimensions.HEIGHT*0.05,
    backgroundColor: appColours.lightGreen,
    flex: 1,
    borderTopEndRadius: 10

}

export default ResultTable;