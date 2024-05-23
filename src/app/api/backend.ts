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
import UserContent from 'app/database/user_content';
import UserDetails from 'app/database/user_profile_details';
import BufferManager from './buffer';
import SyncManager from './sync_manager';

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

    //User entries logic 
    static sendEntryInfo(entryObject: types.APIEntryObject): Promise<types.APIOperationResponse>{
        return new Promise(async(resolve, reject)=>{

            let entryAPIResponseObject: types.APIOperationResponse = {
                success: false,
                operationType: entryObject.updateType,
                contentType: "entry",
                message: "operation unsuccessful"
            }

            try{

                let res; // initiate response object

                //Add operation type to account Object to indicate to backend the type of request type
                entryObject.entryDetails.operationType = "entry";

                switch(entryObject.updateType){
                    case "create":
                        res = await axios.post("/app/entries/addentry", entryObject.entryDetails);
                        break
                    case "update":
                        res = await axios.post("/app/entries/updateentry", entryObject.entryDetails);
                        break
                    case "remove":
                        res = await axios.post("/app/entries/deleteentry", entryObject.entryDetails);
                        break

                }

                console.log(res, "Entry API response");

                entryAPIResponseObject = res.data; //Replace response with response object from backend

                //Response object

                if(entryAPIResponseObject.success){
                    //If the operatoin was successful
                    resolve(entryAPIResponseObject)

                }else if(!entryAPIResponseObject.success) {

                    //If the operation failed
                    reject(entryAPIResponseObject)

                    //Add details to buffer
                }



            }catch(e){

                console.log({...e}, "BackendAPI.sendEntryInfo");

                entryAPIResponseObject.error = e;
                entryAPIResponseObject.success = false;
                entryAPIResponseObject.message = "misc error"

                reject(entryAPIResponseObject);
            }

        })
    }

    //User project logic 
    static sendProjectInfo(projectObject: types.APIProjectObject): Promise<types.APIOperationResponse>{
        return new Promise(async(resolve, reject)=>{

            let projectAPIResponseObject: types.APIOperationResponse = {
                success: false,
                operationType: projectObject.updateType,
                contentType: "project",
                message: "operation unsuccessful"
            }

            try{


                let res; // initiate response object

                //Add operation type to account Object to indicate to backend the type of request type
                projectObject.projectDetails.operationType = "project";

                switch(projectObject.updateType){
                    case "create":
                        res = await axios.post("/app/entries/newproject", projectObject.projectDetails);
                        break
                    case "remove":
                        res = await axios.post("/app/entries/deleteproject", projectObject.projectDetails);
                        break

                }

                console.log(res, "Project API response");

                projectAPIResponseObject = res.data; //Replace response with response object from backend

                //Response object

                if(projectAPIResponseObject.success){
                    //If the operatoin was successful
                    resolve(projectAPIResponseObject)

                }else if(!projectAPIResponseObject.success) {

                    //If the operation failed
                    reject(projectAPIResponseObject)

                    //Add details to buffer
                }



            }catch(e){

                console.log({...e}, "Project api error")
                //Add details to buffer - call this function later

                projectAPIResponseObject.error = e;
                projectAPIResponseObject.success = false;
                projectAPIResponseObject.message = "misc error"

                reject(projectAPIResponseObject);
            }

        })
    }

    //User settings logic 
    static sendSettingsInfo(settingsObject: types.UserSettings): Promise<types.APIOperationResponse>{
        return new Promise(async(resolve, reject)=>{

            let settingsAPIResponse: types.APIOperationResponse = {
                success: false,
                operationType: "update",
                contentType: "settings",
                message: "operation unsuccessful"
            }

            try{

                let res; // initiate response object

                //Add operation type to account Object to indicate to backend the type of request type
                settingsObject.operationType = "settings";


                res = await axios.post("/app/settings/update", settingsObject);
                    

                console.log(res, "User settings response");

                settingsAPIResponse = res.data; //Replace response with response object from backend

                //Response object

                if(settingsAPIResponse.success){
                    //If the operatoin was successful
                    resolve(settingsAPIResponse)

                }else if(!settingsAPIResponse.success) {

                    //If the operation failed
                    reject(settingsAPIResponse)

                    //Add details to buffer
                }

            }catch(e){

                console.log({...e}, "BackendAPI.sendEntryInfo");

                //Add details to buffer - call this function later

                settingsAPIResponse.error = e;
                settingsAPIResponse.success = false;
                settingsAPIResponse.message = "misc error"

                reject(settingsAPIResponse);
            }

        })
    }


    //UPdate user plays left
    static updatePlaysLeft = (userId: string, playsLeft: number, playsRefreshTime: string): Promise<types.APIOperationResponse> =>{
        return new Promise(async(resolve, reject)=>{

            let playsAPIResponse: types.APIOperationResponse = {
                success: false,
                operationType: "update",
                contentType: "account",
                message: "operation unsuccessful"
            }

            try{

                let res; // initiate response object

                const playsObject: types.APIPlaysObject = {

                    updateType: "update",
                    playsDetails: {
                        playsLeft: playsLeft,
                        playsRefreshTime: playsRefreshTime,
                        userId: userId
                    },
                    operationType: "account"
                    
                } 

                res = await axios.post("/app/game/updateplays", playsObject);
                    

                console.log(res, "User settings response");

                playsAPIResponse = res.data; //Replace response with response object from backend

                //Response object

                if(playsAPIResponse.success){
                    //If the operatoin was successful
                    resolve(playsAPIResponse)

                }else if(!playsAPIResponse.success) {

                    //If the operation failed
                    reject(playsAPIResponse)

                    //Add details to buffer
                }


            }catch(e){

                console.log(e, "BackendAPI.sendEntryInfo");

                //Add details to buffer - call this function later

                playsAPIResponse.error = e;
                playsAPIResponse.success = false;
                playsAPIResponse.message = "misc error"

                reject(playsAPIResponse);
            }
        })
    }

    //Loggred in account call

    static sendLoggedInEvent(logInResultObject: types.APILoginResult):Promise<types.BufferSyncResult>{
        return new Promise(async(resolve, reject)=>{

        
            let syncResult: types.BufferSyncResult = {
                deleteAccount: false
            } 

            try{
                logInResultObject.operationType = "login";

                const res = await axios.post('/app/login', logInResultObject);

                const APILoginResponse: types.APIAccountOperationResponse<types.APIPostLoginSetUp> = res.data;


                if(APILoginResponse.success){
                    //If the operatoin was successful, trigger app sync

                    /* Synce user setttings with frontend */
                    syncResult = await SyncManager.processLoginSync(APILoginResponse.userId, APILoginResponse.customResponse);

                    /* Send sync result back to backend to process futher */

                    const confResult = await axios.post("app/login/syncresult", syncResult); // --> TODO add interceptor to handle this particular request, given its complexity.
                    
                    //If local syncing successful, then we load the app. If not, then we re attempt wholesale sync with backend
                    //Intervening network errors must be handled. If sync successful, then user can carry on. If unsuccessful, then resynnc with backend must take place on  reload
                    //Any new entries in local buffer must be sent to backend after reconnection. Then  wholesale syncing must take place

                    resolve()

                    
                    
                }else if(!APILoginResponse.success) {

                    //If the operation failed then failure
                    reject(APILoginResponse);
                }

            }catch(e){

                console.log({...e}, "BackendAPI.sendEntryInfo");

                //Add details to buffer - call this function later

                syncResult.error = e;
                syncResult.success = false;
                syncResult.message = "misc error"

                reject(syncResult);

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
