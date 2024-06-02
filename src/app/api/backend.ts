/*
    eslint-disable
*/

import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {Buffer} from 'buffer'
import * as types from '@customTypes/types.d'
import NetInfo from "@react-native-community/netinfo";
import axiosConfig from './axios_config';

import LocalDatabase from 'app/database/local_database';
import BufferManager from './buffer';
import EncryptedStorage from 'react-native-encrypted-storage/lib/typescript/EncryptedStorage';

class BackendAPI {

    //Check internet status
    static checkInternetStatus(){

        return new Promise(async(resolve, reject)=>{

            try{

                const status = await NetInfo.fetch();

                resolve(status.isInternetReachable);

            }catch(e){

                resolve(e)
            }
        })
       
    };

    static internetStatus: boolean | null = false

    //Set global headers

    static setGlobalHeaders(bufferFlushingStatus: boolean):Promise<types.LocalOperationResponse>{
        return new Promise(async(resolve, reject)=>{

            const setGlobalHeaders: types.LocalOperationResponse = {
                success: false,
                message: "operation unsuccessful",
                customResponse: ""
            }

            try{

                //Configure axios headers, interceptors etc.
                axiosConfig(bufferFlushingStatus);

                //Check for API key in local storage. If does not exist, then authorization header not added.
                const {customResponse} = await LocalDatabase.getAPIKey();

                if (customResponse.message === "API key exists"){
                    //If API key exists, then we set authorisation header
                    const uniqueDeviceId = await DeviceInfo.getUniqueId(); //Gets unique device id;
                    axios.defaults.headers.common["Authorization"] = "Basic " + Buffer.from(uniqueDeviceId + ":" + customResponse.APIKey).toString("base64");

                    setGlobalHeaders.success = true;
                    resolve(setGlobalHeaders);

                }else if (customResponse.message  === "No API key exists"){
                    //If no API key exists then request new one here and save in encrypted storage
                    const apiKeyResponse = await this.requestAPIKey();

                    const uniqueDeviceId = await DeviceInfo.getUniqueId(); //Gets unique device id;
                    axios.defaults.headers.common["Authorization"] = "Basic " + Buffer.from(uniqueDeviceId + ":" + apiKeyResponse.APIKey).toString("base64");

                    setGlobalHeaders.success = true;
                    resolve(setGlobalHeaders);
                }
            }catch(err){

                //Some error fetching the api key. 
                setGlobalHeaders.error = err;

                console.log("Failed to set global headers");
                console.trace();
                reject(setGlobalHeaders);

            }
           
        })
    };
    
    //Request API key for device when first opened and set in storage
    static requestAPIKey():Promise<types.APIKeyOperationResponse>{
        return new Promise(async(resolve, reject)=>{

            const apiKeyResponse: types.APIKeyOperationResponse = {
                success: false,
                message: "operation unsuccessful",
                operationType: "create",
                apiOperationType: "generate api key",
                APIKey: ""
            }

            try{
                const uniqueDeviceId = await DeviceInfo.getUniqueId(); //Gets unique device id;

                const keyRequest: types.APIGenerateKeyRequest = {
                    deviceId: uniqueDeviceId,
                    deviceType: "app"
                }

                let res = await axios.post("/generateapikey", keyRequest);
                const apiKeyResponse: types.APIKeyOperationResponse = res.data;

                //Store the api key locally in encrypted storage
                await EncryptedStorage.setItem("api-key",
                    apiKeyResponse.APIKey
                )
               
                //If successfully stored, then we resolve the promise
                resolve(apiKeyResponse);

            }catch(err){

                //Trigger error status for creating app --> monitor error
                console.log(err.message)
                console.log(err.request);
                console.log(err.response)
                reject(apiKeyResponse);
            }
        })
    };

