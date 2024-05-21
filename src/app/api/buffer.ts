/*
    eslint-disable
*/

import AsyncStorage from "@react-native-async-storage/async-storage";

import * as types from '@customTypes/types.d';
import BackendAPI from "./backend";

class BufferManager {

    //Create buffer Storage
    static createBufferStorage = ()=>{
        return new Promise(async(resolve, reject)=>{
            try{

                const requestStorage: types.BufferStorageObject = {
                    queue_1: [],
                    queue_2: []
                };

                //Check if item already in storage
                const existingRequests = await AsyncStorage.getItem("buffer");

                if(existingRequests === null){
                    
                    const bufferStorageString = await JSON.stringify(requestStorage);

                    await AsyncStorage.setItem("buffer", bufferStorageString);
                    console.log("Buffer storage created")
                    resolve(true)

                }else if (existingRequests !== null){

                    console.log(existingRequests)
                    console.log("Buffer storage exists")
                    resolve(true)
                }

            }catch(e){
                console.log(e, "Create buffer storage error.");
                reject(e);
            }
        })
    } 

    //Store a request TODO make it so settings is unique
    static storeRequestMainQueue = (url: string, requestDetails): Promise<types.BufferStorageResponse>=>{
        return new Promise(async(resolve, reject)=>{

            try{

                const requestObject = {
                    url: url,
                    requestDetails: requestDetails
                }

                //Check if item already in storage
                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests = await JSON.parse(existingRequestsRaw);

                console.log(existingRequests)

                const existingRequestsMainQueue = existingRequests.queue_1;

                const existingRequestsMapped = existingRequestsMainQueue.filter((request)=>{

                    if(request["url"] === "/app/settings/update" && url === "/app/settings/update"){
                        return false
                    }else if (request["url"] === "/app/login" && url === "/app/login"){
                        return false
                    }else if(request["url"] === "/app/game/updateplays" && url === "/app/game/updateplays"){
                        return false
                    }
                    else {
                        return true
                    }
                });

                existingRequestsMapped.push(requestObject);

                existingRequests.queue_1 = existingRequestsMapped;

                const stringifiedBuffer = await JSON.stringify(existingRequests);

                await AsyncStorage.setItem("buffer", stringifiedBuffer);

                resolve({
                    storageSuccessful: true,
                    storageURL: url
                });

            }catch(e){
                console.log(e);
                reject({
                    storageSuccessful: false,
                    storageURL: url
                })

            }

        })

    }

    //Store a request in secondary queue
    static storeRequestSecondaryQueue = (url: string, requestDetails): Promise<types.BufferStorageResponse>=>{
        return new Promise(async(resolve, reject)=>{

            try{

                const requestObject = {
                    url: url,
                    requestDetails: requestDetails
                }

                //Check if item already in storage
                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests = await JSON.parse(existingRequestsRaw);

                const existingRequestsSecondaryQueue = existingRequests.queue_2;

                const existingRequestsMapped = existingRequestsSecondaryQueue.filter((request)=>{

                    if(request["url"] === "/app/settings/update" && url === "/app/settings/update"){
                        return false
                    }else if (request["url"] === "/app/login" && url === "/app/login"){
                        return false
                    }else if(request["url"] === "/app/game/updateplays" && url === "/app/game/updateplays"){
                        return false
                    }
                    else {
                        return true
                    }
                });

                existingRequestsMapped.push(requestObject);

                existingRequests.queue_2 = existingRequestsMapped;

                const stringifiedBuffer = await JSON.stringify(existingRequests);

                await AsyncStorage.setItem("buffer", stringifiedBuffer);

                resolve({
                    storageSuccessful: true,
                    storageURL: url
                });

            }catch(e){
                console.log(e);
                reject({
                    storageSuccessful: false,
                    storageURL: url
                })

            }

        })

    };

    //Move requests from secondary queue to  first queue
    static transferQueues = (): Promise<void>=>{
        return new Promise(async(resolve, reject)=>{

            try{

                //Check if item already in storage
                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests = await JSON.parse(existingRequestsRaw);

                const existingRequestsPrimaryQueue = existingRequests.queue_1;

                const existingRequestsSecondaryQueue = existingRequests.queue_2;

                const existingRequestsPrimaryQueueMapped = existingRequestsPrimaryQueue.filter((primaryRequest)=>{

                    //If a login or update settings entry exists in secondary queue, then this replaces the primary queue version
                    for(let secondaryRequest of existingRequestsSecondaryQueue){
                        if(secondaryRequest["url"] === "/app/settings/update" && primaryRequest["url"] === "/app/settings/update"){
                            return false
                        }else if (secondaryRequest["url"] === "/app/login" && primaryRequest["url"] === "/app/login"){
                            return false
                        }else if(secondaryRequest["url"] === "/app/game/updateplays" && primaryRequest["url"] === "/app/game/updateplays"){
                            return false
                        }
                    }

                    //If login or updat settings does not exist in both queues, then no entry is removed.
                    return true
                    
                });

                //Push every entry from secondary queue onto primary queue
                for(let secondaryRequest of existingRequestsSecondaryQueue){

                    existingRequestsPrimaryQueueMapped.push(secondaryRequest);

                }

                //Finally replace queues in buffer object
                existingRequests.queue_1 = existingRequestsPrimaryQueueMapped;
                existingRequests.queue_2 = [];

                const stringifiedBuffer = await JSON.stringify(existingRequests);

                await AsyncStorage.setItem("buffer", stringifiedBuffer);

                resolve();

            }catch(e){
                console.log(e);
                reject()

            }

        })

    };

