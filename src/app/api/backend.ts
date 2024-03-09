/*
    eslint-disable
*/

import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {Buffer} from 'buffer'

//API I address 192.168.1.171:3000

//FOR PRODUCTION
    //Need to make sure that the device is making https requests in general

class BackendAPI {

    constructor(){

    }

    //Set global headers

    static setGlobalHeaders():Promise<boolean>{
        return new Promise(async(resolve, reject)=>{

            try{

                //Attempt to get api-key following initial startup

                axios.defaults.headers.common["Authorization"] = "Basic " + Buffer.from("deviceId api-key").toString("base64");

                //If no api key exists, then we make a reuest to the backend to generate a new api key

                const res = await this.#requestAPIKey();

                resolve(res)

            }catch(err){

                //Some error fetching the api key. 

                reject(err);

            }
           
        })
    }
    
    //Request API key for device when first opened
    static #requestAPIKey():Promise<boolean>{
        return new Promise(async(resolve, reject)=>{

            try{

                const uniqueDeviceId = DeviceInfo.getUniqueId(); //Gets unique device id;

                let res = await axios.post("http://192.168.1.171:3000/generateapikey",{
                    deviceId: uniqueDeviceId
                })

                console.log(res);

                resolve(res);

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
                .post("http://192.168.1.171:3000/app/sync", {
                    userSettings: "",  //Content like games left, game settings etc
                    userContent: [] //Chronologically ordered list of buffer content, db changes, deletes, updates etc
                });

                console.log(res);

            }catch(err){

                //Error occurs if negative response from server, request gtimed out, lack of connection etc, keep buffer
                //If there is some conflict with the backend, where for instance there are duplicate entries, then the latest duplicate
                //takes precedence.

                console.log(err)
            }
        })
    }


}




export default BackendAPI;
