/* eslint-disable */

import SQLStatements from './prepared_statements';


import * as types from '@customTypes/types.d'
import LocalDatabase from './local_database';
import uuid from "react-native-uuid";


class UserContent extends LocalDatabase {

    //Managing Projects

    static addProject= (username: string, newProjectDetails: types.ProjectDetails)=>{

        return new Promise(async(resolve, reject)=>{

            try{

                //Get user id

                const userId = await super.getUserId(username);

                //Start transaction

                await this.transactionPromiseWrapper(SQLStatements.addStatements.addProject, [
                        userId,
                        newProjectDetails.projectName,
                        newProjectDetails.targetLanguage,
                        newProjectDetails.outputLanguage
                ],
                "Project added successfully");
            
                resolve(null);


            }catch(e){
                console.log("Error adding project.")
                console.trace();
                reject(e);
            }
            
        })
    };

    static deleteProject= (username: string, project: string)=>{

        return new Promise(async(resolve, reject)=>{

            try{

                //Get user id

                const userId = await super.getUserId(username);

                //Start transaction

                await this.transactionPromiseWrapper(SQLStatements.deleteStatements.deleteProject, [
                    userId,
                    project
                ],
                "Project successfully deleted.");

                resolve(null)

            }catch(e){
                console.log("Error deleting project.")
                console.trace();
                reject(e);
            }

            
        })
    };

    static getProjectEntries = (username: string, projectName: string): Promise<any[]> =>{

        return new Promise (async(resolve, reject)=>{

            try{

                //Get user id

                const userId = await super.getUserId(username);
    
                const resultArrayRaw =  await this.transactionPromiseWrapper(SQLStatements.getStatements.getAllProjectEntries,[
                    userId,
                    projectName
                ],
                "Project entries fetched!");

                const resultArray = super.parseRowResults(resultArrayRaw);

                resolve(resultArray);

                console.log(resultArray)

            }catch(e){

                console.log(e);
                console.trace();
                reject(e);
            }

        })
    };

    static addProjectBackend = (userId: string, projectObject: types.ProjectDetails): Promise<string> =>{

        return new Promise (async(resolve, reject)=>{

            let addProjectResponse: types.LocalOperationResponse<string> = {
                success: false,
                operationType: "create",
                contentType: "project",
                message: "operation unsuccessful" 
            }

            try{

                //Start transaction
                const result = await this.transactionPromiseWrapper(SQLStatements.updateStatements.syncUserEntry, 
                    [
                        userId,
                        
                    ]
                    , 
                    "Updated user entry"
                );

                if(result.rowsAffected === 0){

                    updateEntryResponse.customResponse = "row could not be updated";
                    reject(updateEntryResponse);

                }else if (result.rowsAffected === 1){

                    updateEntryResponse.message = "operation successful";
                    updateEntryResponse.success = true;
                    resolve(updateEntryResponse);
                }
                

            }catch(e){

                updateEntryResponse.error = e;
                updateEntryResponse.customResponse = "row could not be updated";

                console.log(e);
                console.trace();
                reject(updateEntryResponse);
            }

        })
    };

    static deleteProjectBackend = (userId: string, projectObject: types.ProjectDetails): Promise<string> =>{

        return new Promise (async(resolve, reject)=>{

            try{
                //Get user id

                const userId = await super.getUserId(username);

                //Get entry id

                const entryId = uuid.v4();

                //Start transaction


                await this.transactionPromiseWrapper(SQLStatements.addStatements.addUserEntry, 
                    [
                        userId,
                        username,
                        entryId,
                        entryObject.targetLanguageText, 
                        entryObject.targetLanguage, 
                        entryObject.outputLanguageText, 
                        entryObject.outputLanguage, 
                        0,
                        entryObject.project
                    ]
                    , 
                    "Added user entry"
                )
                resolve(entryId);

            }catch(e){

                console.log(e);
                console.trace();
                reject(e);
            }

        })
    };

