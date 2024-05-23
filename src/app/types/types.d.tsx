/* eslint-disable */

import React, { Dispatch, SetStateAction } from "react";
import { TextStyle, TextInputProps } from "react-native";

import { ViewStyle } from "react-native";
import { SQLiteDatabase } from "react-native-sqlite-storage";
import { BooleanSchema } from "yup";

//Style types

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


//Local types

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

export type LocalOperationResponse<T=null> = {
    success: Boolean
    message: "no internet" | "operation successful" | "misc error" | "operation unsuccessful"
    error?: Error | string
    operationType?: "create" | "update" | "remove" | "get"
    contentType?: "project" | "tags" | "entry" | "account" | "settings"
    customResponse?: T
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


//API Calls

/* All API requests */
export type APIRequest =  APIEntryObject | APIProjectObject | APITranslateCall | APIAccountObject<AccountOperationDetails> | APISettingsObject

export type APICallBase = {
    deviceType: "app" | "extension"
    operationType: "project" | "tags" | "entry" | "account" | "settings" | "login" | "translate"

}

/* Projects */
export type APIProjectObject = {
    updateType: "create" | "remove" | "update" 
    projectDetails: ProjectDetails
}

export interface ProjectDetails extends APICallBase {

    projectName: string
    targetLanguage: string
    outputLanguage: string
    userId?: string

}

/* Entries */
export type APIEntryObject = {
    updateType: "create" | "remove" | "update" 
    entryDetails: EntryDetails
}

export interface EntryDetails extends APICallBase {
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

/* Settings */

export interface APISettingsObject extends APICallBase {
    updateType: "create" | "remove" | "update" 
    userSettings: UserSettings
}

export interface UserSettings extends APICallBase {
    gameTimerOn: boolean
    gameNoOfTurns: number
    defaultTargetLanguage: string
    defaultOutputLanguage: string
    defaultProject: string
    userId: string
}

/* Tags */

export type APITagsObject = {
    updateType: "create" | "remove" | "update" 
    tagDetails: string
}


/* Plays */

export interface APIPlaysObject extends APICallBase {
    updateType: "create" | "remove" | "update" 
    playsDetails: PlaysDetails
}

export interface PlaysDetails extends APICallBase {

    playsLeft: number
    playsRefreshTime: string
    userId: string
   
}

/* Account */

export type APIAccountObject<AccountOperationDetails> = {
    updateType: "change password" | "delete account" | "upgrade" | "downgrade" | "create account" | "login"
    accountOperationDetails: AccountOperationDetails

}

export type AccountOperationDetails = APICreateAccount | APIDeleteAccount | APIDowngradeUser | APIUpgradeUser | APIUpdatePassword  | APILoginResult
       
export interface APIDeleteAccount extends APICallBase {

    userId: string
    password: string

}

export interface APIUpdatePassword extends APICallBase {

    userId: string
    oldPassword: string
    newPassword: string

}

export interface APICreateAccount extends APICallBase {

    username: string
    password: string
    email: string

}

export interface APILoginResult extends APICallBase {

    loginSuccess: boolean
    username: string | ""
    identifierType: "email" | "username" | ""
    password: string| ""
    userId: string
}

// export type APIUpgradeUser = {

// }

// export type APIDowngradeUser = {

// }

export type APIGenerateKeyRequest = {
    deviceType: "app" | "extension"
    deviceId: string
}

/* Translation call */

export interface APITranslateCall extends APICallBase {

    targetText: string, 
    targetLanguage: string,
    outputLanguage: string,
    username: string
}




//API Responses

export type APITranslateResponse = {

    success: boolean
    translations: any[]
    translationsLeft: number
    translationRefreshTime: number
    message: "no internet" | "operation successful" | "misc error" | "operation unsuccessful"

}

export type APIOperationResponse<T> = {
    success: Boolean
    message: "no internet" | "operation successful" | "misc error" | "operation unsuccessful" | "buffer flushing"
    error?: Error
    operationType?: "create" | "update" | "remove" | ""
    contentType?: "project" | "tags" | "entry" | "account" | "settings"
    customResponse?: T
}

export interface APIAccountOperationResponse<T = null> extends APIOperationResponse<T> {
    accountOperation: "change password" | "delete account" | "upgrade" | "downgrade" | "create account" | "verify email" | "login"
    userId?: string
    
}

export type APIPostLoginSetUp = {
    //When user logs in, front end is updated with any changes that have occurred with the account elsewhere
    userId: string
    userSettings: UserSettings
    userPremiumStatus: boolean
    userDeleted:  boolean
    userContent: [] //Chronological list of user entry and project operations
}

export interface APIKeyOperationResponse<T = null> extends APIOperationResponse<T> {

    apiOperationType: "generate api key"
    APIKey: string

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

export interface BufferSyncResult extends APIAccountOperationResponse {
    deleteAccount: boolean
    operationStatus: {
        userSettingsSync: boolean
        premiumStatusSync: boolean
        userContentSync: {
            valid: boolean
            failedContent?: Array<any>
            failedContentIndex?: number
        }
    }
}


//Sync related types

/* Entries from backend extension buffer */
export type UserContentExtensionBuffer = {
    operationType: "add" | "update" | "get" | "delete"
    contentType: "tags" | "entry" | "project"
    userContent: EntryDetails | ProjectDetails
}

 


