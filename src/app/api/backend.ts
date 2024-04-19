/*
    eslint-disable
*/

import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {Buffer} from 'buffer'
import AppLoginDetails from 'app/storage/user_profile_details';

//API local IP address HOME 192.168.43.151:3000

//FOR PRODUCTION
    //Need to make sure that the device is making https requests in general

class BackendAPI {

    constructor(){

    }

    //Set global headers

    static setGlobalHeaders(APIKey=null):Promise<boolean>{
        return new Promise(async(resolve, reject)=>{

            try{

                // Set base URL if your API endpoints share a common base URL
                axios.defaults.baseURL = 'http://192.168.1.126:3000';
                axios.defaults.headers.common['Content-Type'] = 'application/json';

                //Check for API key in local storage. If does not exist, then authorization header not added.

                const resultObject = await AppLoginDetails.checkAPIKey();

                if (resultObject.APIKeyExists){

                    const APIKey = await AppLoginDetails.getAPIKey();

                    const uniqueDeviceId = await DeviceInfo.getUniqueId(); //Gets unique device id;


                    axios.defaults.headers.common["Authorization"] = "Basic " + Buffer.from(`${uniqueDeviceId} ${APIKey}`).toString("base64");

                }
                
            
                resolve(true)

            }catch(err){

                //Some error fetching the api key. 

                reject(err);

            }
           
        })
    }
    
    //Request API key for device when first opened
    static requestAPIKey():Promise<{message:string, APIKey: string}>{
        return new Promise(async(resolve, reject)=>{

            try{

                const uniqueDeviceId = await DeviceInfo.getUniqueId(); //Gets unique device id;

                let res = await axios.post("/generateapikey",{
                    deviceId: uniqueDeviceId
                })

                resolve(res.data);

            }catch(err){

                //Trigger error status for creating app --> monitor error
                console.log(err)
                reject(err);
            }
        })
    }


    //Buffer logic; data stored locally and temporarily

    //Store buffer content locally (run programmatically)
    static storeBufferContent():Promise<boolean>{
        return new Promise((resolve, reject)=>{

            resolve(true)

        })
    }

    //Send buffer content (run every 2 minutes)
    static sendBufferContent():Promise<boolean>{
        return new Promise(async(resolve, reject)=>{

            try{

                let res = await axios
                .post("http://192.168.43.151:3000/app/sync", {
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

    //Create account call

    static 


}




export default BackendAPI;
