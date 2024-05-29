/* eslint-disable */

import SQLStatements from './prepared_statements';


import * as types from '@customTypes/types.d'
import LocalDatabase from './local_database';
import uuid from "react-native-uuid";


class UserContent extends LocalDatabase {

    //Managing Projects

    static addProject= (userId: string, newProjectDetails: types.ProjectDetails): Promise<types.LocalOperationResponse>=>{

        return new Promise(async(resolve, reject)=>{

            const projectAddResponse: types.LocalOperationResponse ={
                success: false,
                operationType: "create",
                contentType: "project",
                message: "operation unsuccessful"
            }

            try{

                //Start transaction

                const result = await this.transactionPromiseWrapper(SQLStatements.addStatements.addProject, [
                        userId,
                        newProjectDetails.projectName,
                        newProjectDetails.targetLanguage,
                        newProjectDetails.outputLanguage
                ],
                "Project added successfully");
            
                if(result.rowsAffected === 0){
                    //Project deletion failed
                    reject(projectAddResponse);
                }else if (result.rowsAffected){

                    projectAddResponse.success = true;
                    projectAddResponse.message = "operation successful";
                    resolve(projectAddResponse);
                }


            }catch(e){
                console.log("Error adding project.")
                console.trace();
                reject(e);
            }
            
        })
    };

    static deleteProject = (userId: string, project: string):Promise<types.LocalOperationResponse>=>{

        return new Promise(async(resolve, reject)=>{

            const projectDeletionResponse: types.LocalOperationResponse ={
                success: false,
                operationType: "remove",
                contentType: "project",
                message: "operation unsuccessful"
            }

            try{

                //Start transaction

                const result = await this.transactionPromiseWrapper(SQLStatements.deleteStatements.deleteProject, [
                    userId,
                    project
                ],
                "Project successfully deleted.");

                if(result.rowsAffected === 0){
                    //Project deletion failed
                    reject(projectDeletionResponse);
                }else if (result.rowsAffected){

                    projectDeletionResponse.success = true;
                    projectDeletionResponse.message = "operation successful";
                    resolve(projectDeletionResponse);
                }

            }catch(e){
                console.log("Error deleting project.")
                console.trace();
                reject(e);
            }

            
        })
    };

    static getProjectEntries = (userId: string, projectName: string): Promise<Array<types.EntryDetails>> =>{

        return new Promise (async(resolve, reject)=>{

            try{
    
                const resultArrayRaw = await this.transactionPromiseWrapper(SQLStatements.getStatements.getAllProjectEntries,[
                    userId,
                    projectName
                ],
                "Project entries fetched!");

                
                const resultArray: Array<types.SQLDBResult<types.SQLUserEntries>> = super.parseRowResults(resultArrayRaw);

                if(resultArray.length === 0){
                    //No project entries
                    resolve([]);

                }else if (resultArray.length > 0){
                    //1 or more project entries

                    const convertedResultArray = resultArray.map((storedEntry: types.SQLUserEntries)=>{

                        const convertedEntry = this.convertSQLEntry(storedEntry);
                        return convertedEntry

                    })
                    resolve(convertedResultArray);

                }
        
            }catch(e){

                console.log(e);
                console.trace();
                reject(e);
            }

        })
    };

    static addProjectBackend = (userId: string, projectObject: types.ProjectDetails): Promise<types.LocalOperationResponse<string>> =>{

        return new Promise (async(resolve, reject)=>{

            let addProjectResponse: types.LocalOperationResponse<string> = {
                success: false,
                operationType: "create",
                contentType: "project",
                message: "operation unsuccessful" 
            }

            try{

                //Start transaction
                const result = await this.transactionPromiseWrapper(SQLStatements.addStatements.addProject, 
                    [
                        userId,
                        projectObject.projectName,
                        projectObject.targetLanguage,
                        projectObject.outputLanguage
                    ]
                    ,"Synced new project"
                );

                if(result.rowsAffected === 0){

                    addProjectResponse.customResponse = "project could not be added";
                    reject(addProjectResponse);

                }else if (result.rowsAffected === 1){

                    addProjectResponse.message = "operation successful";
                    addProjectResponse.success = true;
                    resolve(addProjectResponse);
                }
                

            }catch(e){

                addProjectResponse.error = e;
                addProjectResponse.customResponse = "project could not be added";

                console.log(e);
                console.trace();
                reject(addProjectResponse);
            }

        })
    };

