/*
    eslint-disable
*/

import axios from 'axios';
import axiosRetry from 'axios-retry';
import BufferManager from './buffer';
import * as types from '@customTypes/types.d'
import uuid from 'react-native-uuid';

import SyncManager from './sync_manager';


const generateId = (): string =>{

    const id = uuid.v4();
    return id
}

const getTimeStamp = (): string =>{

    const date = new Date();
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

const axiosConfig = (bufferFlushingStatus: boolean)=>{
    // Set base URL if your API endpoints share a common base URL
    axios.defaults.baseURL = 'http://192.168.1.171:3000';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.bufferStatus = bufferFlushingStatus; //When buffers are being flushed, then any buffer info is added to the secondary queue
    axios.defaults.userId = "" //Set user id here so we don't have to kee passing it around


    //Set default timeout to 10 seconds
    axios.defaults.timeout = 10000;

    //Adding basic information to API call.
    axios.interceptors.request.use(
    async (config)=>{

        //Add "app" type operation type to request
        const requestData: types.APICallBase = config.data;

        //Check if additional details not there
        if(!requestData.deviceType && !requestData.requestId && !requestData.requestTimeStamp){

            requestData.deviceType = "app";
            requestData.requestId = uuid.v4();
            requestData.requestTimeStamp = new Date();

        }
        

        return config
                
    },
    (e)=>{
        //Store the request anyway
        console.error('Response Error:', e);
        return Promise.reject(e);

    });

    /* FE */
    /*
        phase 1: initial request
        phase 2: response to initial request, with result info
        phase 3: acknowledgement of response
    */

    //Intercept FE request for account changes (phase 1)
    axios.interceptors.request.use(
        async(config)=>{

            const urls = [
                "/account/createaccount",
                "/account/deleteaccount",
                "/account/updatepassword",
                "/generateapikey"
            ];

            if(urls.includes(config.url) && !axios.defaults.bufferStatus){
                //If the buffer is flushing, then create/delete/update password cannot be queued. Create account must occur while no buffer operations are taking place.

                return config
            } else if (urls.includes(config.url) && axios.defaults.bufferStatus){

                throw ""
            }

        },
        (error)=>{
            /*
            Changes to account details must occur in the backend, therefore any issues sending the request will 
            automatically cancel an account change locally

            Any issues with sending the request out will be handled here
            */

            console.log(error, "Account interceptor")
            return Promise.reject(error);
        }
    )

    //Intercept FE local login sync or local changes sync requests here (phase 1)
    axios.interceptors.request.use(
        async (config)=>{
            
            if(config.url === "/app/synclocalchanges" || config.url === "/app/login"){
                //Wrap request details in a request object. Return new config data

                //Test if login sync has already been wrapped.
                if(!config.__loginSyncWrapped){

                    switch(config.url){
                        case "/app/synclocalchanges":

                            const syncRequestDetails: types.LocalSyncContents = config.data;

                            const syncLocalChangesRequest: types.LocalSyncRequest<types.LocalSyncContents> = {

                                requestDetails: syncRequestDetails,
                                userId: syncRequestDetails.userId,
                                syncType: "local changes",
                                operationType: "sync request"
                            }

                             //Generate time stamp and request id
                             if(!config.data.requestId && !config.data.requestTimeStamp){
                                //If request id no already on object, then add here

                                const requestId = generateId();
                                const timeStamp = getTimeStamp();

                                syncLocalChangesRequest.deviceType = "app";
                                syncLocalChangesRequest.requestId = requestId;
                                syncLocalChangesRequest.requestTimeStamp = timeStamp;

                            }

                            //Assign API data call with wrapped request contents
                            config.data = syncLocalChangesRequest;
                            config.__loginSyncWrapped = true;

                            
                            //Save request in sync buffer storage with id 
                            try{
                                await BufferManager.storeRequestSyncQueue(syncRequestDetails.userId, syncLocalChangesRequest);

                                return config
                            }catch(e){

                                //Error with storing request in buffer
                                const bufferError = e as types.LocalBufferOperation;

                                //Cancel sync request with backend here
                                throw bufferError
                            }
                            
                        case "/app/login":
                            const loginRequestDetails: types.LoginResult = config.data;

                            const syncLoginRequest: types.LocalSyncRequest<types.LoginResult> = {

                                requestDetails: loginRequestDetails,
                                userId: loginRequestDetails.userId,
                                syncType: "login",
                                operationType: "sync request"
                            }

                             //Generate time stamp and request id
                            if(!config.data.requestId && !config.data.requestTimeStamp){
                                //If request id no already on object, then add here

                                const requestId = generateId();
                                const timeStamp = getTimeStamp();

                                syncLoginRequest.deviceType = "app";
                                syncLoginRequest.requestId = requestId;
                                syncLoginRequest.requestTimeStamp = timeStamp;

                            }

                            //Assign API data call with wrapped request contents
                            config.data = syncLoginRequest;
                            config.__loginSyncWrapped = true;

                            //Save request in sync buffer storage before sending to backend
                            try{
                                await BufferManager.storeRequestSyncQueue(syncLoginRequest.userId, syncLoginRequest);

                                return config

                            }catch(e){

                                //Error with storing request in buffer
                                const bufferError = e as types.LocalBufferOperation;

                                //Cancel sync request with backend here
                                throw bufferError
                                
                            }

                            
                    }

                }else{

                    //If not correct endpoint, then continue with request.

                    return config

                }
                

            }

        },
        (error)=>{
            //If some error occurs pre-flight with sync request, then we continue with the application and throw an error here
            //The queues will be attempted to be flushed on next flush cycle

            console.log(error, "interceptor")
            return Promise.reject(error);
        
        
        }
    );

    //Intercept FE request for total sync (phase 1)
    axios.interceptors.request.use(
        async (config)=>{
            
            if(config.url === "/app/fullsync"){
                //Wrap request details in a request object. Return new config data

                //Test if login sync has already been wrapped.
                if(!config.__totalSyncWrapped){
                    
                    const requestDetails: types.TotalSyncContents = config.data;

                     //Wrap request contents
                     const totalSyncRequest: types.LocalSyncRequest<types.TotalSyncContents> = {

                        requestDetails: requestDetails,
                        userId: requestDetails.userId,
                        syncType: "total sync",
                        operationType: "sync request"
                    };

                    //Generate time stamp and request id
                    if(!config.data.requestId && !config.data.requestTimeStamp){
                        //If request id no already on object, then add here

                        const requestId = generateId();
                        const timeStamp = getTimeStamp();

                        totalSyncRequest.deviceType = "app";
                        totalSyncRequest.requestId = requestId;
                        totalSyncRequest.requestTimeStamp = timeStamp;

                    }

                   

                    //Assign API data call with wrapped request contents
                    config.data = totalSyncRequest;
                    config.__loginSyncWrapped = true;

                    //Save request in sync buffer storage with id 
                    try{
                        await BufferManager.storeRequestSyncQueue(totalSyncRequest.userId, totalSyncRequest);

                        return config

                    }catch(e){

                        //Error with storing request in buffer
                        const bufferError = e as types.LocalBufferOperation;

                        //Cancel sync request with backend here
                        throw bufferError
                        
                    }

                }else{

                    //If not correct endpoint, then continue with request.

                    return config

                }
                

            }

        },
        (error)=>{
            //If some error occurs pre-flight, then we simply continue with the rest of the application
            //The queues will be attempted to be flushed on next triggering event
           
            //LOG ERROR FOR PRE FLIGHT TOTAL SYNC RESULT

            console.log(error, "interceptor")
            return Promise.reject(error);
        
        }
    );

    //Intercept FE sync result response here (phase 2)
    axios.interceptors.request.use(
        async(config)=>{

            
            if(config.url === "/app/syncresult"){

                //Test if login sync has already been wrapped.
                if(!config.__responseWrapped){


                    const requestDetails: types.LocalBackendSyncResult = config.data;
                    requestDetails.operationType = "sync result"
                    

                    if(!config.data.requestId && !config.data.requestTimeStamp){
                        //If request id no already on object, then add here

                        const requestId = generateId();
                        const timeStamp = getTimeStamp();

                        requestDetails.deviceType = "app"
                        requestDetails.requestId = requestId;
                        requestDetails.requestTimeStamp = timeStamp;

                    }
                
                    //Assign API data call with wrapped request contents
                    config.data = syncResultResponse;
                    config.__responseWrapped = true;

                    try{

                        /* Save result response to sync queue to be deleted by acknowledgement*/
                        await BufferManager.storeResponseResponseQueue(requestDetails.userId, requestDetails);

                        return config


                    }catch(e){

                        //Error with storing request in buffer
                        const bufferError = e as types.LocalBufferOperation;

                        //Cancel sync request with backend here
                        throw bufferError

                    }
                    
                }

            }else{

                //If not correct endpoint, then continue.
                return config

            }

    },
    (error)=>{
        //Possible buffer error. Don't send response, wait for next sync cycle triggered by backend.
        console.log(error, "interceptor")
        return Promise.reject(error);

    });

    //Intercept FE acknowledgements and save locally, until received by backend (phase 3)
    axios.interceptors.request.use(
        async (config)=>{

            let backendCall = config.data;

            if(backendCall.operationType === "acknowledgement"){
                //If acknowledgement...
                const backendAckCall = backendCall as types.FEAcknowledgement;

                try{
                    await BufferManager.storeRequestAckQueue(backendAckCall.userId, backendAckCall);
                }catch(e){
                    //If the storage fails, then return config anyway
                    console.log(e);
                }finally{
                    return config
                }
            }else {
                return config
            }
        
    });

   
    /* BE */

    //Intercept backend local sync result response, process backend buffer (phase 1). Occurs when sync cycle takes place or when user logs in
    axios.interceptors.response.use(
        async(config)=>{
            //Any status code within 2xx triggers this code
            let backendResponse: types.BackendLocalSyncResult= config.data;

            /* On login */
            if(backendResponse.syncType === "login"){

                //Status 200 response received re buffer syncing in back end. 
                const backendBufferResponse = backendResponse as types.BackendLocalSyncResult;

                if(backendBufferResponse.success){
                    //If the backend syncing result was a success

                    /* Clear sync queue corresponding with request id */
                    try{

                        await BufferManager.clearAllBufferQueues(backendResponse.userId); //At login, no more changes could possibly have occured

                        //Send acknowledgement of sync success to BE
                        const acknowledgement: types.FEAcknowledgement = {
                            requestId: backendBufferResponse.requestId,
                            userId: backendBufferResponse.userId,
                            operationType: "acknowledgement",
                            requestTimeStamp: backendBufferResponse.requestTimeStamp
                        }

                        await axios.post("/app/syncresult", acknowledgement);

                    }catch(e){

                        //Some error clearing buffer - TODO --> LOG
                        const bufferError = e as types.LocalBufferOperation;

                        //Continue with operations.

                    }

                    /* Process any buffer content sent to the front end*/
                    if(backendBufferResponse.syncContent){
                        
                        SyncManager.processSyncContent(backendBufferResponse)
                        .then(async(localSyncResult)=>{

                            /* If successfully processed, then send result response */
                            try{

                                //If result sent successfully, then wait for ack
                                await axios.post("/app/syncresult", localSyncResult);

                            }catch(e){
                                //If result failed to be sent for some reason, the continue with application until next flush

                            }
    
                        })
                        .catch((e)=>{

                            //If FE fails to process backend buffer, then we make a total sync request.
                            const localSyncError =  e as types.LocalBackendSyncResult;

                            //Throw error to error callback in this interceptor
                            throw localSyncError;

                        });   
                    }
                }
                
            }

            /* Periodic while app is open */
            if(backendResponse.syncType === "local changes"){

                //Status 200 response received re buffer syncing in back end. 
                const backendBufferResponse = backendResponse as types.BackendLocalSyncResult;

                if(backendBufferResponse.success){
                    //If the backend syncing result was a success

                    /* Clear sync queues, move secondary queues to main queue */
                    try{

                        await BufferManager.clearAllBufferQueues(backendResponse.userId); //At login, no more changes could possibly have occured

                        //Send acknowledgement of sync success to BE
                        const acknowledgement: types.FEAcknowledgement = {
                            requestId: backendBufferResponse.requestId, 
                            userId: backendBufferResponse.userId,
                            operationType: "acknowledgement",
                            requestTimeStamp: backendBufferResponse.requestTimeStamp
                        }

                        await axios.post("/app/syncresult", acknowledgement);

                    }catch(e){

                        //Some error clearing buffer - TODO --> LOG
                        const bufferError = e as types.LocalBufferOperation;

                        //Continue with operations.

                    }

                    /* Process any buffer content sent to the front end*/
                    if(backendBufferResponse.partialSyncRequired){
                        
                        SyncManager.processSyncContent(backendBufferResponse)
                        .then(async(localSyncResult)=>{

                            /* If successfully processed, then send result response */
                            try{

                                //If result sent successfully, then wait for ack
                                await axios.post("/app/syncresult", localSyncResult);

                            }catch(e){
                                //If result failed to be sent for some reason, the continue with application until next flush

                            }
    
                        })
                        .catch((e)=>{

                            //If FE fails to process backend buffer, then we make a total sync request.
                            const localSyncError =  e as types.LocalBackendSyncResult;

                            //Throw error to error callback in this interceptor
                            throw localSyncError;

                        });   
                    }
                }
                
            }
        },
        async (error)=>{
            //If there is a local sync error processing backend buffer, an error will be thrown here to start a total sync request
            if(!error.operationStatus.userContentSync.valid){

                const localSyncError = error as types.LocalBackendSyncResult;

                const totalSyncRequest: types.LocalSyncRequest<types.TotalSyncContents> = {
                    
                    syncType: "total sync",
                    requestDetails: {
                        errorMessage: error,
                        offendingRequestId: localSyncError.requestId,
                        userId: localSyncError.userId
                    }
                }

                try{
                    
                    //Send sync request to backend. Await user content
                    await axios.post("/app/fullsync", totalSyncRequest); 

                }catch(e){
                    //If some error here, then we carry on, as the request is saved in the sync request buffer
                    /* LOG ISSUE HERE */
                }
            }

            //Network and backend related errors after local sync request
            else if (axiosRetry.isNetworkOrIdempotentRequestError(error)){
                // If the error is a network error and all retries failed
                
                let backendRequest = error.request.data; 

                if(backendRequest.operationType === "sync request"){
                    //If the operation that failed was a request to update local changes in backend, then request stays in storage until next sync trigger
                    /* Code carries on until next trigger event */

                }
                
                
            }else if (error.response){
                //There was a response from the backend when processing the local changes, triggering a potential full sync.
                //A full sync might be triggered here if there was a total sync request inside the sync buffer, for example
                const backendResponse: types.BackendLocalSyncResult = error.response;

                if(backendResponse.syncType === "local changes"){
                    //We determined that the backend error was related to a local sync request

                    const backendLocalChangesSyncResult = backendResponse as types.BackendLocalSyncResult;

                    //First we remove the original login request id 
                    try{

                        await BufferManager.clearRequestSyncQueue(backendResponse.userId, backendLocalChangesSyncResult.requestId)

                    }catch(e){
                        //Carry on with code 

                    }
                    

                    switch(backendLocalChangesSyncResult.fullSyncRequired){

                        case true:
                            //Where backend ingestion of local changes fail due to db conflict, then full sync required
                            //DB contents already here 

                            //Backend will have fetched all user content to process in the frontend
                            try{

                                //Attempt to complete total sync --> send total sync result
                                const localSyncResult = await SyncManager.processTotalSyncContent(backendLocalChangesSyncResult.userId, backendLocalChangesSyncResult);

                                //Send sync result to backend --> intercept sync result and save in buffer --> await ack flag
                                await axios.post("/app/syncresult", localSyncResult); //Request and response intercepted


                            }catch(e){

                                //If total sync fails, then send failure flag. Backend will keep sending content to sync until total sync flag lowered
                                /*Carry on with application*/

                                const totalSyncError = e as types.LocalBackendSyncResult;

                                await axios.post("/app/syncresult", totalSyncError); //Request and response intercepted

                                return Promise.reject(totalSyncError);

                            }
    
                        case false:
                            //Where backend ingestion of local changes fails for reasons other than db conflict, then persist sync request in storage
                            //Until next cycle
    
                            return Promise.reject(null);
    
                    }


                }
                
            };
        }
    );

    //Intercept backend acknowledgement of result responses, and errors in sending result responss (phase 3)
    axios.interceptors.response.use(
    async(config)=>{

        //Backend received frontend result response, and sent acknowledgement. We remove the reponse from the buffer

        //Any status code within 2xx triggers this code
        let backendResponse = config.data;

        if(backendResponse.operationType = "acknowledgement"){

            //Status 200 response received re buffer syncing in back end. 
            const backendBufferResponse = backendResponse as types.BEAcknowledgement;

            if(backendBufferResponse.success){
                //If the acknowledgement was successful, then we remove the response buffer id from storage

                try{
                    //Remove the response from the buffer
                    await BufferManager.clearResponses(backendBufferResponse.userId, backendBufferResponse.requestId);
                }catch(e){
                    //Failure to remove response from buffer. UNKNOWN HOW TO HANDLE. SHOULD BE CLEARED ON NEXT FLUSH
                    /* Carry on with application */

                }
            }
        }

    },  
    (error)=>{

        //Unlikely for there to be an error in the backend related to sending a result response

        //Network 
        if (axiosRetry.isNetworkOrIdempotentRequestError(error)){
            // If the error is a network error and all retries failed
            
            let backendRequest: types.LocalBackendSyncResult = error.request.data; 

            if(backendRequest.operationType === "sync result"){
                //If sync rsult failed to send to backend, then request stays in storage until next sync trigger
                /* THIS IS IMPORTANT TO SEND AS TO LOWER TOTAL SYNC FLAG IN BACKEND */
                /* Code carries on until next trigger event */
            }

        } else if (error.response){
            //There was an error response from the backend 
            const backendResponse: types.BackendOperationResponse = error.response;

            if(backendResponse.operationType === "sync result"){
                //We determined that the backend error was related to processing a local sync result response

                const backendLocalChangesSyncResult = backendResponse as types.BackendLocalSyncResult;

                //Because there was some miscellaneous error, we continue with the operation, and kee response in storage
                //We expect an acknowledgement here, so clearly there is some error in processing the result in the backend
                /* THIS IS IMPORTANT TO SEND AS TO LOWER TOTAL SYNC FLAG IN BACKEND */
                //  LOG ERROR
            }
        }
    }
    );

    //Intercept backend account changes response
    axios.interceptors.response.use(
        async (config)=>{

            const accountOperationResponse: types.BackendOperationResponse = config.data;

            const accountOperationTypes = [
                "change password",
                "upgrade",
                "downgrade",
                "create account",
                "login"
            ]

            if(accountOperationTypes.includes(accountOperationResponse.operationType)){

                //If the change occured successfully, then we can continue with the local changes

                /*  Send acknowledgement once local changes have been completed*/
                //Send acknowledgement of sync success to BE
                const acknowledgement: types.FEAcknowledgement = {
                    requestId: accountOperationResponse.requestId,
                    userId: accountOperationResponse.userId,
                    operationType: "acknowledgement"
                }

                await axios.post("/account/acknowledgment", accountOperationResponse);
                
            }

        },
        (error)=>{


            const accountOperationTypes = [
                "change password",
                "upgrade",
                "downgrade",
                "create account",
                "login"
            ]

            if(error.response){
                //If there was an error response from the server, then the acconut details update failed
                let backendRequest = error.request.data;

                if(accountOperationTypes.includes(backendRequest.operationType)){

                    const accountOperationResponse: types.BackendOperationResponse = error.response.data;

                    return Promise.reject(accountOperationResponse);

                }
                 

            }//Network and backend related errors after local sync request
            else if (axiosRetry.isNetworkOrIdempotentRequestError(error)){
                // If the error is a network error and all retries failed
                
                let backendRequest = error.request.data; 

                if(accountOperationTypes.includes(backendRequest.operationType)){
                    //If the operation that failed was a request to update account in backend, then request stays in storage until next sync trigger
                    /* Code carries on until next trigger event */
                    /* There should not be a request in the first place... */

                }
                
                
            }

        }
    )     

    //Retry logic
    axiosRetry(axios, 
        { 
            retryDelay: axiosRetry.exponentialDelay,
            retries: 5,
            retryCondition: (error) => {
                console.log('Retry condition check:', error.message);
                //If buffer is flushing then we retry
                return axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error) || bufferFlushingStatus;
            },
            onMaxRetryTimesExceeded: (error)=>{
                //Handle network errors her
            }

        }
    )

};

export default axiosConfig;