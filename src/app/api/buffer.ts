/*
    eslint-disable
*/

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as types from '@customTypes/types.d';
import uuid from 'react-native-uuid';
import UserDatabaseContext from "app/context/current_user_database";

class BufferManager {

    /* 
        - Content changes is stored in the main and secondary buffer.

        - When a user makes a local change, the user data is wrapper in an operation wrapper indicating whether the operation is an update, removal, add etc
        - User data always has a data type property associated with them too indicating if the data is an entry, project, settings etc. 
    */

    //Create buffer Storage
    static createBufferStorage = (): Promise<types.LocalBufferOperation>=>{
        return new Promise(async(resolve, reject)=>{

            const createBufferResponse: types.LocalBufferOperation = {
                success: false,
                operationType: "store",
                location: "all"
            }

            try{

                const requestStorage: types.BufferStorageObject = {
                    queue_1: {}, // Object stores user_id at key and buffer queue as property
                    queue_2: {}, // Store content updates spillover
                    sync_buffer: {}, //List of sync buffers by user
                };

                //Check if item already in storage
                const existingRequests = await AsyncStorage.getItem("buffer");

                if(existingRequests === null){
                    //If buffer object does not exist
                    
                    const bufferStorageString = await JSON.stringify(requestStorage);

                    await AsyncStorage.setItem("buffer", bufferStorageString);
                    console.log("Buffer storage created");

                    createBufferResponse.success = true;
                    resolve(createBufferResponse);

                }else if (existingRequests !== null){
                    //If buffer storage exists

                    createBufferResponse.success = true;
                    resolve(createBufferResponse);
                }

            }catch(e){
                //Some failure to create buffer storage


                createBufferResponse.error = e;
                console.log(e, "Create buffer storage error.");
                reject(createBufferResponse);
            }
        })
    } 

    static removeBufferStorage = (): Promise<types.LocalBufferOperation>=>{
        return new Promise(async(resolve, reject)=>{

            const deleteBufferResponse: types.LocalBufferOperation = {
                success: false,
                operationType: "remove",
                location: "all"
            }

            try{

                //Check if item already in storage
                await AsyncStorage.removeItem("buffer");

            }catch(e){
                //Some failure to create buffer storage


                deleteBufferResponse.error = e;
                console.log(e, "Create buffer storage error.");
                reject(deleteBufferResponse);
            }
        })
    } 

