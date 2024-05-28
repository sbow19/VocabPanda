/*
    eslint-disable
*/

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as types from '@customTypes/types.d';

class BufferManager {

    /* 
        - Content changes is stored in the main and secondary buffer.

        - When a user makes a local change, the buffer is updated. The operation type is checked against the  data
        types of the data packets in the buffer, to ensure there are no duplicates of paricular data types.
    */

    //Create buffer Storage
    static createBufferStorage = ()=>{
        return new Promise(async(resolve, reject)=>{
            try{

                const requestStorage: types.BufferStorageObject = {
                    queue_1: {}, // Object stores user_id at key and buffer queue as property
                    queue_2: {},
                    sync_buffer: {}, //List of sync buffers by user
                    acknowledgements: {}, // List of acknowledgements by user
                    response_buffer: {} //List of response objects
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

    //Store a request 
    static storeRequestMainQueue = (userId:string, requestDetails: types.UserData, operationType: types.DataTypes): Promise<types.LocalBufferOperation>=>{
        return new Promise(async(resolve, reject)=>{

            const mainQueueOperation: types.LocalBufferOperation = {
                success: false,
                operationType: "store",
                location: "main queue"
            }

            try{

                //Check if item already in storage
                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests = await JSON.parse(existingRequestsRaw);

                const existingRequestsMainQueue = existingRequests.queue_1[userId]; //queue 1 for paritcular user

                const existingRequestsMapped = existingRequestsMainQueue.filter((operation: types.UserData)=>{

                    if(operation.dataType === "settings" && operationType === "settings"){
                        return false
                    }else if (operation.dataType === "login" && operationType === "login"){
                        return false
                    }else if(operation.dataType === "plays" && operationType === "plays"){
                        return false
                    }
                    else {
                        return true
                    }
                });

                existingRequestsMapped.push(requestDetails);

                existingRequests.queue_1[userId] = existingRequestsMapped;

                const stringifiedBuffer = await JSON.stringify(existingRequests);

                await AsyncStorage.setItem("buffer", stringifiedBuffer);

                //Assuming the storage of the change object in the main queue was successful...
                mainQueueOperation.success = true;

                resolve(mainQueueOperation);

            }catch(e){
                console.log(e);
                mainQueueOperation.error = e;
                reject(mainQueueOperation);

            }

        })

    }


    static clearMainQueue = (userId: string): Promise<types.LocalBufferOperation>=>{
        return new Promise(async(resolve, reject)=>{

            const clearMainQueueResponse: types.LocalBufferOperation = {
                location: "main queue",
                operationType: "remove",
                success: false
            };

            try{

                //Check if item already in storage
                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests = await JSON.parse(existingRequestsRaw);

                existingRequests.queue_1[userId] = []; //Set main queue to empty array

                const stringifiedBuffer = await JSON.stringify(existingRequests);

                await AsyncStorage.setItem("buffer", stringifiedBuffer);

                clearMainQueueResponse.success = true;
                resolve(clearMainQueueResponse);

            }catch(e){

                reject(clearMainQueueResponse);

            }

        })
    }

    //Store a request in secondary queue
    static storeRequestSecondaryQueue = (userId:string, requestDetails: types.UserData, operationType: types.DataTypes): Promise<types.LocalBufferOperation>=>{
        return new Promise(async(resolve, reject)=>{

            const secondaryQueueOperation: types.LocalBufferOperation = {
                success: false,
                operationType: "store",
                location: "secondary queue"
            }

            try{

                //Check if item already in storage
                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests = await JSON.parse(existingRequestsRaw);

                const existingRequestsSecondaryQueue = existingRequests.queue_2[userId];

                const existingRequestsMapped = existingRequestsSecondaryQueue.filter((operation: types.UserData)=>{

                    if(operation.dataType === "settings" && operationType === "settings"){
                        return false
                    }else if (operation.dataType === "login" && operationType === "login"){
                        return false
                    }else if(operation.dataType === "plays" && operationType === "plays"){
                        return false
                    }
                    else {
                        return true
                    }
                });

                existingRequestsMapped.push(requestDetails);

                existingRequests.queue_2[userId] = existingRequestsMapped;

                const stringifiedBuffer = await JSON.stringify(existingRequests);

                await AsyncStorage.setItem("buffer", stringifiedBuffer);

                //Assuming the storage of the change object in the secondary queue was successful...
                secondaryQueueOperation.success = true;

                resolve(secondaryQueueOperation);

            }catch(e){
                console.log(e);
                secondaryQueueOperation.error = e;
                reject(secondaryQueueOperation);

            }

        })

    };

    //Sync queue operations
    static storeRequestSyncQueue = (userId: string, requestDetails: types.LocalSyncRequest<types.APIContentCallDetails>): Promise<types.LocalBufferOperation<types.LocalSyncRequest<types.APIContentCallDetails>>>=>{
        return new Promise(async(resolve, reject)=>{

            const localBufferOperation: types.LocalBufferOperation<types.LocalSyncRequest<types.APIContentCallDetails>> = {
                location: "sync queue",
                operationType: "store",
                success: false,
                customResponse: requestDetails
            }

            try{

                //Check if item already in storage
                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests = await JSON.parse(existingRequestsRaw);

                const existingRequestsSyncQueue = existingRequests.sync_buffer[userId];
               
                existingRequestsSyncQueue.push(requestDetails);

                existingRequests.sync_buffer[userId] = existingRequestsSyncQueue;

                const stringifiedBuffer = await JSON.stringify(existingRequests);

                await AsyncStorage.setItem("buffer", stringifiedBuffer);

                localBufferOperation.success =  true;

                resolve(localBufferOperation);

            }catch(e){
                console.log(e);
                reject(localBufferOperation)
            }

        })

    };

    static clearRequestSyncQueue = (userId: string, requestId: string): Promise<types.LocalBufferOperation>=>{
        return new Promise(async(resolve, reject)=>{

            const localBufferOperation: types.LocalBufferOperation = {
                location: "sync queue",
                operationType: "remove",
                success: false
            }

            try{

                //Check if item already in storage
                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests = await JSON.parse(existingRequestsRaw);

                const existingRequestsSyncQueue = existingRequests.sync_buffer[userId];
               
                const filteredQueue = existingRequestsSyncQueue.filter((request: types.LocalSyncRequest)=>{

                    if(request.requestId === requestId){
                        return false
                    }else{
                        return true
                    }
                })

                existingRequests.sync_buffer[userId] = filteredQueue;

                const stringifiedBuffer = await JSON.stringify(existingRequests);

                await AsyncStorage.setItem("buffer", stringifiedBuffer);

                localBufferOperation.success =  true;

                resolve(localBufferOperation);

            }catch(e){
                console.log(e);
                reject(localBufferOperation)
            }

        })

    };

    
    //Store responses to be in response_buffer
    static storeResponseResponseQueue = (userId: string, requestDetails: types.LocalBackendSyncResult): Promise<types.LocalBufferOperation<types.LocalBackendSyncResult>>=>{
        return new Promise(async(resolve, reject)=>{

            const localBufferOperation: types.LocalBufferOperation<types.LocalBackendSyncResult> = {
                location: "response queue",
                operationType: "store",
                success: false,
                customResponse: requestDetails
            }

            try{

                //Check if item already in storage
                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests = await JSON.parse(existingRequestsRaw);

                const existingRequestsSyncQueue = existingRequests.response_buffer[userId];
               
                existingRequestsSyncQueue.push(requestDetails);

                existingRequests.response_buffer[userId] = existingRequestsSyncQueue;

                const stringifiedBuffer = await JSON.stringify(existingRequests);

                await AsyncStorage.setItem("buffer", stringifiedBuffer);

                localBufferOperation.success =  true;

                resolve(localBufferOperation);

            }catch(e){
                console.log(e);
                reject(localBufferOperation)
            }

        })

    };

    static clearResponses = (userId: string, requestId: string): Promise<types.LocalBufferOperation>=>{
        return new Promise(async(resolve, reject)=>{

            const localBufferOperation: types.LocalBufferOperation = {
                location: "response queue",
                operationType: "store",
                success: false,
            }

            try{

                //Check if item already in storage
                const existingResponsesRaw = await AsyncStorage.getItem("buffer");

                const existingResponses = await JSON.parse(existingResponsesRaw);

                const existingResponsesSyncQueue = existingResponses.response_buffer[userId];
               
                const filteredQueue = existingResponsesSyncQueue.filter((response: types.LocalBackendSyncResult)=>{

                    if(response.requestId === requestId){
                        return false
                    }else{
                        return true
                    }
                })

                existingResponses.response_buffer[userId] = filteredQueue;

                const stringifiedBuffer = await JSON.stringify(existingResponses);

                await AsyncStorage.setItem("buffer", stringifiedBuffer);

                localBufferOperation.success =  true;

                resolve(localBufferOperation);

            }catch(e){
                console.log(e);
                reject(localBufferOperation)
            }

        })

    };


    //Store acknowledgements in ack queue
    static storeRequestAckQueue = (userId:string, acknowledgement: types.FEAcknowledgement): Promise<types.LocalBufferOperation>=>{
        return new Promise(async(resolve, reject)=>{

            const storeAckResponse: types.LocalBufferOperation = {

                success: false,
                operationType: "store",
                location: "acknowledgement queue"
            }

            try{

                //Check if item already in storage
                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests: types.BufferStorageObject = await JSON.parse(existingRequestsRaw);

                const existingRequestsAcksQueue = existingRequests.acknowledgements[userId]; //Acknowledgements queue for paritcular user

                existingRequestsAcksQueue.push(acknowledgement);

                existingRequests.acknowledgements[userId] = existingRequestsAcksQueue;

                const stringifiedBuffer = await JSON.stringify(existingRequests);

                await AsyncStorage.setItem("buffer", stringifiedBuffer);

                storeAckResponse.success = true;

                resolve(storeAckResponse);

            }catch(e){
                console.log(e);
                reject(storeAckResponse);

            }

        })

    }

    static clearAcknowledgement = (userId:string, acknowledgementId: string): Promise<types.LocalBufferOperation>=>{
        return new Promise(async(resolve, reject)=>{

            const removeAckResponse: types.LocalBufferOperation = {

                success: false,
                operationType: "remove",
                location: "acknowledgement queue"
            }

            try{

                //Check if item already in storage
                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests: types.BufferStorageObject = await JSON.parse(existingRequestsRaw);

                const existingRequestsAcksQueue = existingRequests.acknowledgements[userId]; //Acknowledgements queue for paritcular user

                const existingRequestsAcksQueueMapped = existingRequestsAcksQueue.filter((localRequest:types.FEAcknowledgement)=>{

                    if(localRequest.requestId === acknowledgementId){

                        return false

                    }else{
                        return true
                    }
                })

                existingRequests.acknowledgements[userId] = existingRequestsAcksQueueMapped;

                const stringifiedBuffer = await JSON.stringify(existingRequests);

                await AsyncStorage.setItem("buffer", stringifiedBuffer);

                removeAckResponse.success = true;

                resolve(removeAckResponse);

            }catch(e){
                console.log(e);
                reject(removeAckResponse);

            }

        })

    }

    //Move requests from secondary queue to  first queue
    static transferQueues = (userId: string): Promise<types.LocalBufferOperation>=>{
        return new Promise(async(resolve, reject)=>{
            
            const transferQueueResponse: types.LocalBufferOperation = {
                success: false,
                operationType: "transfer",
                location: "main queue"
            }

            try{

                const existingRequestsRaw = await AsyncStorage.getItem("buffer"); //Fetch buffer from storage

                const existingRequests = await JSON.parse(existingRequestsRaw); //Parse buffer

                const existingRequestsPrimaryQueue = existingRequests.queue_1[userId]; //Get main queue array

                const existingRequestsSecondaryQueue = existingRequests.queue_2[userId]; //Get secondary queue array

                const existingRequestsPrimaryQueueMapped = existingRequestsPrimaryQueue.filter((primaryRequest: types.UserData)=>{

                    const primaryRequestOperation = primaryRequest.dataType;

                    //If a login or update settings entry exists in secondary queue, then this replaces the primary queue version
                    for(let secondaryRequest of existingRequestsSecondaryQueue){

                        const secondaryRequestOperation = secondaryRequest.dataType as types.DataTypes;

                        if(secondaryRequestOperation === "settings" && primaryRequestOperation === "settings"){
                            return false
                        }else if (secondaryRequestOperation === "login" && primaryRequestOperation === "login"){
                            return false
                        }else if(secondaryRequestOperation === "plays" && primaryRequestOperation === "plays"){
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
                existingRequests.queue_1[userId] = existingRequestsPrimaryQueueMapped;
                existingRequests.queue_2[userId] = [];

                const stringifiedBuffer = await JSON.stringify(existingRequests);

                await AsyncStorage.setItem("buffer", stringifiedBuffer);


                //Assuming operation ran smoothly
                transferQueueResponse.success = true;

                resolve(transferQueueResponse);

            }catch(e){
                console.log(e);

                transferQueueResponse.error = e;
                reject(transferQueueResponse)

            }

        })

    };

    //Flush all buffer requests
    static flushRequests = (userId: string):Promise<types.LocalBufferOperation>=>{
        return new Promise(async(resolve, reject)=>{

            const bufferResponse: types.LocalBufferOperation = {
                success: false,
                operationType: "flush"
            }

            console.log("Flushing requests...")

            try{

                //Join both queues together 
                await this.transferQueues(userId);

                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests = await JSON.parse(existingRequestsRaw);

                /*
                    Main queue includes:
                     -Changes to projects, entries, and tags
                     -User settings changes
                     -Plays left updates

                */
                const existingRequestsMainQueue: Array<types.UserData | null> = existingRequests.queue_1[userId]; 

                const requestsLength = existingRequestsMainQueue.length;

                if(requestsLength === 0){

                    //No information in the buffer to send to backend
                    bufferResponse.success = true;
                    resolve(bufferResponse)
                } else if (requestsLength > 0){

                    try{

                        //Make local requests to backend
                        await axios.post("/app/synclocalchanges", existingRequestsMainQueue); //Array of change objects


                    }catch(e){
                        //Some error with syncing to backend. Sync request is saved in sync buffer
                        /* Carry on with application */

                        reject(bufferResponse);
                    }

                    //Main queue is cleared, regardless of the result of sending the sync request
                    try{
                        this.clearMainQueue(userId);
                    }catch(e){
                        //Some error clearing buffer
                        throw e;
                    }
                        

                    
                };

            }catch(e){

                console.log(e, "Error flushing buffer");
                reject(bufferResponse);
            };
        })

    };



    //Add new user to buffers
    static addNewUser = (userId: string): Promise<types.LocalBufferOperation> =>{
        return new Promise(async(resolve, reject)=>{

            const bufferResponse: types.LocalBufferOperation = {
                success: false,
                operationType: "store",
                location: "all"
            }

            try{
                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests: types.BufferStorageObject = await JSON.parse(existingRequestsRaw);

                existingRequests.queue_1[userId] = [];
                existingRequests.queue_2[userId] = [];
                existingRequests.sync_buffer[userId] = [];
                existingRequests.response_buffer[userId] = [];
                existingRequests.acknowledgements[userId] = [];

                const stringifiedBuffer = await JSON.stringify(existingRequests);

                await AsyncStorage.setItem("buffer", stringifiedBuffer);

                bufferResponse.success = true;

                resolve(bufferResponse);

            }catch(e){

                bufferResponse.error = e;

                reject(bufferResponse);

            }

        })
    }


    //Delete user from buffers
    static deleteUser = (userId: string): Promise<types.LocalBufferOperation> =>{
        return new Promise(async (resolve, reject)=>{

            const bufferResponse: types.LocalBufferOperation = {
                success: false,
                operationType: "remove",
                location: "all"
            }

            try{
                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests: types.BufferStorageObject = await JSON.parse(existingRequestsRaw);

                delete existingRequests.queue_1[userId];
                delete existingRequests.queue_2[userId];
                delete existingRequests.sync_buffer[userId];
                delete existingRequests.response_buffer[userId];
                delete existingRequests.acknowledgements[userId];

                const stringifiedBuffer = await JSON.stringify(existingRequests);

                await AsyncStorage.setItem("buffer", stringifiedBuffer);


                bufferResponse.success = true;

                resolve(bufferResponse);

            }catch(e){

                bufferResponse.error = e;
                reject(bufferResponse);

            }

        })
    }


    //Get main queue, sync results queue, results queue, acknowledgements queue. Pull together to sync object and sen
    //Check sync buffer
    static retrieveBuffers = (userId: string): Promise<types.LocalBufferOperation<types.BufferStorageObject>>=>{
        return new Promise(async(resolve, reject)=>{

            const retrieveBuffers: types.LocalBufferOperation<types.BufferStorageObject> = {

                location: "all",
                operationType: "get",
                success: false                
            }

           try{

                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests: types.BufferStorageObject = await JSON.parse(existingRequestsRaw);

                retrieveBuffers.customResponse.queue_1 = existingRequests.queue_1[userId];
                retrieveBuffers.customResponse.sync_buffer = existingRequests.sync_buffer[userId];  
                retrieveBuffers.customResponse.response_buffer = existingRequests.response_buffer[userId];
                retrieveBuffers.customResponse.acknowledgements = existingRequests.acknowledgements[userId];

                retrieveBuffers.success = true;

                resolve(retrieveBuffers);

           }catch(e){

                retrieveBuffers.error = e;
                reject(retrieveBuffers);

           }

        })

    }

    //Clear all buffers

    static clearAllBufferQueues = (userId: string): Promise<types.LocalBufferOperation>=>{
        return new Promise(async(resolve, reject)=>{

            const clearBuffers: types.LocalBufferOperation = {

                location: "all",
                operationType: "remove",
                success: false                
            }

           try{

                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests: types.BufferStorageObject = await JSON.parse(existingRequestsRaw);

                existingRequests.queue_1[userId] = [];
                existingRequests.sync_buffer[userId] = [];
                existingRequests.response_buffer[userId] = [];
                existingRequests.acknowledgements[userId] = [];


                clearBuffers.success = true;

                resolve(clearBuffers);

           }catch(e){

                clearBuffers.error = e;
                reject(clearBuffers);

           }

        })

    }



}

export default BufferManager;