    static updateProjectBackend = (userId: string, projectObject: types.ProjectDetails): Promise<string> =>{

        return new Promise (async(resolve, reject)=>{

            try{
                //Get user id

                const userId = await super.getUserId(username);

                //Get entry id

                const entryId = uuid.v4();

                //Start transaction


                await this.transactionPromiseWrapper(SQLStatements.addStatements.addUserEntry, 
                    [
                        userId,
                        username,
                        entryId,
                        entryObject.targetLanguageText, 
                        entryObject.targetLanguage, 
                        entryObject.outputLanguageText, 
                        entryObject.outputLanguage, 
                        0,
                        entryObject.project
                    ]
                    , 
                    "Added user entry"
                )
                resolve(entryId);

            }catch(e){

                console.log(e);
                console.trace();
                reject(e);
            }

        })
    };

    //Entries

    static addNewEntry = (username: string, entryObject: types.EntryDetails): Promise<string> =>{

        return new Promise (async(resolve, reject)=>{

            try{
                //Get user id

                const userId = await super.getUserId(username);

                //Get entry id

                const entryId = uuid.v4();

                //Start transaction


                await this.transactionPromiseWrapper(SQLStatements.addStatements.addUserEntry, 
                    [
                        userId,
                        username,
                        entryId,
                        entryObject.targetLanguageText, 
                        entryObject.targetLanguage, 
                        entryObject.outputLanguageText, 
                        entryObject.outputLanguage, 
                        0,
                        entryObject.project
                    ]
                    , 
                    "Added user entry"
                )
                resolve(entryId);

            }catch(e){

                console.log(e);
                console.trace();
                reject(e);
            }

        })
    };

    static deleteEntry = (username: string, entryId: string)=>{

        return new Promise(async(resolve, reject)=>{

            try{

                console.log(entryId)

                //Get user id
                const userId = await super.getUserId(username);

                await this.transactionPromiseWrapper(SQLStatements.deleteStatements.deleteEntry, [
                    entryId,
                    userId
                ],
                "Entry deleted");

                resolve(null);
        

            }catch(e){

                console.log(e);
                console.trace();
                reject(e);

            }

            
        })
    };

    static deleteEntryBackend = (userId: string, entryObject: types.EntryDetails): Promise<types.LocalOperationResponse> =>{
        return new Promise (async(resolve, reject)=>{

            let deleteEntryResponse: types.LocalOperationResponse = {
                success: false,
                operationType: "remove",
                contentType: "entry",
                message: "operation unsuccessful" 
            }

            try{

                //Start transaction
                const result = await this.transactionPromiseWrapper(SQLStatements.deleteStatements.deleteEntry, 
                    [
                        entryObject.entryId,
                        userId
                    ]
                    , 
                    "Deleted user entry"
                );

                if(result.rowsAffected === 0){

                    deleteEntryResponse.customResponse = "row could not be deleted";
                    reject(deleteEntryResponse);

                }else if (result.rowsAffected === 1){

                    deleteEntryResponse.message = "operation successful";
                    deleteEntryResponse.success = true;
                    resolve(deleteEntryResponse);
                }
                

            }catch(e){

                deleteEntryResponse.error = e;
                deleteEntryResponse.customResponse = "row could not be deleted";

                console.log(e);
                console.trace();
                reject(deleteEntryResponse);
            }

        })
    };

    static updateEntry = (
        username: string, 
        entryId: string,
        targetLanguageText: string,
        targetLanguage: string,
        outputLanguageText: string,
        outputLanguage: string
    )=>{

        return new Promise(async(resolve, reject)=>{

            try{

                //Get user id
                const userId = await super.getUserId(username);

                //Start transaction
    

                await this.transactionPromiseWrapper(SQLStatements.updateStatements.updateUserEntry, [
                        targetLanguageText,
                        outputLanguageText,
                        targetLanguage,
                        outputLanguage,
                        entryId,
                        userId
                ],
                "Update entry successful");

                resolve(null)
                

            }catch(e){

                console.log(e);
                console.trace();
                reject(e);

            }

            
        })
    };

