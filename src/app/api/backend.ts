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

    static setGlobalHeaders(bufferFlushingStatus: boolean):Promise<boolean>{
        return new Promise(async(resolve, reject)=>{

            try{

                //Configure axios 

                axiosConfig(bufferFlushingStatus);

                //Check for API key in local storage. If does not exist, then authorization header not added.

                const resultObject = await LocalDatabase.getAPIKey();

                if (resultObject.message === "API key exists"){

                    const uniqueDeviceId = await DeviceInfo.getUniqueId(); //Gets unique device id;

                    axios.defaults.headers.common["Authorization"] = "Basic " + Buffer.from(uniqueDeviceId + ":" + resultObject.APIKey).toString("base64");

                }

                resolve(true);

            }catch(err){

                //Some error fetching the api key. 

                console.log("Failed to set global headers");
                console.trace();
                reject(err);

            }
           
        })
    };
    
    //Request API key for device when first opened
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

                resolve(apiKeyResponse);

            }catch(err){

                apiKeyResponse.error = err;

                //Trigger error status for creating app --> monitor error
                console.log(err.message)
                console.log(err.request);
                console.log(err.response)
                reject(apiKeyResponse);
            }
        })
    };

    //Account logic
    static sendAccountInfo(accountObject: types.APIAccountObject<types.AccountOperationDetails>): Promise<types.APIAccountOperationResponse>{
        return new Promise(async (resolve, reject)=>{

            let accountOperationResponse: types.APIAccountOperationResponse = {
                message: "operation unsuccessful",
                success: false,
                contentType: "account",
                accountOperation: accountObject.updateType
                
            };

            try{

                const internetStatus = await this.checkInternetStatus();
            
                //Add operation type to account Object to indicate to backend the type of request type
                accountObject.accountOperationDetails.operationType = "account";

                if(internetStatus){

                    let res; // initiate response object

                    switch(accountObject.updateType){
                        case "create account":
                            res = await axios.post("/account/createaccount", accountObject.accountOperationDetails);
                            break
                        case "delete account":
                            
                            res = await axios.post("/account/deleteaccount", accountObject.accountOperationDetails);
                            break
                        case "upgrade":
                            res = await axios.post("/account/upgrade", accountObject.accountOperationDetails);
                            break
                        case "downgrade":
                            res = await axios.post("/account/downgrade", accountObject.accountOperationDetails);
                            break
                        case "change password":
                            
                            res = await axios.post("/account/updatepassword", accountObject.accountOperationDetails);
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
    static loginSync(logInResultObject: types.LoginResult):Promise<types.LocalBufferOperation>{
        return new Promise(async(resolve, reject)=>{

            //First --> Attempt to send buffers altogether
            //Second --> If network error, then keep buffers,
            //Third --> If backend local content sync error, then full sync proceeds
            //Fourth --> Backend sends sync content from backend, including buffer content
            //Fifth --> process backend content
            //Sixth --> Proceed with app

            const userId = logInResultObject.userId

            try{
                //Fetch buffers

                const buffers = await BufferManager.retrieveBuffers(userId);

                //Assign buffer content to login object
                logInResultObject.buffers.bufferQueue = buffers.customResponse.queue_1; //Main content buffer queue
                logInResultObject.buffers.syncRequests = buffers.customResponse.sync_buffer; //Sync requests
                logInResultObject.buffers.responseQueue = buffers.customResponse.response_buffer; //Sync results responses
                logInResultObject.buffers.acknowledgements = buffers.customResponse.acknowledgements; //Acknowledgement of BE operations

                //Send login result object to backend
                await axios.post("/app/login", logInResultObject);

                //If FE successfully syncs with backend, then we continue with the app. Buffer will be cleared if successfully cleared or not
                //From buffer storage if positive response received from backend. 

                resolve()

            }catch(e){
                //Failure means that: buffers may remain in storage, depending on the type of error, or total sync, in which case buffers will be deleted

                reject()

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

    static translate(searchTerms: types.APITranslateCall): Promise<types.APITranslateResponse>{

        const responseObject: types.APITranslateResponse = {

            success: false,
            translations: [],
            translationRefreshTime: 0,
            translationsLeft: 0,
            message: "no internet"

        };

        return new Promise(async(resolve, reject)=>{

            const [target_language_id, output_language_id] = this.#changeLanguageValue(searchTerms.targetLanguage, searchTerms.outputLanguage);

            try{


                const internetStatus = await this.checkInternetStatus();

                if(internetStatus){

                    const res = await axios.post('/translate', {
                        username: searchTerms.username,
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
                }


                
        
            }catch (error) {
                console.error({...error});
                responseObject.error = error;
                resolve(responseObject);
            }
        })
    }
};

export default BackendAPI;
