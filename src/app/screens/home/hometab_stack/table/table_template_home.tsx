/* eslint-disable */

import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { ScrollView, View, Text, ViewStyle, TouchableOpacity } from 'react-native';
import appColours from 'app/shared_styles/app_colours';
import windowDimensions from 'app/context/dimensions';
import CoreStyles from 'app/shared_styles/core_styles';

import HomeRowTemplate from './row_template_home';
import LastActivity from 'app/context/last_activity';
import React from 'react';


const HomeTable = props => {

    /* Use last activity data here to gain access to data */

    const lastActivityObject = React.useContext(LastActivity)


    /* Full table content */

    const lastActivityDataCleanUp = ()=>{

        let sortingObject = {}
        let lastActivityResultArray = lastActivityObject.lastActivityResultArray
        let lastActivityResultArrayLength = lastActivityObject.lastActivityResultArray.length

        for (let i=0 ; i < lastActivityResultArrayLength ; i++){

            let entry = lastActivityResultArray[i]


            if(!sortingObject[entry.project]){

                sortingObject[entry.project] = {
                    projectName: entry.project,
                    noOfAdditions: 0,
                    resultArray: []
                }
            }

            if(sortingObject[entry.project]){

                sortingObject[entry.project].noOfAdditions += 1

                sortingObject[entry.project].resultArray.push(entry)

            }
        }

        return sortingObject
    }

    const storedSortingObject = React.useMemo(()=>{
        
        let result = lastActivityDataCleanUp();

        return result
    }, [])

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
                            data="Project"
                            textStyle={CoreStyles.contentText}
                        />

                        <Cell
                            style={headerCellStyle}
                            
                            data="Number of Additions"
                            textStyle={CoreStyles.contentText}          
                        />

                    </TableWrapper>
            </Table>
        </View>

        <View
            style={
                [
                    bodyWrapper
                ]}
        >
            <ScrollView>
                <View onStartShouldSetResponder={()=>true}>
                    <Table>
                        {/* Results displayed here in rows, use loop to render list, with props added for data */}
                        {(()=>{

                            let resultRowsComp = []
                            let sortingObject = storedSortingObject
                            

                                for(let project of Object.keys(sortingObject)){

                                    let projectName = project
                                    let noOfAdditions = sortingObject[project].noOfAdditions
                                    let resultArray = sortingObject[project].resultArray

                                    resultRowsComp.push(<HomeRowTemplate {...props} key={project} project={projectName} noOfAdditions={noOfAdditions} resultArray={resultArray}/>)

                 
                                }
                            
                            return resultRowsComp


                        })()}
                    </Table>
                </View>
            </ScrollView>
        </View>
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
    width: windowDimensions.WIDTH * 0.85,

}

const bodyWrapper: ViewStyle = {

    height: windowDimensions.HEIGHT * 0.30,
    width: windowDimensions.WIDTH * 0.85,
    borderColor: "black",
    borderWidth: 2,
    backgroundColor: appColours.white
}

const wrapperStyle: ViewStyle = {
    flexDirection: "row"
}

const headerCellStyle: ViewStyle ={

    height: windowDimensions.HEIGHT*0.05,
    backgroundColor: appColours.lightGreen,
    flex: 4,
    alignItems:"center",
    borderTopStartRadius: 10,
    borderTopEndRadius: 10
}


export default HomeTable;