    static updateEntryBackend = (userId: string, entryObject: types.EntryDetails): Promise<types.LocalOperationResponse<string>> =>{
        return new Promise (async(resolve, reject)=>{

            let updateEntryResponse: types.LocalOperationResponse<string> = {
                success: false,
                operationType: "update",
                contentType: "entry",
                message: "operation unsuccessful" 
            }

            try{

                //Start transaction
                const result = await this.transactionPromiseWrapper(SQLStatements.updateStatements.syncUserEntry, 
                    [
                        entryObject.targetLanguageText,
                        entryObject.outputLanguageText,
                        entryObject.targetLanguage,
                        entryObject.outputLanguage,
                        entryObject.updatedAt,
                        entryObject.tags,
                        entryObject.entryId,
                        userId
                    ]
                    , 
                    "Updated user entry"
                );

                if(result.rowsAffected === 0){

                    updateEntryResponse.customResponse = "row could not be updated";
                    reject(updateEntryResponse);

                }else if (result.rowsAffected === 1){

                    updateEntryResponse.message = "operation successful";
                    updateEntryResponse.success = true;
                    resolve(updateEntryResponse);
                }
                

            }catch(e){

                updateEntryResponse.error = e;
                updateEntryResponse.customResponse = "row could not be updated";

                console.log(e);
                console.trace();
                reject(updateEntryResponse);
            }

        })
    };


    static addNewEntryBackend = (userId: string, entryObject: types.EntryDetails): Promise<types.LocalOperationResponse > =>{
        return new Promise (async(resolve, reject)=>{

            let addNewEntry: types.LocalOperationResponse = {
                success: false,
                operationType: "create",
                contentType: "entry",
                message: "operation unsuccessful" 
            }

            try{

                //Start transaction
                const result = await this.transactionPromiseWrapper(SQLStatements.addStatements.syncUserEntry, 
                    [
                        userId,
                        entryObject.username,
                        entryObject.entryId,
                        entryObject.targetLanguageText, 
                        entryObject.targetLanguage, 
                        entryObject.outputLanguageText, 
                        entryObject.outputLanguage, 
                        entryObject.tags,
                        entryObject.createdAt,
                        entryObject.project
                    ]
                    , 
                    "Synced user entry"
                );

                if(result.rowsAffected === 0){

                    addNewEntry.customResponse = "row could not be added";
                    reject(addNewEntry);

                }else if (result.rowsAffected === 1){

                    addNewEntry.message = "operation successful";
                    addNewEntry.success = true;
                    resolve(addNewEntry);
                }
                

            }catch(e){

                addNewEntry.error = e;
                addNewEntry.customResponse = "row could not be added";

                console.log(e);
                console.trace();
                reject(addNewEntry);
            }

        })
    };

    static searchTerm = (username: string, searchString: string)=>{

        return new Promise(async(resolve, reject)=>{

            try{

                //get user_id
                const userId = await super.getUserId(username);


                const resultArrayRaw = await this.transactionPromiseWrapper(SQLStatements.getStatements.getEntries, [
                    userId,
                    searchString,
                    searchString,
                    searchString,
                    searchString,
                    searchString,
                    searchString
                ],
                "Search terms fetched");
    
                const resultArray = super.parseRowResults(resultArrayRaw);
    
                resolve(resultArray);

            }catch(e){

                console.log(e);
                console.trace();
                reject(e);

            }

        })

    };

    static getAllEntries = (username: string)=>{

        return new Promise(async(resolve, reject)=>{

            try{

                //get user_id
                const userId = await super.getUserId(username);

                const resultArrayRaw = await this.transactionPromiseWrapper(SQLStatements.getStatements.getAllEntries, [
                    userId,
                ],
                "All entries fetched");
    
                const resultArray = super.parseRowResults(resultArrayRaw);
    
                resolve(resultArray);
        
            }catch(e){

                console.log(e);
                console.trace();
                reject(e);

            }

        })

    };

