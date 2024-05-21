/* eslint-disable */

import React, { Dispatch, SetStateAction } from "react";
import { TextStyle, TextInputProps } from "react-native";

import { ViewStyle } from "react-native";
import { SQLiteDatabase } from "react-native-sqlite-storage";
import { BooleanSchema } from "yup";

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

export type UserDetails = {
    email?: string
    password: string
    userId: string
    username: string
    
}



export type AppSettingsObject = {

    userSettings?: {
        timerOn: boolean
        noOfTurns: number
        targetLanguage?: string
        outputLanguage?: string
    }

    projects?: Array<ProjectDetails | null>

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

export type LocalOperationResponse = {
    success: Boolean
    message: "no internet" | "operation successful" | "misc error" | "operation unsuccessful"
    error?: Error | string
    operationType?: "create" | "update" | "remove" | ""
    contentType?: "project" | "tags" | "entry" | "account" | "settings"
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





export type FullTextObject = {
    targetLanguageText: string,
    targetLanguage: string,
    outputLanguageText: string,
    outputLanguage: string
};


//API types

export type APIProjectObject = {
    updateType: "create" | "remove" | "update" 
    projectDetails: ProjectDetails
}

export type APIEntryObject = {
    updateType: "create" | "remove" | "update" 
    entryDetails: EntryDetails
}

export type APISettingsObject = {
    updateType: "create" | "remove" | "update" 
    userSettings: UserSettings
}

export type APITagsObject = {
    updateType: "create" | "remove" | "update" 
    tagDetails: string
}

export type APIAccountObject<AccountOperationDetails> = {
    updateType: "change password" | "delete account" | "upgrade" | "downgrade" | "create account" | "login"
    accountOperationDetails: AccountOperationDetails

}

export type AccountOperationDetails = APICreateAccount | APIDeleteAccount | APIDowngradeUser | APIUpgradeUser | APIUpdatePassword  | APILoginUser



export type APIDeleteAccount = {

    userId: string
    password: string

}

export type APIUpdatePassword = {

    userId: string
    oldPassword: string
    newPassword: string

}

export type APICreateAccount = {

    username: string
    password: string
    email: string

}

// export type APIUpgradeUser = {

// }

// export type APIDowngradeUser = {

// }

export type APITranslateCall = {

    targetText: string, 
    targetLanguage: string,
    outputLanguage: string,
    username: string
}

export type APITranslateResponse = {

    success: boolean
    translations: any[]
    translationsLeft: number
    translationRefreshTime: number
    message: "no internet" | "operation successful" | "misc error" | "operation unsuccessful"

}


export type APIOperationResponse = {
    success: Boolean
    message: "no internet" | "operation successful" | "misc error" | "operation unsuccessful" | "buffer flushing"
    error?: Error
    operationType?: "create" | "update" | "remove" | ""
    contentType?: "project" | "tags" | "entry" | "account" | "settings"
}

export interface APIAccountOperationResponse extends APIOperationResponse {
    accountOperation: "change password" | "delete account" | "upgrade" | "downgrade" | "create account" | "verify email"
    userId?: string
    customResponse: string
}

export type EntryDetails = {
    targetLanguageText: string
    targetLanguage: string
    outputLanguageText: string
    outputLanguage: string
    project: string
    createdAt: string
    updatedAt:  string
    tags: number
    tagsArray: string[]
    userId: string
    username: string
    entryId: string
}

export type ProjectDetails = {

    projectName: string
    targetLanguage: string
    outputLanguage: string
    userId?: string

}

export type UserSettings = {
    gameTimerOn: boolean
    gameNoOfTurns: number
    defaultTargetLanguage: string
    defaultOutputLanguage: string
    defaultProject: string
    userId: string
}

//BUFFER TYPES 

export type BufferKey = "entry" | "project" | "tags" | "account" | "settings" | "translate" 

export type BufferStorageResponse = {
    storageSuccessful: Boolean
    storageURL: string
}

export type BufferFlushResponse = {
    flushSuccessful: Boolean
}

export type BufferStorageObject = {

    entry: any[],
    settings: any[],
    project: any[],
    account: any[],
    tags: any[],
    translate: any[]

}

//Generic API Request
export type APIRequest =  APIEntryObject | APIProjectObject | APITranslateCall | APIAccountObject<AccountOperationDetails> | APISettingsObject

