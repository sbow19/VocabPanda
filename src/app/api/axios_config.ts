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

        const urls = [
            "/account/createaccount",
            "/account/deleteaccount",
            "/account/updatepassword",
            "/generateapikey"
        ];

        //Check if additional details not there. Local sync request will have request id already appended
        if(urls.includes(config.url) && !requestData.deviceType && !requestData.requestId && !requestData.requestTimeStamp){

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

                            /* Buffer operations */
                            await BufferManager.flushRequests(axios.defaults.userId);

                            const localBufferOperation: types.LocalBufferOperation<Array<types.LocalSyncRequest<types.SyncBufferUserContent>>> = await BufferManager.wrapSyncRequest(axios.defaults.userId);
                           
                            const syncRequestDetails = localBufferOperation.customResponse;
                           
                            const syncLocalChangesRequest: types.LocalSyncRequestWrapper = {

                                requests: syncRequestDetails,
                                userId: axios.defaults.userId,
                                operationType: "sync request",
                                loginContents: null
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

                            return config
                            
                        case "/app/login":
                            const loginResult: types.LoginResult = config.data;

                            /* Buffer operations */
                            await BufferManager.flushRequests(axios.defaults.userId);

                            const localBufferOperation: types.LocalBufferOperation<Array<types.LocalSyncRequest<types.SyncBufferUserContent>>> = await BufferManager.wrapSyncRequest(axios.defaults.userId);
                            
                            const localSyncRequests = localBufferOperation.customResponse;

                            /*Login request wrapper */
                            const syncLoginRequest: types.LocalSyncRequestWrapper  = {

                                requests: localSyncRequests,
                                userId: axios.defaults.userId,
                                operationType: "login",
                                loginContents: loginResult
                            
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

                            return config
                            
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

    //Intercept FE sync result response here (including full sync requests) (phase 2)
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
                    config.data = requestDetails;
                    config.__responseWrapped = true;

                    try{

                        /* Save result response to sync queue to be deleted by acknowledgement*/
                        await BufferManager.storeResponseResponseQueue(axios.defaults.userId, requestDetails);

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
                const backendSyncResponse = backendResponse as types.BackendLocalSyncResult;

                /*Clear local request sync queue */
                try{
                    //Clear local sync request buffer
                    await BufferManager.clearWholeSyncQueue(axios.defaults.userId)

                }catch(e){

                    //Some error clearing buffer - TODO --> LOG
                    const bufferError = e as types.LocalBufferOperation;

                    //Continue with operations.

                }

                /* Process account deletion */
                try{

                    if(backendSyncResponse.userAccountDetails.userDeleted){

                        const deleteResult = await SyncManager.processAccountDeletion(backendSyncResponse);

                        await axios.post("/app/syncresult", deleteResult); //Send delete result to backend

                    }

                }catch(e){

                    const deleteResult = e as types.LocalBackendSyncResult
                    //Some error deleting account
                    if(e.deletedAccount){

                        await axios.post("/app/syncresult", deleteResult);

                    }else if (!e.deletedAccount){

                        await axios.post("/app/syncresult", deleteResult);

                    }

                }

                /* Process any buffer content sent to the front end*/
                try{
                    if(backendSyncResponse.partialSyncRequired){

                        const syncResult = await SyncManager.processSyncContent(backendSyncResponse);

                        syncResult.requestId = backendResponse.requestId; 
                        syncResult.syncType = "partial sync"

                        await axios.post("/app/syncresult", syncResult); //Send sync result to backend
                    }
                }catch(e){

                    //Some error syncing content or posting to backend
                    
                }

                /* Full syncs are dealt with in handling error responses from backend */
                                      
            }

            /* Periodic while app is open */
            if(backendResponse.syncType === "local changes"){

                //Status 200 response received re buffer syncing in back end. 
                const backendSyncResponse = backendResponse as types.BackendLocalSyncResult;

                /*Clear local request sync queue */
                try{
                    //Clear local sync request buffer
                    await BufferManager.clearSyncQueueItems(axios.defaults.userId, backendSyncResponse.requestIds)

                }catch(e){

                    //Some error clearing buffer - TODO --> LOG
                    const bufferError = e as types.LocalBufferOperation;

                    //Continue with operations.

                }

                /* Process account deletion */
                try{

                    if(backendSyncResponse.userAccountDetails.userDeleted){

                        const deleteResult = await SyncManager.processAccountDeletion(backendSyncResponse);

                        await axios.post("/app/syncresult", deleteResult); //Send delete result to backend

                    }

                }catch(e){

                    const deleteResult = e as types.LocalBackendSyncResult
                    //Some error deleting account
                    if(e.deletedAccount){

                        deleteResult.syncType = "account deletion"

                        await axios.post("/app/syncresult", deleteResult);

                    }else if (!e.deletedAccount){

                        deleteResult.syncType = "account deletion"

                        await axios.post("/app/syncresult", deleteResult);

                    }

                }

                /* Process any buffer content sent to the front end*/
                try{
                    if(backendSyncResponse.partialSyncRequired){

                        const syncResult = await SyncManager.processSyncContent(backendSyncResponse);

                        syncResult.requestId = backendResponse.requestId; 
                        syncResult.syncType = "partial sync"

                        await axios.post("/app/syncresult", syncResult); //Send sync result to backend
                    }
                }catch(e){

                    //Some error syncing content or posting to backend
                    
                }

                /* Full syncs are dealt with in handling error responses from backend */
                
            }
        },
        async (error)=>{
            //If there is a local sync error processing backend buffer, an error will be thrown here to start a total sync request
            if(!error.operationStatus.userContentSync.valid){

                const localSyncError = error as types.LocalBackendSyncResult;

                try{

                    localSyncError.syncType = "total sync";
                    
                    //Send sync request to backend. Await user content
                    await axios.post("/app/syncresult", localSyncError); 

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

                if(backendResponse.syncType === "local changes" || backendResponse.syncType === "login"){
                    //We determined that the backend error was related to processing a local sync request
                    const backendLocalChangesSyncResult = backendResponse as types.BackendLocalSyncResult;

                    //First we remove the original local sync request id(s) in sync buffer.
                    try{

                        await BufferManager.clearWholeSyncQueue(backendResponse.userId)

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

                                localSyncResult.requestId = backendResponse.requestId; // Assign request id to match full sync flag 
                                localSyncResult.syncType = "total sync"

                                //Send sync result to backend --> intercept sync result and save in buffer --> await ack flag
                                await axios.post("/app/syncresult", localSyncResult); //Request and response intercepted

                                //Full sync flag will stay raised in the backend until it receives a result response. It will send ack to frontend.


                            }catch(e){

                                //If total sync fails, then send failure flag. Backend will keep sending content to sync until total sync flag lowered
                                /*Carry on with application*/

                                const totalSyncError = e as types.LocalBackendSyncResult;

                                totalSyncError.requestId = backendResponse.requestId; // Assign request id to match full sync flag
                                localSyncResult.syncType = "total sync"

                                await axios.post("/app/syncresult", totalSyncError); //Request and response intercepted

                                return Promise.reject(totalSyncError);

                            }
    
                        case false:
                            //Where backend ingestion of local changes fails for reasons other than db conflict,
                            //Or error processing sync result, then persist sync request in storage Until next cycle

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
                    await BufferManager.clearIndividualResponse(backendBufferResponse.userId, backendBufferResponse.requestId);
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

                /* Needs to be a flags to ensure that local account operations are acknowledged locally. */
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