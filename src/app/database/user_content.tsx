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
                projectAddResponse.error = e;
                console.log("Error adding project.")
                console.trace();
                reject(projectAddResponse);
            }
            
        })
    };

    static addProjectBackend = (newProjectDetails: types.ProjectDetails): Promise<types.LocalOperationResponse>=>{

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
                        newProjectDetails.userId,
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
                projectAddResponse.error = e;
                console.log("Error adding project.")
                console.trace();
                reject(projectAddResponse);
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
                projectDeletionResponse.error = e;
                console.log("Error deleting project.")
                console.trace();
                reject(projectDeletionResponse);
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
                addNewEntry.error = e;
                addNewEntry.customResponse = "row could not be added";
                console.log(e);
                console.trace();
                reject(addNewEntry);
            }

        })
    };

    static addNewEntryBackend = (entryObject: types.EntryDetails): Promise<types.LocalOperationResponse<string>> =>{

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
                        entryObject.userId,
                        entryObject.username,
                        entryObject.entryId,
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
                addNewEntry.error = e;
                addNewEntry.customResponse = "row could not be added";
                console.log(e);
                console.trace();
                reject(addNewEntry);
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

                deleteEntry.error = e;
                console.log(e);
                console.trace();
                reject(deleteEntry);

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

    static searchTerm = (userId: string, searchString: string): Promise<Array<types.EntryDetails>>=>{

        return new Promise(async(resolve, reject)=>{

            try{
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

                const resultArray: Array<types.SQLUserEntries> = super.parseRowResults(resultArrayRaw);
    
                if(resultArray.length === 0){
                    //Failed to retrieve new entry
                    resolve([]);
                } else if (resultArray.length > 0){

                    const userEntryArray = resultArray.map((entry: types.SQLUserEntries)=>{

                        const userEntry = this.convertSQLEntry(entry);
                        return userEntry;

                    })

                    resolve(userEntryArray);
                }

            }catch(e){

                console.log(e);
                console.trace();
                reject(e);

            }

        })

    };

    static getAllEntries = (userId: string): Promise<Array<types.EntryDetails>>=>{

        return new Promise(async(resolve, reject)=>{

            try{;

                const resultArrayRaw = await this.transactionPromiseWrapper(SQLStatements.getStatements.getAllEntries, [
                    userId,
                ],
                "All entries fetched");
    
                const resultArray: Array<types.SQLUserEntries> = super.parseRowResults(resultArrayRaw);

                if(resultArray.length === 0){
                    //Failed to retrieve any entry
                    resolve([]);
                } else if (resultArray.length > 0){
                    //Success

                    const userEntryArray = resultArray.map((entry: types.SQLUserEntries)=>{

                        const userEntry = this.convertSQLEntry(entry);
                        return userEntry;

                    })

                    resolve(userEntryArray);
                }        
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
    static syncUserContent =  (userId: string, userContent:Array<types.OperationWrapper>): Promise<types.LocalOperationResponse<{
        failedContent: Array<any>
        failedContentIndex: number
    }>>=>{

        return new Promise(async(resolve)=>{

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

                const operationWrapper = userContent[i]
                const userContentItem = operationWrapper.userData

                try{
                    //Assign type to object
                    switch(userContentItem.dataType){
                        case "entry":

                            const userEntry = userContentItem as types.EntryDetails;
                            //Choose user entry operations from this class
                            if(operationWrapper.operationType === "create"){

                                await this.addNewEntryBackend(userEntry);

                            }else if(operationWrapper.operationType === "remove"){

                                await this.deleteEntry(userId, userEntry.entryId);

                            }else if(operationWrapper.operationType === "update"){

                                await this.updateEntry(
                                    userId, 
                                    userEntry.entryId,
                                    userEntry.targetLanguageText,
                                    userEntry.targetLanguage,
                                    userEntry.outputLanguageText,
                                    userEntry.outputLanguage
                                );

                            }

                            break
                        case "project":

                            const userProject = userContentItem as types.ProjectDetails;
                            //Choose user project operations from this class
                            if(operationWrapper.operationType === "create"){

                                await this.addProjectBackend(userProject);

                            }else if(operationWrapper.operationType === "remove"){

                                await this.deleteProject(userId, userProject.projectName);

                            }else if(operationWrapper.operationType === "update"){

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

                    syncUserContentResponse.success = true;
                    resolve(syncUserContentResponse);

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

    //Total sync
    static syncBackendContent = (currentUser: types.CurrentUser, backendContent: types.BackendContent): Promise<types.LocalOperationResponse<string>>=>{
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
                const promiseResults = await Promise.all([
                    this.transactionPromiseWrapper(SQLStatements.deleteStatements.deleteAllUserEntries, [
                    currentUser.userId
                    ], "User entries wiped"),

                    this.transactionPromiseWrapper(SQLStatements.deleteStatements.deleteAllUserProjects, [
                        currentUser.userId
                    ], "User projects wiped"),

                    this.transactionPromiseWrapper(SQLStatements.deleteStatements.deleteAllUserTags, [
                        currentUser.userId
                    ], "User tags wiped")
            
                ]);

                
                //Check whether any rows affected 
                if(promiseResults[0].rowsAffected === 0 || promiseResults[1].rowsAffected === 0 || promiseResults[2].rowsAffected === 0){

                    localSyncResponse.customResponse = "Total sync failed";
                    reject(localSyncResponse);

                }else if (promiseResults[0].rowsAffected === 1 && promiseResults[1].rowsAffected === 1 && promiseResults[2].rowsAffected === 1){

                    //Continue with syncing process
                }

            }catch(e){

                //Else reject if there is some other unknown error
                localSyncResponse.customResponse = "Total sync failed";
                reject(localSyncResponse);

            }

            /* ADDING PROJECTS */

            try{
                const projectsArray = backendContent.projects;

                for(let project of projectsArray){
                   await this.addProject(currentUser.userId, project);
                }


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

                for(let entry of entriesArray){
                    await this.addNewEntry(currentUser, entry);
                }

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