    //Store a request 
    static storeRequestMainQueue = (userId:string, requestDetails: types.UserData, operationType: types.OperationTypes): Promise<types.LocalBufferOperation>=>{
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

                const existingRequestsMapped = existingRequestsMainQueue.filter((operation: types.OperationWrapper)=>{

                    if(operation.userData.dataType === "settings" && requestDetails.dataType === "settings"){
                        return false
                    }else if (operation.userData.dataType === "login" && requestDetails.dataType === "login"){
                        return false
                    }else if(operation.userData.dataType === "plays" && requestDetails.dataType === "plays"){
                        return false
                    }
                    else {
                        return true
                    }
                });

                const operationWrapper: types.OperationWrapper = {
                    userData: requestDetails,
                    operationType: operationType,
                    dataType: requestDetails.dataType         
                }

                existingRequestsMapped.push(operationWrapper);

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
    static storeRequestSecondaryQueue = (userId:string, requestDetails: types.UserData, operationType: types.OperationTypes): Promise<types.LocalBufferOperation>=>{
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

                const existingRequestsMapped = existingRequestsSecondaryQueue.filter((operation: types.OperationWrapper)=>{

                    if(operation.userData.dataType === "settings" && requestDetails.dataType === "settings"){
                        return false
                    }else if (operation.userData.dataType === "login" && requestDetails.dataType === "login"){
                        return false
                    }else if(operation.userData.dataType === "plays" && requestDetails.dataType === "plays"){
                        return false
                    }
                    else {
                        return true
                    }
                });

                const operationWrapper: types.OperationWrapper = {
                    userData: requestDetails,
                    operationType: operationType                }

                existingRequestsMapped.push(operationWrapper);

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

            //This is queue which stores all outgoing content, wrapped up in a sync wrapper. Each outgoing content packet includes acknowledgements, results, and user content.

            const localBufferOperation: types.LocalBufferOperation<types.LocalSyncRequest<types.APIContentCallDetails>> = {
                location: "sync queue",
                operationType: "store",
                success: false,
                customResponse: requestDetails
            }

            try{

                //Check if item already in storage
                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests: types.BufferStorageObject = await JSON.parse(existingRequestsRaw);

                const existingRequestsSyncQueue = existingRequests.sync_buffer[userId];
               
                existingRequestsSyncQueue.syncQueue.push(requestDetails);

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

    static clearSyncQueueItem = (userId: string, requestId: string): Promise<types.LocalBufferOperation>=>{
        return new Promise(async(resolve, reject)=>{

            const localBufferOperation: types.LocalBufferOperation = {
                location: "sync queue",
                operationType: "remove",
                success: false
            }

            try{

                //Check if item already in storage
                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests: types.BufferStorageObject = await JSON.parse(existingRequestsRaw);

                const existingRequestsSyncQueue = existingRequests.sync_buffer[userId].syncQueue;
               
                const filteredQueue = existingRequestsSyncQueue.filter((request: types.LocalSyncRequest)=>{

                    if(request.requestId === requestId){
                        return false
                    }else{
                        return true
                    }
                })

                existingRequests.sync_buffer[userId].syncQueue = filteredQueue;

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

    static clearSyncQueueItems = (userId: string, requestIds: Array<string>): Promise<types.LocalBufferOperation>=>{
        return new Promise(async(resolve, reject)=>{

            const localBufferOperation: types.LocalBufferOperation = {
                location: "sync queue",
                operationType: "remove",
                success: false
            }

            try{

                //Check if item already in storage
                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests: types.BufferStorageObject = await JSON.parse(existingRequestsRaw);

                const existingRequestsSyncQueue = existingRequests.sync_buffer[userId].syncQueue;
               
                const filteredQueue = existingRequestsSyncQueue.filter((request: types.LocalSyncRequest)=>{

                    for(let requestId of requestIds){

                        if(request.requestId === requestId){
                            return false
                        }else{
                            return true
                        }

                    }
                    
                })

                existingRequests.sync_buffer[userId].syncQueue = filteredQueue;

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

    static clearWholeSyncQueue = (userId: string): Promise<types.LocalBufferOperation>=>{
        return new Promise(async(resolve, reject)=>{

            const localBufferOperation: types.LocalBufferOperation = {
                location: "sync queue",
                operationType: "remove",
                success: false
            }

            try{

                //Check if item already in storage
                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests: types.BufferStorageObject = await JSON.parse(existingRequestsRaw);

                existingRequests.sync_buffer[userId].syncQueue = [];
            
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

    static clearQueues = (userId: string): Promise<types.LocalBufferOperation>=>{
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

                const existingRequestsSyncQueue: types.LocalSyncContents = existingRequests.sync_buffer[userId];
            
                existingRequestsSyncQueue.contentQueue = [];
                existingRequestsSyncQueue.responseQueue = [];
                existingRequestsSyncQueue.acknowledgements = [];

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

                const existingRequests:types.BufferStorageObject = await JSON.parse(existingRequestsRaw);

                const existingRequestsSyncQueue = existingRequests.sync_buffer[userId].responseQueue;
               
                existingRequestsSyncQueue.push(requestDetails);

                existingRequests.sync_buffer[userId].responseQueue = existingRequestsSyncQueue;

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

    static clearResponses = (userId: string): Promise<types.LocalBufferOperation>=>{
        return new Promise(async(resolve, reject)=>{

            const localBufferOperation: types.LocalBufferOperation = {
                location: "response queue",
                operationType: "store",
                success: false,
            }

            try{

                //Check if item already in storage
                const existingResponsesRaw = await AsyncStorage.getItem("buffer");

                const existingResponses: types.BufferStorageObject = await JSON.parse(existingResponsesRaw);

                existingResponses.sync_buffer[userId].responseQueue = [];
               
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

    static clearIndividualResponse = (userId: string, requestId: string): Promise<types.LocalBufferOperation>=>{
        return new Promise(async(resolve, reject)=>{

            const localBufferOperation: types.LocalBufferOperation = {
                location: "response queue",
                operationType: "store",
                success: false,
            }

            try{

                //Check if item already in storage
                const existingResponsesRaw = await AsyncStorage.getItem("buffer");

                const existingResponses: types.BufferStorageObject = await JSON.parse(existingResponsesRaw);

                const existingResponsesUser = existingResponses.sync_buffer[userId].responseQueue;

                const existingResponsesUserFiltered = existingResponsesUser.filter((response: types.LocalBackendSyncResult)=>{

                    if(response.requestId === requestId){
                        return false
                    }else{
                        return true
                    }
                })

                existingResponses.sync_buffer[userId].responseQueue = existingResponsesUserFiltered;
               
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

                const existingRequestsAcksQueue = existingRequests.sync_buffer[userId].acknowledgements; //Acknowledgements queue for paritcular user

                existingRequestsAcksQueue.push(acknowledgement);

                existingRequests.sync_buffer[userId].acknowledgements = existingRequestsAcksQueue;

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

    static clearAcknowledgements = (userId:string): Promise<types.LocalBufferOperation>=>{
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

                existingRequests.sync_buffer[userId].acknowledgements = []; //Acknowledgements queue for paritcular user

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

    static clearIndividualAcknowledgement = (userId: string, requestId: string): Promise<types.LocalBufferOperation>=>{
        return new Promise(async(resolve, reject)=>{

            const localBufferOperation: types.LocalBufferOperation = {
                location: "response queue",
                operationType: "store",
                success: false,
            }

            try{

                //Check if item already in storage
                const existingResponsesRaw = await AsyncStorage.getItem("buffer");

                const existingResponses: types.BufferStorageObject = await JSON.parse(existingResponsesRaw);

                const existingResponsesUser = existingResponses.sync_buffer[userId].acknowledgements;

                const existingResponsesUserFiltered = existingResponsesUser.filter((response: types.LocalBackendSyncResult)=>{

                    if(response.requestId === requestId){
                        return false
                    }else{
                        return true
                    }
                })

                existingResponses.sync_buffer[userId].acknowledgements = existingResponsesUserFiltered;
               
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

                const existingRequestsPrimaryQueueMapped = existingRequestsPrimaryQueue.filter((primaryRequest: types.OperationWrapper)=>{

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

                //Join both main and secondary queues together 
                await this.transferQueues(userId);

                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests = await JSON.parse(existingRequestsRaw);

                //Get main queue and sync queue, and merge main queue with sync queue

                const existingRequestsMainQueue: Array<types.OperationWrapper | null> = existingRequests.queue_1[userId];

                const existingRequestsSyncQueue: types.SyncBufferContents= existingRequests.sync_buffer[userId]; 

                existingRequestsSyncQueue.contentQueue.push(...existingRequestsMainQueue);

                //Update the buffers and save
                existingRequests.queue_1[userId] = []; //Clear main queue
                existingRequests.sync_buffer[userId] = existingRequestsSyncQueue;

                const stringifiedBuffer = await JSON.stringify(existingRequests);
                await AsyncStorage.setItem("buffer", stringifiedBuffer);

                //Determine if any content needs to be synced. Array of sync requests returned
                const {customResponse} = await this.wrapSyncRequest(userId);

                if(customResponse.length === 0){
                    //No sync requests.

                    bufferResponse.success = true;
                    resolve(bufferResponse)
                }else if (customResponse.length > 0 ){
                    //Send sync request array to backend
                    await axios.post("/app/synclocalchanges", existingRequestsSyncQueue.syncQueue); //Array of change objects

                }                        

                

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
                existingRequests.sync_buffer[userId] = {
                    contentQueue: [],
                    responseQueue: [],
                    acknowledgements: [],
                    syncQueue: []
                };

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

    //Get content queue, responses queue, and acks queue, package into a sync request object, and save in sync queue. 
    static wrapSyncRequest = (userId: string): Promise<types.LocalBufferOperation<Array<types.LocalSyncRequest<types.SyncBufferUserContent>>>>=>{
        return new Promise(async(resolve, reject)=>{

            const retrieveBuffers: types.LocalBufferOperation<Array<types.LocalSyncRequest<types.SyncBufferUserContent>>> = {

                location: "all",
                operationType: "get",
                success: false                
            }

           try{

                const existingRequestsRaw = await AsyncStorage.getItem("buffer");

                const existingRequests: types.BufferStorageObject = await JSON.parse(existingRequestsRaw);

                const id = uuid.v4();

                //Create new local sync  request object
                const localSyncRequest: types.LocalSyncRequest<types.SyncBufferUserContent> ={
                    requestDetails: {
                        contentQueue: existingRequests.sync_buffer[userId].contentQueue,
                        acknowledgements: existingRequests.sync_buffer[userId].acknowledgements,
                        responseQueue: existingRequests.sync_buffer[userId].responseQueue,
                    },
                    requestId: id,
                    syncType: "local changes"
                };

                //Push new local sync request to sync queue and save buffer
                existingRequests.sync_buffer[userId].syncQueue.push(localSyncRequest);
                const stringifiedBuffer = await JSON.stringify(existingRequests);
                await AsyncStorage.setItem("buffer", stringifiedBuffer);

                //Clear all other queues
                await this.clearQueues(userId);

                //Add all local sync requests to response oibject
                retrieveBuffers.customResponse = existingRequests.sync_buffer[userId].syncQueue;
                retrieveBuffers.success = true;

                resolve(retrieveBuffers);

           }catch(e){

                retrieveBuffers.error = e;
                reject(retrieveBuffers);

           }

        })

    }

}

export default BufferManager;