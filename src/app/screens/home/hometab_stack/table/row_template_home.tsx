/* eslint-disable */
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { ScrollView, View, Text, ViewStyle, TouchableOpacity } from 'react-native';
import appColours from 'app/shared_styles/app_colours';
import windowDimensions from 'app/context/dimensions';
import CoreStyles from 'app/shared_styles/core_styles';

const HomeRowTemplate: React.FC = props=>{

    /* Results row */

    const resultsNav= ()=>{

        props.navigation.navigate("results", {
                
            resultArray: props.resultArray,
            project: props.project,
            gameMode: "Latest Activity - By Project"
            
        })
    }
    


    const projectName =  props=>{

        return(
                <TouchableOpacity
                    style={{
                        height: "100%", 
                        width: "100%",
                        backgroundColor: "rgba(217, 254, 217, 1)",
                        borderRadius: 10,
                        justifyContent: "center"
                    }}

                    onPress={resultsNav}
                    
                >
                    
                    <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={
                            [
                                CoreStyles.contentText,
                                {
                                    fontSize: 16,
                                    lineHeight: 20
                                }

                            ]}
                    >
                        {
                            props.project
                        }
                    </Text>
                </TouchableOpacity>
        )
    }

    const numberOfAdditions =  props=>{

        return(
        
                <TouchableOpacity
                    style={{
                        height: "100%", 
                        width: "100%",
                        backgroundColor: "rgba(217, 254, 217, 1)",
                        borderRadius: 10,
                        justifyContent: "center"
                    }}
                    onPress={resultsNav}
                    
                >
                    <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={
                            [
                                CoreStyles.contentText,
                                {
                                    fontSize: 16,
                                    lineHeight: 20
                                }

                            ]}
                    >
                        {props.noOfAdditions}
                    </Text>
                </TouchableOpacity>
        )
    }

    return(

                <TableWrapper
                        style={wrapperStyle}    
                    >

                        <Cell
                            style={targLangCellStyle}
                            data={projectName(props)}
                            textStyle={CoreStyles.contentText}
                        />

                        <Cell
                            style={outputLangCellStyle}
                            data={numberOfAdditions(props)}
                            textStyle={CoreStyles.contentText}
                            
                        />

                </TableWrapper>
    )
}

export default HomeRowTemplate


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

const wrapperStyle: ViewStyle = {
    flexDirection: "row"
}