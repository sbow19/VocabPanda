/* eslint-disable */

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
    }
};

export type CustomButtonStyles = {

    height?: number
    width?: number
    backgroundColor?: string
};

export type CustomCardStyles = {
    height?: number
    width?: number
    backgroundColor?: string
    borderRadius?: number
};

export type ProjectList = Array<ListItem|null>;

export type ListItem = string;

export type WindowDimensions = {
    HEIGHT: number
    WIDTH: number
}