    static flushRequests = ():Promise<types.BufferFlushResponse>=>{
        return new Promise(async(resolve, reject)=>{

            const bufferResponse: types.BufferFlushResponse = {
                flushSuccessful: false
            }

            console.log("Flushing requests...")

            try{

                //Join both queues together 
                await this.transferQueues();

                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests = await JSON.parse(existingRequestsRaw);

                

                const existingRequestsMainQueue = existingRequests.queue_1; 

                const requestsLength = existingRequestsMainQueue.length;

                if(requestsLength === 0){

                    bufferResponse.flushSuccessful = true;
                    resolve(bufferResponse)
                } else if (requestsLength > 0){

                    //Loop through list FIFO basis.

                    for(let i = 0; i < requestsLength;  i++){

                        try{
                            const url = existingRequestsMainQueue[i]["url"];

                            console.log(url)

                            switch(url){
                                case "/app/login":
                                    
                                    const accountOperationDetails = existingRequestsMainQueue[i]["requestDetails"]
                                    await BackendAPI.sendLoggedInEvent(accountOperationDetails);
                                    break
                                case "/app/settings/update":
                                    const userSettings: types.UserSettings = existingRequestsMainQueue[i]["requestDetails"];
                                    await BackendAPI.sendSettingsInfo(userSettings);
                                    break
                                case "/app/entries/addentry":
                                    const addEntryObject: types.APIEntryObject = {
                                        updateType: "create",
                                        entryDetails: existingRequestsMainQueue[i]["requestDetails"]
                                    }
                                    await BackendAPI.sendEntryInfo(addEntryObject);
                                    break
                                case "/app/entries/updateentry":
                                    const updateEntryObject: types.APIEntryObject = {
                                        updateType: "update",
                                        entryDetails: existingRequestsMainQueue[i]["requestDetails"]
                                    }
                                    await BackendAPI.sendEntryInfo(updateEntryObject);
                                    break
                                case "/app/entries/deleteentry":
                                    const deleteEntryObject: types.APIEntryObject = {
                                        updateType: "remove",
                                        entryDetails: existingRequestsMainQueue[i]["requestDetails"]
                                    }
                                    await BackendAPI.sendEntryInfo(deleteEntryObject);
                                    break
                                case "/app/entries/newproject":
                                    const addProjectObject: types.APIProjectObject = {
                                        updateType: "create",
                                        projectDetails: existingRequestsMainQueue[i]["requestDetails"]
                                    }
                                    await BackendAPI.sendProjectInfo(addProjectObject);
                                    break

                                case "/app/entries/deleteproject":
                                    const deleteProjectObject: types.APIProjectObject = {
                                        updateType: "remove",
                                        projectDetails: existingRequestsMainQueue[i]["requestDetails"]
                                    }
                                    await BackendAPI.sendProjectInfo(deleteProjectObject);
                                    break
                                case "/app/game/updateplays":
                                    const updatePlaysObject = existingRequestsMainQueue[i]["requestDetails"]
                                    
                                    await BackendAPI.updatePlaysLeft(
                                        updatePlaysObject.userId,
                                        updatePlaysObject.playsLeft,
                                        updatePlaysObject.playsRefreshTime
                                    );
                                    break
                                default:
                                    break
                            }

                        }catch(APIresponseError){

                            //If there is an error, then we stop flushing
                            console.log("Error flushing buffer");
                            reject(APIresponseError);
                            return
                        }
                        
                    }

                    //Once queue is flushed, then we clear the queue storage

                    existingRequests.queue_1 = [];

                    const stringifiedBuffer = await JSON.stringify(existingRequests);

                    await AsyncStorage.setItem("buffer", stringifiedBuffer);

                    bufferResponse.flushSuccessful = true;
                    resolve(bufferResponse);
                };

                

            }catch(e){

                console.log(e, "Error flushing buffer");
                reject(bufferResponse);
            };
        })

    }
}

export default BufferManager;