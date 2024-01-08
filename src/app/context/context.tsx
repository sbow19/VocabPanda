/* eslint-disable */

import { Dimensions } from "react-native";


type WindowDimensions = {
    HEIGHT: number
    WIDTH: number
}

const {height, width} = Dimensions.get('window');

const windowDimensions: WindowDimensions = {

    HEIGHT: height, 
    WIDTH: width

}


export default windowDimensions;