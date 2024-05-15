/* eslint-disable */

import React, { Dispatch, SetStateAction } from "react";
import { TextStyle, TextInputProps } from "react-native";

import { ViewStyle } from "react-native";
import { SQLiteDatabase } from "react-native-sqlite-storage";

export type CoreColours = {
    black: "#3E3B3F"
    white: "#F5F5F5"
    lightGreen: "#46EC8B"
    darkGreen: "#15CB61"
    blue: "#99F5FF",
    red: string,
    paleGreen: string
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
    children?: React.ReactNode | React.FC
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

export type CustomDropDown = {
    buttonContainerStyle?: ViewStyle,
    dropdownContainerStyle?: ViewStyle,
    rowTextStyle?:TextStyle,
    buttonTextStyle?: TextStyle
}

export type CustomCardStyles = {
    height?: number | string
    width?: number | string
    backgroundColor?: string
    borderRadius?: number
    alignItems?: "center"| "flex-start" | "flex-end"
};


export type HomescreenTemplate = {

    screenTitle: string
    children: React.ReactNode

}


export type CustomAdBannerProps = {
    customStyles?: ViewStyle
}

export type WindowDimensions = {
    HEIGHT: number
    WIDTH: number
}

export type users = {

    user: userDetails
}

export type userDetails = {
    email: string
    
}

export type ProjectObject = {

    projectName: string
    targetLanguage: string
    outputLanguage: string

}

export type AppSettingsObject = {

    userSettings?: {
        timerOn: boolean
        noOfTurns: number
        targetLanguage?: string
        outputLanguage?: string
    }

    projects?: Array<ProjectObject | null>

    lastLoggedIn: string

    premium: {
        premium: boolean
        endTime: string
    }

    playsLeft: number

    playsRefreshTime: number

    translationsLeft: number

    translationsRefreshTime: number
}

export type ProjectConfig<ProjectObject> ={

    project: ProjectObject
    mode: "add"|"delete"
}

export type StateHandlerList<state, setter> = [

    state,
    setter

]

export type languageObject = {
    Bulgarian: "BG",
    Czech: "CS",
    Danish: "DA",
    Greek: "EL",
    Estonian: "ET",
    Finnish: "FI",
    French: "FR",
    Hungarian: "HU",
    Indonesian: "ID",
    Italian: "IT",
    Japanese: "JA",
    Korean: "KO",
    Lithuanian: "LT",
    Latvian: "LV",
    Norwegian: "NB",
    Dutch: "NL",
    Polish: "PL",
    Portuguese: "PT",
    Romanian: "RO",
    Russian: "RU",
    Slovak: "SK",
    Slovenian: "SL", 
    Swedish: "SV",
    Turkish: "TR",
    Ukrainian: "UK",
    Chinese: "ZH",
    Spanish: "ES",
    English: "EN",
    German: "DE"
}

export type LastActivityObject = {
    lastActivity: boolean,
    lastActivityData: {
        projects: Array<string| null>,
        noOfAdditions: Array<number| null>
    },
    lastActivityResultArrays: Array<ResultArrayObject>
}

export type ResultArrayObject = {
    project: string
    resultArray: Array<any>
}

export type GameSettingsObject = {
    timerOn: boolean
    noOfTurns: number
    gameMode: "All Words" | "Latest Activity" | "Search Results" | "By Project"
    resultArray: Array<any>
    project: string
}

export type CreateAccountCall = {

    username: string
    password: string
    email: string
    
}

export type LoginResultObject = {

    loginSuccess: boolean
    username: string | ""
    identifierType: "email" | "username" | ""
    password: string| ""
}

export type DeleteAccountResponseObject = {

    username: string
    deletionSuccessful: boolean
    message: string
}

export type CreateAccountResponse = {

    responseMessage: "Add successful" | "Add unsuccessful"
    addMessage: "User added successfully!" | Error 
    userId: string
    
}

export type ChangePasswordResponse = {

    changeSuccessful: boolean
    changeMessage: string

}

export type DatabaseObject = {

    database: SQLiteDatabase,
    username: string
}

export type ProjectLengthResponseObject = {

    upgradeNeeded: boolean
    reason: "50 Limit" | "20 Limit" | ""
}

export type EntryObject = {

    input: string
    inputLang: string
    output: string
    outputLang: string
    project: string
}

export type TranslateCallObject = {

    targetText: string, 
    targetLanguage: string,
    outputLanguage: string,
    username: string
}

export type TranslateResponseObject = {

    success: boolean
    translations: any[]

}

export type FullTextObject = {
    target_language: string,
    target_language_lang: string,
    output_language: string,
    output_language_lang: string
}

