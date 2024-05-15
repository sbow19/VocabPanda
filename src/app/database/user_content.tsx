/* eslint-disable */

import SQLStatements from './prepared_statements';


import * as types from '@customTypes/types.d'
import LocalDatabase from './local_database';
import uuid from "react-native-uuid";


class UserContent extends LocalDatabase {

    //Managing Projects

    static addProject= (username: string, projectObject: types.ProjectObject)=>{

        return new Promise(async(resolve, reject)=>{

            console.log(projectObject)

            try{

                //Get user id

                const userId = await super.getUserId(username);

                //Start transaction

                await this.transactionPromiseWrapper(SQLStatements.addStatements.addProject, [
                        userId,
                        projectObject.projectName,
                        projectObject.targetLanguage,
                        projectObject.outputLanguage
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

    //Entries

    static addNewEntry = (username: string, entryObject: types.EntryObject): Promise<void> =>{

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
                        entryObject.input, 
                        entryObject.inputLang, 
                        entryObject.output, 
                        entryObject.outputLang, 
                        0,
                        entryObject.project
                    ]
                    , 
                    "Added user entry"
                )
                resolve(null)

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


}

export default UserContent;