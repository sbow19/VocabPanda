/* eslint-disable */

import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { ScrollView, View, Text, ViewStyle, TouchableOpacity } from 'react-native';
import appColours from 'app/shared_styles/app_colours';
import windowDimensions from 'app/context/dimensions';
import CoreStyles from 'app/shared_styles/core_styles';

import RowTemplate from './row_template';


const ResultTable = props => {

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
                        <RowTemplate/>
                        <RowTemplate/>
                        <RowTemplate/>
                        <RowTemplate/>
                        <RowTemplate/>
                        <RowTemplate/>
                        <RowTemplate/>
                        <RowTemplate/>
                        <RowTemplate/>
                        <RowTemplate/>
                        <RowTemplate/>
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
    width: windowDimensions.WIDTH * 0.98,

}

const bodyWrapper: ViewStyle = {

    height: windowDimensions.HEIGHT * 0.54,
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