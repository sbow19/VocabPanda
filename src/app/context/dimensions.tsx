/* eslint-disable */

import * as types from '@customTypes/types.d'

import { Dimensions } from "react-native";

const {height, width} = Dimensions.get('window');

const windowDimensions: types.WindowDimensions = {

    HEIGHT: height, 
    WIDTH: width

}

/*  Add windows dimensions premium vs free at start up */


export default windowDimensions;