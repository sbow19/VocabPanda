/* eslint-disable */

import { Dispatch, SetStateAction } from "react";
import { TextStyle } from "react-native";

import { ViewStyle } from "react-native";

export type CoreColours = {
    black: "#3E3B3F"
    white: "#F5F5F5"
    lightGreen: "#46EC8B"
    darkGreen: "#15CB61"
    blue: "#99F5FF"
};

export type destination = {
    screen: string
    screenParams?: {
        screen?: string
        params?: Object
        project?: string
    }
};

export type CustomContentCardProp = {
    cardStylings: CustomCardStyles 
    children?: React.ReactNode
}

export type CustomButtonStylesProp = {

    customStyles?: CustomButtonStyles
    children: React.ReactNode
    onPress?: ()=>void

}

export type CustomButtonStyles = {

    height?: number
    width?: number
    backgroundColor?: string
    
};

export type CustomDropDownProps = {
    data: ProjectList
    customStyles?: {
        buttonContainerStyle?: ViewStyle,
        dropdownContainerStyle?: ViewStyle,
        rowTextStyle?:TextStyle,
        buttonTextStyle?: TextStyle
    }
    setSelection?: Dispatch<SetStateAction<string>> | null
    defaultButtonText: string
}

export type CustomCardStyles = {
    height?: number
    width?: number
    backgroundColor?: string
    borderRadius?: number
    alignItems?: "center"| "flex-start" | "flex-end"
};

export type CustomInputProp = {

    inputStyle?: ViewStyle
    numberOfLines?: number
    editable?:  boolean

}

export type ProjectList = Array<ListItem|null>;

export type ListItem = string;

export type WindowDimensions = {
    HEIGHT: number
    WIDTH: number
}
