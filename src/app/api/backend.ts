/*
    eslint-disable
*/

import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {Buffer} from 'buffer'
import * as types from '@customTypes/types.d'
import NetInfo from "@react-native-community/netinfo";
import LocalDatabase from 'app/database/local_database';


//FOR PRODUCTION
    //Need to make sure that the device is making https requests in general

class BackendAPI {

    //Check internet status

    static checkInternetStatus(){

        return new Promise(async(resolve, reject)=>{

            try{

                const status = await NetInfo.fetch();

                resolve(status.isConnected);

            }catch(e){

                resolve(e)
            }
        })
       
    }

    static internetStatus: boolean | null = false

    //Set global headers

    static setGlobalHeaders(APIKey = null):Promise<boolean>{
        return new Promise(async(resolve, reject)=>{

            try{

                // Set base URL if your API endpoints share a common base URL
                axios.defaults.baseURL = 'http://192.168.1.171:3000';
                axios.defaults.headers.common['Content-Type'] = 'application/json';

                //Set default timeout to 1 second
                axios.defaults.timeout = 15000;

                //Check for API key in local storage. If does not exist, then authorization header not added.

                const resultObject = await LocalDatabase.getAPIKey();

                if (resultObject.message === "API key exists"){

                    console.log(resultObject);

                    const uniqueDeviceId = await DeviceInfo.getUniqueId(); //Gets unique device id;

                    axios.defaults.headers.common["Authorization"] = "Basic " + Buffer.from(uniqueDeviceId + ":" + resultObject.APIKey).toString("base64");

                }

                console.log("Global headers set");
                resolve(true);

            }catch(err){

                //Some error fetching the api key. 

                console.log("Failed to set global headers");
                console.trace();
                reject(err);

            }
           
        })
    }
    
    //Request API key for device when first opened
    static requestAPIKey():Promise<{message:string, APIKey: string}>{
        return new Promise(async(resolve, reject)=>{

            try{
                console.log(axios.defaults, "Request API call");

                const uniqueDeviceId = await DeviceInfo.getUniqueId(); //Gets unique device id;

                let res = await axios.post("/generateapikey",{
                    deviceId: uniqueDeviceId
                });

                console.log(res, "Request API response")

                resolve(res.data);

            }catch(err){

                //Trigger error status for creating app --> monitor error
                console.log(err.message)
                console.log(err.request);
                console.log(err.response)
                reject(err);
            }
        })
    }

    //Create account logic  

    static createAccount(details: types.CreateAccountCall): Promise<types.CreateAccountResponse>{
        return new Promise(async (resolve, reject)=>{

            try{

                console.log(axios.defaults, "Create account call");

                const res = await axios.post("/account/createaccount", details);

                console.log(res, "Create account response")

                const userAddResponseObject: types.CreateAccountResponse = res.data;

                resolve(userAddResponseObject);               

            }catch(err){

                //Trigger error status for creating app --> monitor error
                 console.log(err.message)
                console.log(err.request);
                console.log(err.response)
                reject(err);
            }

        })
    }


    //Buffer logic; data stored locally and temporarily

    //Store buffer content locally (run programmatically)
    static #storeBufferContent():Promise<boolean>{
        return new Promise((resolve, reject)=>{

            resolve(true)

        })
    }

    //Loggred in account call

    static sendLoggedInEvent(logInResultObject: types.LoginResultObject):Promise<boolean>{
        return new Promise(async(resolve, reject)=>{

            const internetStatus = await this.checkInternetStatus(); //Check internet status

            if(internetStatus){
                try{

                    console.log("Send logged in again first")
                    const res = await axios.post('/app/login', {
                        loginResultObject: logInResultObject
                    });
                    console.log(res) 

                    const APIUpdateResponseObject = res.data;

                    resolve(APIUpdateResponseObject);

                }catch(e){

                    reject(e);
    
                }
            } else if (!internetStatus){

                //Add to buffer to send when coneciton restarts.

                resolve(null)


            }

          
        })
    }

    //Send buffer content (run every 2 minutes)
    static #sendBufferContent(contentObject, eventType):Promise<boolean>{
        return new Promise(async(resolve, reject)=>{

            try{

                let res = await axios
                .post("/app/sync", {
                    userSettings: "",  //Content like games left, game settings etc
                    userContent: [] //Chronologically ordered list of buffer content, db changes, deletes, updates etc
                });

                console.log(res);

            }catch(err){

                //Error occurs if negative response from server, request timed out, lack of connection etc, keep buffer
                //If there is some conflict with the backend, where for instance there are duplicate entries, then the latest duplicate
                //takes precedence.

                console.log(err)
            }
        })
    };

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

    static translate(searchTerms: types.TranslateCallObject): Promise<types.TranslateResponseObject>{

        const responseObject: types.TranslateResponseObject = {

            success: false,
            translations: []

        };

        return new Promise(async(resolve, reject)=>{

            const [target_language_id, output_language_id] = this.#changeLanguageValue(searchTerms.targetLanguage, searchTerms.outputLanguage);

            try{
                const apiResponse = await axios.post('/translate', {
                    username: searchTerms.username,
                    text: searchTerms.targetText,
                    source_lang: target_language_id,
                    target_lang: output_language_id
                });
                

                responseObject.translations = apiResponse.data.translations[0];
                responseObject.success = true;

                //return translation 
                resolve(responseObject);
        
            }catch (error) {
                console.error(error);
                resolve(responseObject);
            }
        })
    }
};

export default BackendAPI;