    static deleteProjectBackend = (userId: string, projectObject: types.ProjectDetails): Promise<types.LocalOperationResponse<string>> =>{

        return new Promise (async(resolve, reject)=>{

            let deleteProjectResponse: types.LocalOperationResponse<string> = {
                success: false,
                operationType: "remove",
                contentType: "project",
                message: "operation unsuccessful" 
            }

            try{

                //Start transaction
                const result = await this.transactionPromiseWrapper(SQLStatements.deleteStatements.deleteProject, 
                    [
                        userId,
                        projectObject.projectName
                    ]
                    ,
                    "Synced project deletion"
                );

                if(result.rowsAffected === 0){

                    deleteProjectResponse.customResponse = "project could not be deleted";
                    reject(deleteProjectResponse);

                }else if (result.rowsAffected === 1){

                    deleteProjectResponse.message = "operation successful";
                    deleteProjectResponse.success = true;
                    resolve(deleteProjectResponse);
                }
                

            }catch(e){

                deleteProjectResponse.error = e;
                deleteProjectResponse.customResponse = "project could not be deleted";

                console.log(e);
                console.trace();
                reject(deleteProjectResponse);
            }

        })
    };


    /* Update projects only relevant when project default languages are used. These are not currently used in the app, so no need to update project */

    // static updateProjectBackend = (userId: string, projectObject: types.ProjectDetails): Promise<types.LocalOperationResponse<string>> =>{

    //     return new Promise (async(resolve, reject)=>{

    //         let updateProjectResponse: types.LocalOperationResponse<string> = {
    //             success: false,
    //             operationType: "update",
    //             contentType: "project",
    //             message: "operation unsuccessful" 
    //         }

    //         try{

    //             //Start transaction
    //             const result = await this.transactionPromiseWrapper(SQLStatements.deleteStatements.deleteProject, 
    //                 [
    //                     userId,
    //                     projectObject.projectName
    //                 ]
    //                 ,
    //                 "Synced project deletion"
    //             );

    //             if(result.rowsAffected === 0){

    //                 deleteProjectResponse.customResponse = "project could not be deleted";
    //                 reject(deleteProjectResponse);

    //             }else if (result.rowsAffected === 1){

    //                 deleteProjectResponse.message = "operation successful";
    //                 deleteProjectResponse.success = true;
    //                 resolve(deleteProjectResponse);
    //             }
                

    //         }catch(e){

    //             deleteProjectResponse.error = e;
    //             deleteProjectResponse.customResponse = "project could not be deleted";

    //             console.log(e);
    //             console.trace();
    //             reject(deleteProjectResponse);
    //         }

    //     })
    // };

    //Entries

