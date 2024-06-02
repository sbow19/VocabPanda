/*
    eslint-disable
*/

import UserContent from "app/database/user_content";
import UserDetails from "app/database/user_profile_details";
import * as types from '@customTypes/types.d'

class SyncManager {

    static processAccountDeletion = (backendSyncResult: types.BackendLocalSyncResult): Promise<types.LocalBackendSyncResult>=>{
        return new Promise(async(resolve, reject)=>{

            const loginSyncResult: types.LocalBackendSyncResult = {
            deletedAccount: null,
            userSettingsSync: null,
            premiumStatusSync: null,
            userContentSync: {
                valid: null,
                failedContent: [],
                failedContentIndex: 0
            },

            requestId: backendSyncResult.requestId, 
            userId: backendSyncResult.userId,
            requestTimeStamp: backendSyncResult.requestTimeStamp,
            operationType: "sync result"
        }

            try{
                //Delete account
                const deleteResponse = await UserDetails.deleteAccountBackend(SyncResponse.userId);

                if(deleteResponse.success){
                    //If account successfully deleted locally
                    loginSyncResult.deletedAccount = true;
                    resolve(loginSyncResult);
                    
                }else if (!deleteResponse.success){
                    //Some error occured with deleing db locally
                    loginSyncResult.deletedAccount = false;
                    reject(loginSyncResult);
                    
                }

            }catch(e){

                loginSyncResult.deletedAccount = false;
                //Local delete account didn't work
                reject(loginSyncResult);

            }
        })
    }

    //Sync object received from backend after signing in 
    static processSyncContent = (SyncResponse: types.BackendLocalSyncResult): Promise<types.LocalBackendSyncResult>=>{

        const loginSyncResult: types.LocalBackendSyncResult = {
            deletedAccount: null,
            userSettingsSync: null,
            premiumStatusSync: null,
            userContentSync: {
                valid: null,
                failedContent: [],
                failedContentIndex: 0
            },

            requestId: SyncResponse.requestId, 
            userId: SyncResponse.userId,
            requestTimeStamp: SyncResponse.requestTimeStamp,
            operationType: "sync result"
        }
        
        return new Promise(async(resolve)=>{

            //Set user settings
            try{

                await UserDetails.syncUserSettings(SyncResponse.userId, SyncResponse.userAccountDetails.userSettings);

                loginSyncResult.userSettingsSync = true;

            }catch(e){

                const syncUserSettingsResponse = e as types.LocalOperationResponse;
                console.log(syncUserSettingsResponse);
                loginSyncResult.userSettingsSync = false;
            }

            //Set premium status
            try{

                await UserDetails.syncPremiumStatus(SyncResponse.userId, SyncResponse.userAccountDetails.userPremiumStatus);
                loginSyncResult.premiumStatusSync = true;

            }catch(e){

                const syncUserPremiumStatusResponse = e as types.LocalOperationResponse;
                console.log(syncUserPremiumStatusResponse);

                loginSyncResult.premiumStatusSync = false;
                
            }

            //Sync user content if content found
            if(SyncResponse.partialSyncRequired){

                try{

                    await UserContent.syncUserContent(SyncResponse.userId, SyncResponse.syncContent);
                    loginSyncResult.userContentSync.valid = true;
    
    
                }catch(e){
    
                    //If some content fails to update, then backend will be updated with failed pings. Syncing with backend will commence.
                    loginSyncResult.userContentSync.failedContent = e.failedContent;
                    loginSyncResult.userContentSync.failedContentIndex = e.failedContentIndex;
                    loginSyncResult.userContentSync.valid = false;
                }

            }

            resolve(loginSyncResult);

        })


    };

    //Process total sync content
    static processTotalSyncContent = (userId: string, backendResponse:types.BackendLocalSyncResult): Promise<types.LocalBackendSyncResult> =>{
        return new Promise(async(resolve, reject)=>{

            //MAKE SURE THAT WE ROLL BACK THE TRANSACTIONS IF THERE IS A FAILURE !!!
            const totalSyncResult: types.LocalBackendSyncResult = {
            
                deleteAccount: null, //Keep null
                userSettingsSync: null, //Keep null 
                premiumStatusSync: null, //Keep null
                userContentSync: {
                    valid: false,
                    failedContent: [],
                    failedContentIndex: 0
                },
                
                userId: userId, 
                requestId: backendResponse.requestId
            }

            //Sync user content
            try{

                //Attempt will be made to replace local data with data from backend
                await UserContent.syncBackendContent(userId, backendResponse.databaseContents);

                //If sync successful, then we resolve promise and notify backend of full sync result
                totalSyncResult.userContentSync.valid = true;
                resolve(totalSyncResult);


            }catch(e){

                //If some content fails to update, then backend will be updated with failed pings. Syncing with backend will commence.
                totalSyncResult.userContentSync.failedContent = e.failedContent;
                totalSyncResult.userContentSync.failedContentIndex = e.failedContentIndex;

                reject(totalSyncResult);
            }

        })
    }
}

export default SyncManager;