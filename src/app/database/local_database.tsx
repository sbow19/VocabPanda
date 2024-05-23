/* eslint-disable */

import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import { Alert } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import EncryptedStorage from "react-native-encrypted-storage";
import BackendAPI from 'app/api/backend';
import SQLStatements from './prepared_statements';

import moment from 'moment';
import * as types from '@customTypes/types.d'
import db from './db_util';


class LocalDatabase{

    static transactionPromiseWrapper = (sqlStatement: string, args: string[], successMessage = null): Promise<SQLite.ResultSet>=>{
        return new Promise(async(resolve, reject)=>{


            try{

                let resultArray;
                
                db.transaction((transaction)=>{
                
                    transaction.executeSql(sqlStatement, args, 
                
                        (tx, result)=>{
                            resultArray = result
                        });        
                },
                (error)=>{

                    console.log("Error occured", error)
                    reject(error)

                },
                (success)=>{
                    console.log("Transaction successful: ", successMessage)
                    resolve(resultArray)
                    
                });

            }catch(e){
                console.log("Hello")
                reject(e)
            }
            

        })
    }

    static parseRowResults = (resultArrayRaw)=>{

        let resultArrayRawLength = resultArrayRaw.rows.length;
        let resultArray = [];

        for(let i=0; i<resultArrayRawLength; i++){

            resultArray.push(resultArrayRaw.rows.item(i))
        };


        return resultArray
    }

    static createDatabaseSchema = () =>{

        return new Promise(async (resolve, reject)=>{

                try{

                    await this.transactionPromiseWrapper(SQLStatements.databaseSchema.USERS, [], "users table created or exists");
                    await this.transactionPromiseWrapper(SQLStatements.databaseSchema.USER_DETAILS, [], "user details table created or exists");
                    await this.transactionPromiseWrapper(SQLStatements.databaseSchema.USER_SETTINGS, [], "user settings created or exists");
                    await this.transactionPromiseWrapper(SQLStatements.databaseSchema.PROJECTS, [], "projects created or exists");
                    await this.transactionPromiseWrapper(SQLStatements.databaseSchema.TRANSLATIONS_LEFT, [], "translations left table created or exists");
                    await this.transactionPromiseWrapper(SQLStatements.databaseSchema.PLAYS_LEFT, [], "plays left table created or exists");
                    await this.transactionPromiseWrapper(SQLStatements.databaseSchema.NEXT_PLAYS_REFRESH, [], "next plays refresh table created or exists");
                    await this.transactionPromiseWrapper(SQLStatements.databaseSchema.NEXT_TRANSLATIONS_REFRESH, [], "next translations refresh table created or exists");
                    await this.transactionPromiseWrapper(SQLStatements.databaseSchema.USER_ENTRIES, [], "user entries table created or exists");

                    resolve(null);
                    
                }catch(e){

                    reject(e)
                }finally{
                    resolve(null)
                }

        })
    }


    //FOR DEVELOPMENT -= DROP ENTIRE DATABASE

    static resetDatabase = ()=>{

        return new Promise(async (resolve, reject)=>{

            try{

                Alert.alert(
                    "Reset database?",
                    "Would you like to refresh the local database?",
                    [
                        {
                            text: "Yes",
                            onPress: async()=>{

                                try{

                                    const resultObject = await SQLite.deleteDatabase({

                                        name: `vocabpanda.db`,
                                        location: "default"
                                    }
                                    )
                    
                                    console.log(resultObject);
    
                                    await EncryptedStorage.removeItem("api-key");
                    
                                    resolve(resultObject);
                    

                                }catch(e){
                                    throw e
                                }

                                
                            }
                        },
                        {
                            text: "No",
                            onPress: ()=>{

                                resolve(null);
                            }
                        }
                    ],
                    {
                        cancelable: false
                    }
                )

            }catch(e){

                console.log(e);

                reject(e);


            }
            

        })

    }

    static setAPIKey = ()=>{

        return new Promise(async(resolve, reject)=>{

            try{

                const APIKey = await EncryptedStorage.getItem('api-key');

                //Check for internet connection

                const isOnline = await NetInfo.fetch().then(state=>{

                    return state.isConnected;
                });

                //Testing backend API key generatio
    
                if(!APIKey && isOnline){

                    //Where user device has no data and is connected to internet, api key requewst made,
            
                    const backendResponse = await BackendAPI.requestAPIKey();

                    if(!backendResponse.APIKey){
                        const error = "Backend error generating API key."
                        throw error;
                    };

                    await EncryptedStorage.setItem("api-key",
                        backendResponse.APIKey
                    );

                    //Once API key set in local storage  we need to re add the global headers

                    await BackendAPI.setGlobalHeaders();

                    resolve(null);
                    return

                } else if (!APIKey && !isOnline){

                    const error = "User must be online before starting app.";
                    throw error

                } else if (APIKey){

                    //Once API key set in local storage  we need to re add the global headers
                    await BackendAPI.setGlobalHeaders();

                    resolve(null);
                    return
                }
            
            
            }catch(e){
                console.log(e);
                const AddLocalUserDetailsError = new Error(
                    "Error creating local storage for API Key."
                ).stack;
                
                reject(AddLocalUserDetailsError);
            }
        })       
    };

    static getAPIKey = ()=>{

        return new Promise(async(resolve)=>{

            const resultObject = {
                APIKey: "",
                message: ""
            };

            try{
    
                /* Get API key from storage */
                const APIKey = await EncryptedStorage.getItem('api-key');

                //Check that API key exists

                if(APIKey === null){
                    /* Check if inputted password matches password in database */

                    resultObject.APIKey = "";
                    resultObject.message = "No API key exists";

                    resolve(resultObject);

                    return

                } else if (APIKey){

                    resultObject.APIKey = APIKey;
                    resultObject.message = "API key exists";

                    resolve(resultObject);

                    return

                }

            }catch(e){
    
                resultObject.message = "No API key exists"
                resolve(resultObject);
    
            }
        })
    };

    static checkAPIKey = async ()=>{

        return new Promise(async(resolve, reject)=>{

            const resultObject = {
                APIKeyExists: false,
                message: ""
            };

            try{
    
                /* Get api keys in local storage */
                const APIKeysRaw = await EncryptedStorage.getItem('api-key');

                console.log(APIKeysRaw)
    
                const APIKeys = JSON.parse(APIKeysRaw);


                if(!APIKeys){

                    resultObject.APIKeyExists = false;
                    resolve(resultObject);
                } else if (APIKeys){

                    resultObject.APIKeyExists = true;
                    resolve(resultObject);
                }


                

            }catch(e){
    
                resultObject.message = "Error checking API Key" + JSON.stringify(e);
                console.log(resultObject.message)
                reject(resultObject)
    
            }
        })
    };

    //MISC methods

    static getCurrentTime(){
        // Get current datetime
        const sqlFormattedDate = moment().format('YYYY-MM-DD HH:mm:ss');

        return sqlFormattedDate
    }

    static getUserId(username: string): Promise<string>{
        return new Promise(async(resolve, reject)=>{

            try{

                const resultArrayRaw = await this.transactionPromiseWrapper(SQLStatements.generalStatements.getUserId, [username], "fetched user id");

                const resultArray = this.parseRowResults(resultArrayRaw);

                if(resultArray.length === 0){

                    throw "Error: no user id found"

                }else if (resultArray.length === 1){

                    

                    const userId = resultArray[0].id;
                    resolve(userId);
                }

            }catch(e){
                reject(e)
            }

        })
    };

}

export default LocalDatabase;