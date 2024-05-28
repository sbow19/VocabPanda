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
    operationType?: "create" | "update" | "remove" | "get" | "sync"
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


//BUFFER OPERATIONS 

export type LocalBufferOperation<T = null> = {
    location: "main queue" | "secondary queue" | "sync queue" | "acknowledgement queue" | "response queue" |"all"
    operationType: "store" | "remove" | "get" | "flush" | "transfer"
    success: boolean
    customResponse?: T  
}

export type BufferStorageObject = {
    queue_1: Object
    queue_2: Object
    sync_buffer: Object
    response_buffer: Object
    acknowledgements: Object

}


//API Calls

/* All API requests */
// export type APIRequest =  APIEntryObject | APIProjectObject | APITranslateCall | APIAccountObject<AccountOperationDetails> | APISettingsObject


/* 
    STRUCTURE
    - All changes made locally will be stored in a buffer, where upon a certain trigger event the buffers will attempted to be flushed.
    - Individual changes, additions, or deletions of content will trigger a buffer flush. Therefore individual API endpoint for these changes not needed.
    - All API calls will contain a request id, timestamp and user id to keep track of requests on both ends.
    - Changes will be stored in a sync buffer locally in an "API object", which contains the change details and type of data changed
    - API requests are wrapped with detail setting out the type of sync 
*/
export type APICallBase = {
    deviceType: "app" | "extension"
    operationType: "update settings" 
    | "translate" 
    | "acknowledgement" 
    | "sync request" 
    | "sync result"
    | "change password" 
    | "delete account" 
    | "upgrade" 
    | "downgrade" 
    | "create account" 
    | "login"
    | "verify email"
    requestId: string
    requestTimeStamp: string
    userId: string
    error?: Error

}

export type BaseUserDetails = {
    userId: string
    dataType?: DataTypes
}

export type DataTypes = "content" | "settings" | "plays" | "login"


/* Changes wrapper */

export type UserData = ProjectDetails | EntryDetails | UserSettings | PlaysDetails | null


export interface ProjectDetails extends BaseUserDetails {

    projectName: string
    targetLanguage: string
    outputLanguage: string

}

export interface EntryDetails extends BaseUserDetails {
    targetLanguageText: string
    targetLanguage: string
    outputLanguageText: string
    outputLanguage: string
    project: string
    createdAt: string
    updatedAt:  string
    tags: number
    tagsArray: string[]
    username: string
    entryId: string
}

/* Settings */


export interface UserSettings extends BaseUserDetails {
    gameTimerOn: boolean
    gameNoOfTurns: number
    defaultTargetLanguage: string
    defaultOutputLanguage: string
    defaultProject: string
}


/* Plays */


export interface PlaysDetails extends BaseUserDetails {

    playsLeft: number
    playsRefreshTime: string
   
}

/* 
    Account operations and API wrapper
*/

export interface APIAccountObject<T extends AccountOperationDetails> extends APICallBase {
    accountOperationDetails: T

}

export type AccountOperationDetails = APICreateAccount | APIDeleteAccount | APIDowngradeUser | APIUpgradeUser | APIUpdatePassword  | APILoginResult
       
export interface APIDeleteAccount extends BaseUserDetails {

    password: string

}

export interface APIUpdatePassword extends BaseUserDetails {

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


/* login and content sync and API wrapper */

export interface LoginResult extends BaseUserDetails {

    loginSuccess: boolean
    username: string | ""
    identifierType: "email" | "username" | ""
    password: string| ""
    buffers: LocalSyncContents
}


export interface LocalSyncContents extends BaseUserDetails {

    syncRequests?: any
    bufferQueue?: any
    acknowledgements?: any
    responseQueue?: any

}

export interface TotalSyncContents extends BaseUserDetails {
    errorMessage: Object
    offendingRequestId: string
}


export type APIContentCallDetails =  LocalSyncContents | TotalSyncContents | LoginResult


/* Details to frontend of changes to send to the backend */
export interface LocalSyncRequest<T extends APIContentCallDetails> extends APICallBase {
    requestDetails: T //Includes content, settings, buffers, sync results etc
    syncType: "total sync" | "local changes" | "login"
    
}


/* Generate API key call */
export type APIGenerateKeyRequest = {
    deviceType: "app" | "extension"
    deviceId: string
}

/* Translation call */
export interface APITranslateCall extends APICallBase {

    targetText: string, 
    targetLanguage: string,
    outputLanguage: string

}

/* FE RESPONSE TO SYNC CHANGES  
    Result of front end syncing up with backend changes 
    Properties set to true mean that operation completed 
    properties set to null mean that that operation did not take place
*/
export interface LocalBackendSyncResult extends APICallBase {
    deleteAccount: boolean | null
    userSettingsSync: boolean | null
    premiumStatusSync: boolean | null
    userContentSync: {
        valid: boolean
        failedContent?: Array<any>
        failedContentIndex?: number
        failedMessage?: TotalSyncContents
    } | null
    
}





//BACKEND Responses

/* ALL backend responses will follow this structure */
export interface BackendOperationResponse<T = null> extends APICallBase {
    success: Boolean
    message: "no internet" | "operation successful" | "misc error" | "operation unsuccessful" 
    error?: Error
    customResponse?: T
}

export interface APITranslateResponse extends BackendOperationResponse {

    success: boolean
    translations: any[]
    translationsLeft: number
    translationRefreshTime: number

}

export interface APIKeyOperationResponse<T = null> extends BackendOperationResponse<T> {

    apiOperationType: "generate api key"
    APIKey: string

}


/* Result of backend syncing up with local changes */
export interface BackendLocalSyncResult<T=null> extends BackendOperationResponse<T> {

    syncType: "total sync" | "local changes" | "login"

    //If user account details needs to be synced
    userAccountDetails: APIAccountChanges

    //Only if buffer content needs to be synced
    partialSyncRequired: boolean
    syncContent: Array<UserContentExtensionBuffer | null> //Chronological list of user entry and project operations

    //If full sync required
    databaseContents?: BackendContent
    fullSyncRequired: boolean
}

export type BackendContent = {
    projects: Array<ProjectDetails | null>
    entries: Array<EntryDetails | null>
    tags: Array<null>
}


export type APIAccountChanges = {
    //When user logs in, front end is updated with any changes that have occurred with the account elsewhere
    userSettings: UserSettings
    userPremiumStatus: boolean
    userDeleted:  boolean
}

/* Entries from backend extension buffer */
export type UserContentExtensionBuffer = {
    operationType: "add" | "update" | "get" | "delete"
    contentType: "tags" | "entry" | "project"
    userContent: EntryDetails | ProjectDetails
}



/* Acknowledgements */

export interface FEAcknowledgement extends APICallBase {
}

export interface BEAcknowledgement extends APICallBase {
}












 