    //Account logic
    static sendAccountInfo(accountObject: types.APIAccountObject<types.AccountOperationDetails>): Promise<types.BackendOperationResponse<string>>{
        return new Promise(async (resolve, reject)=>{

            let accountOperationResponse: types.BackendOperationResponse<string> = {
                message: "operation unsuccessful",
                success: false,
                operationType: accountObject.operationType,
                userId: "" //User id from backend

            };

            try{

                const internetStatus = await this.checkInternetStatus();
        
                if(internetStatus){

                    let res; // initiate response object

                    switch(accountObject.operationType){
                        case "create account":
                            res = await axios.post("/account/createaccount", accountObject);
                            break
                        case "delete account":
                            
                            res = await axios.post("/account/deleteaccount", accountObject);
                            break
                        case "upgrade":
                            res = await axios.post("/account/upgrade", accountObject);
                            break
                        case "downgrade":
                            res = await axios.post("/account/downgrade", accountObject);
                            break
                        case "change password":
                            
                            res = await axios.post("/account/updatepassword", accountObject);
                            break

                    }

                    console.log(res, "Account API response");

                    accountOperationResponse = res.data; //Replace response with response object from backend

                    //Response object
                    if(accountOperationResponse.success){
                        //If the operatoin was successful
                        resolve(accountOperationResponse)

                    }else if(accountOperationResponse) {

                        //If the operation failed
                        reject(accountOperationResponse)
                        //Add details to buffer
                    }

                }else if(!internetStatus){

                    accountOperationResponse.message = "no internet";
                    reject(accountOperationResponse);

                }
            

            }catch(e){

                console.log({...e}, "BackendAPI.sendAccountInfo");

                //Add details to buffer - call this function later

                accountOperationResponse.error = e;
                accountOperationResponse.success = false;
                accountOperationResponse.message = "misc error"

                reject(accountOperationResponse);
            }


        })
    };

    //Logged in account call
    static loginSync(logInResultObject: types.LoginResult):Promise<types.LocalOperationResponse>{
        return new Promise(async(resolve, reject)=>{

            //First --> Attempt to send buffers altogether
            //Second --> If network error, then keep buffers,
            //Third --> If backend local content sync error, then full sync proceeds
            //Fourth --> Backend sends sync content from backend, including buffer content
            //Fifth --> process backend content
            //Sixth --> Proceed with app

            const loginOperationResponse: types.LocalOperationResponse = {
                success: false,
                contentType: "account",
                operationType: "sync",
                message: "operation unsuccessful"

            }
            try{
                //Send login result object to backend
                await axios.post("/app/login", logInResultObject);
                /* 
                    there are several event permutations: 
                        - 1) login successful. No content to sync in backend. Backend has no content to send. FE acknowledges.
                        - 2) login successful. Content to sync with backend. Backend successfully syncs, and sends result. FE acknoiwledges
                        - 3) login successful.  Content to sync with backend. Backend unsuccessful. Sends result and raises full sync flag. FE syuccessfully syncs, and sends result. BE acknowledges
                        - 4) login successful. Content to sync with backend. Backend successfully syncs, sneds content to FE. FE syncs success, and sends result to BE. BE acknowledges
                        - 5) login successful. Content to sync with backend. Backend successful suncs, sends content to FE. FE fails, sends result. BE raises full sync flag and sends content to FE. BE waits until positive result before lowering flag. BE acknowledges
                        - 6) login unsuccessful. No event sent to backend.
                    
                    All these operations handled by interceptor. 
                */

                loginOperationResponse.success = true;
                loginOperationResponse.message = "operation successful";
                resolve(loginOperationResponse)

            }catch(e){
                //Failure means that: buffers may remain in storage, depending on the type of error, or total sync, in which case buffers will be deleted

                loginOperationResponse.error = e;
                reject(loginOperationResponse)

            }

                           
                    
    
            
          
        })
    }

    //Deepl translate
    
    static #changeLanguageValue(target_lang: string, output_lang:string){

        const languageObject: types.languageObject = {
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
        };

        let target_language_id = languageObject[`${target_lang}`];
        let output_language_id = languageObject[`${output_lang}`];

        return [target_language_id, output_language_id]
    }

    static translate = (searchTerms: types.APITranslateCall): Promise<types.APITranslateResponse>=>{

        return new Promise(async(resolve, reject)=>{

            const responseObject: types.APITranslateResponse = {

                success: false,
                translations: [],
                translationRefreshTime: 0,
                translationsLeft: 0,
                message: "no internet"
    
            };

            const [target_language_id, output_language_id] = this.#changeLanguageValue(searchTerms.targetLanguage, searchTerms.outputLanguage);

            try{
                const internetStatus = await this.checkInternetStatus();

                if(internetStatus){

                    const res = await axios.post('/translate', {
                        userId: searchTerms.userId,
                        targetText: searchTerms.targetText,
                        targetLanguage: target_language_id,
                        outputLanguage: output_language_id,
                        operationType: "translate"
                    });
    
                    const translationResponse: types.APITranslateResponse = res.data;
                    
                    responseObject.translations = translationResponse.translations[0];
                    responseObject.success = true;
                    responseObject.translationsLeft = translationResponse.translationsLeft;
                    responseObject.translationRefreshTime = translationResponse.translationRefreshTime;
    
                    //return translation 
                    resolve(responseObject);

                }else if(!internetStatus){
                    
                    responseObject.message = "no internet"
                    reject(responseObject)
                };                
        
            }catch (error) {
                console.error({...error});
                responseObject.error = error;
                resolve(responseObject);
            }
        })
    }
};

export default BackendAPI;