    static addNewEntry = (currentUser: types.CurrentUser, entryObject: types.EntryDetails): Promise<types.LocalOperationResponse<string>> =>{

        return new Promise (async(resolve, reject)=>{

            const addNewEntry: types.LocalOperationResponse<string> = {
                customResponse: "",
                success: false,
                message: "operation unsuccessful",
                customResponse: ""
            }

            try{

                //Generate entry id
                const entryId = uuid.v4();

                addNewEntry.customResponse = entryId;

                //Start transaction
                const resultRow = await this.transactionPromiseWrapper(SQLStatements.addStatements.addUserEntry, 
                    [
                        currentUser.userId,
                        currentUser.username,
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
                );

                if(resultRow.rowsAffected === 0){
                    //If insert failed, then we reject                    
                    reject(addNewEntry);

                }else if (resultRow.rowsAffected === 1){

                    addNewEntry.success = true;
                    addNewEntry.message = "operation successful";
                    resolve(addNewEntry);
                }


                

            }catch(e){

                console.log(e);
                console.trace();
                reject(e);
            }

        })
    };

    static deleteEntry = (userId: string, entryId: string): Promise<types.LocalOperationResponse>=>{

        return new Promise(async(resolve, reject)=>{

            const deleteEntry: types.LocalOperationResponse= {
                success: false,
                message: "operation unsuccessful",
                operationType: "remove",
                contentType:  "entry"
           
            }

            try{

            
                const resultRow = await this.transactionPromiseWrapper(SQLStatements.deleteStatements.deleteEntry, [
                    entryId,
                    userId
                ],
                "Entry deleted");

                if(resultRow.rowsAffected === 0){

                    reject(deleteEntry);

                }else if(resultRow.rowsAffected === 1){

                    deleteEntry.success = true;
                    deleteEntry.message = "operation successful";
                    resolve(deleteEntry);

                }

                
        

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
        userId: string, 
        entryId: string,
        targetLanguageText: string,
        targetLanguage: string,
        outputLanguageText: string,
        outputLanguage: string
    ):Promise<types.LocalOperationResponse>=>{

        return new Promise(async(resolve, reject)=>{

            const updateEntry: types.LocalOperationResponse = {
                customResponse: "",
                success: false,
                message: "operation unsuccessful",
                operationType: "update",
                contentType: "entry"
            }

            try{
                const resultRowRaw = await this.transactionPromiseWrapper(SQLStatements.updateStatements.updateUserEntry, [
                        targetLanguageText,
                        outputLanguageText,
                        targetLanguage,
                        outputLanguage,
                        entryId,
                        userId
                ],
                "Update entry successful");

                if(resultRowRaw.rowsAffected ===  0){
                    //If an entry could be updated, then there is an error
                    reject(updateEntry);
                    return
                } else if (resultRowRaw.rowsAffected === 1){

                    updateEntry.success = true;
                    updateEntry.message = "operation successful"
                    resolve(updateEntry);
                }
               
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

    static getEntryById = (userId: string, entryId: string): Promise<types.EntryDetails>=>{

        return new Promise(async(resolve, reject)=>{

            try{

                const resultArrayRaw = await this.transactionPromiseWrapper(SQLStatements.getStatements.getEntryById, [
                    userId,
                    entryId
                ],
                "Single entry fetched");

                if(resultArrayRaw.rowsAffected === 0){
                    //Failed to retrieve new entry

                    reject(null);
                }
    
                const resultArray: Array<types.SQLDBResult<types.SQLUserEntries>> = super.parseRowResults(resultArrayRaw);
    
                if(resultArray.length === 0){
                    //Failed to retrieve new entry

                    reject(null);
                } else if (resultArray.length === 1){

                    const userEntrySQL = resultArray[0];

                    const userEntry = this.convertSQLEntry(userEntrySQL);

                    resolve(userEntry);
                }
        
            }catch(e){

                console.log(e);
                console.trace();
                reject(e);

            }

        })

    };

    static convertSQLEntry = (entryObject: types.SQLUserEntries): types.EntryDetails=>{

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

                                /* Update project currently not needed for app */
                                //await this.updateProjectBackend(userId, userEntry.userContent);
                                
                            }

                            break
                        case "tags":
                            /* Tags currently not required for front end */
                            
                            //Choose user tags operations from this class
                            // if(userEntry.operationType === "add"){

                            // }else if(userEntry.operationType === "delete"){

                            // }else if(userEntry.operationType === "update"){
                                
                            // }

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

    static syncBackendContent = (userId: string, backendContent: types.BackendContent): Promise<types.LocalOperationResponse<string>>=>{
        return new Promise(async (resolve, reject)=>{

            /*
                We start by making a copy of user database in memory.
                THen we delete current database content
                Then we add projects. 
                Then we add entries.
                Then we add tags.

                A failure in this process will trigger a failed result object to the backend
                We then reassign the copied db to the actual db, effectively rollin  back the transaction
            */
            const localSyncResponse: types.LocalOperationResponse<string> = {
                success: false,
                operationType: "sync",
                contentType: "account",
                message: "operation unsuccessful",
                customResponse: ""
            }

            try{
                //Delete current user content from database
                const result = await this.transactionPromiseWrapper(SQLStatements.updateStatements.wipeUserContent, [
                    userId
                ], "User database wiped");

                //Check whether any rows affected 
                if(result.rowsAffected === 0){

                    localSyncResponse.customResponse = "Total sync failed";
                    reject(localSyncResponse);

                }else if (result.rowsAffected === 1){

                    localSyncResponse.message = "operation successful";
                    localSyncResponse.success = true;
                    resolve(localSyncResponse);
                }

            }catch(e){

                //Else reject if there is some other unknown error
                localSyncResponse.customResponse = "Total sync failed";
                reject(localSyncResponse);

            }

            /* ADDING PROJECTS */

            try{
                const projectsArray = backendContent.projects;

                //Set up Promise.all
                const promiseArray = [];

                for(let project of projectsArray){
                    const promise = this.addProjectBackend(userId, project);
                    promiseArray.push(promise);
                }

                //Wait for all promises to resolve. If one fails, then the error will be caught in the catch block
                await Promise.all(promiseArray);

            }catch(e){
                //Error adding projet
                const addingProjectError = e as types.LocalOperationResponse;

                localSyncResponse.customResponse = "Total sync failed";
                localSyncResponse.error = addingProjectError;
                reject(localSyncResponse);

            }

            /* ADDING ENTRIES */
            try{
                const entriesArray = backendContent.entries;

                //Set up Promise.all
                const promiseArray = [];

                for(let entry of entriesArray){
                    const promise = this.addNewEntryBackend(userId, entry);
                    promiseArray.push(promise);
                }

                //Wait for all promises to resolve. If one fails, then the error will be caught in the catch block
                await Promise.all(promiseArray);

            }catch(e){
                //Error adding projet
                const addingEntryError = e as types.LocalOperationResponse;

                localSyncResponse.customResponse = "Total sync failed";
                localSyncResponse.error = addingEntryError;
                reject(localSyncResponse);

            }

            /* ADDING TAGS */
            // try{
            //     const entriesArray = backendContent.entries;

            //     //Set up Promise.all
            //     const promiseArray = [];

            //     for(let entry of entriesArray){
            //         const promise = this.addNewEntryBackend(userId, entry);
            //         promiseArray.push(promise);
            //     }

            //     //Wait for all promises to resolve. If one fails, then the error will be caught in the catch block
            //     await Promise.all(promiseArray);

            // }catch(e){
            //     //Error adding projet
            //     const addingEntryError = e as types.LocalOperationResponse;

            //     localSyncResponse.customResponse = "Total sync failed";
            //     localSyncResponse.error = addingEntryError;
            //     reject(localSyncResponse);

            // }

            /* Resolve */
            resolve(localSyncResponse);
        })
    }


}

export default UserContent;