    static getEntryById = (username: string, entryId: string)=>{

        return new Promise(async(resolve, reject)=>{

            try{

                //get user_id
                const userId = await super.getUserId(username);

                const resultArrayRaw = await this.transactionPromiseWrapper(SQLStatements.getStatements.getEntryById, [
                    userId,
                    entryId
                ],
                "Single entry fetched");
    
                const resultArray = super.parseRowResults(resultArrayRaw);
    
                resolve(resultArray);
        
            }catch(e){

                console.log(e);
                console.trace();
                reject(e);

            }

        })

    };

    static convertEntryArrayToObject = (entryObject): types.EntryDetails=>{

        const entryDetails: types.EntryDetails = {
            userId: entryObject["user_id"],
            username: entryObject["username"],
            entryId: entryObject["entry_id"],
            targetLanguageText: entryObject["target_language_text"],
            targetLanguage: entryObject["target_language"],
            outputLanguageText: entryObject["output_language_text"],
            outputLanguage: entryObject["output_language"],
            tags: entryObject["tags"],
            createdAt: entryObject["created_at"],
            updatedAt: entryObject["updated_at"],
            project: entryObject["project"],
            tagsArray: []
        };

        return entryDetails;

    };


    //Syncing content
    static syncUserContent =  (userId:string, userContent:Array<any>): Promise<types.LocalOperationResponse<{
        failedContent: Array<any>
        failedContentIndex: number
    }>>=>{

        return new Promise(async(resolve, reject)=>{

            let syncUserContentResponse: types.LocalOperationResponse<{
                failedContent: Array<any>
                failedContentIndex: number
            }> = {
                success: false,
                operationType: "update",
                contentType: "entry",
                message: "operation unsuccessful" 
            };

            const userContentArrayLength = userContent.length;

            const failedObject = {
                failedContent: [],
                failedContentIndex: 0
            };

            //Loop through array and conduct update operation on each entry.

            for(let i = 0; i < userContentArrayLength; i++){

                const userEntry: types.UserContentExtensionBuffer = userContent[i];

                try{
                    //Assign type to object
                    switch(userEntry.contentType){
                        case "entry":
                            //Choose user entry operations from this class
                            if(userEntry.operationType === "add"){

                                await this.addNewEntryBackend(userId, userEntry.userContent);

                            }else if(userEntry.operationType === "delete"){

                                await this.deleteEntryBackend(userId, userEntry.userContent);

                            }else if(userEntry.operationType === "update"){

                                await this.updateEntryBackend(userId, userEntry.userContent);

                            }

                            break
                        case "project":
                            //Choose user project operations from this class
                            if(userEntry.operationType === "add"){

                                await this.addProjectBackend(userId, userEntry.userContent);

                            }else if(userEntry.operationType === "delete"){

                                await this.deleteProjectBackend(userId, userEntry.userContent);

                            }else if(userEntry.operationType === "update"){

                                await this.updateProjectBackend(userId, userEntry.userContent);
                                
                            }

                            break
                        case "tags":
                            //Choose user tags operations from this class
                            if(userEntry.operationType === "add"){

                            }else if(userEntry.operationType === "delete"){

                            }else if(userEntry.operationType === "update"){
                                
                            }

                            break
                    }

                }catch(e){
                
                    //Assign failed content index

                    failedObject.failedContentIndex = i;

                    //Assign failed contentType

                    failedObject.failedContent = userContent.slice(i-1); //Get array from an  including the failed index

                    //Reject syncing promise

                    syncUserContentResponse.customResponse = failedObject;

                    resolve(syncUserContentResponse);

                    //Break from for loop

                    return

                }

                
            }
            


        })

                
    };


}

export default UserContent;