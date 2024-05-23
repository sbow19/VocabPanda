/*
    eslint-disable
*/

import UserContent from "app/database/user_content";
import UserDetails from "app/database/user_profile_details";
import LocalDatabase from "app/database/local_database";
import * as types from '@customTypes/types.d'

class SyncManager {

    static processLoginSync = (userId: string, APILoginResponse: types.APIPostLoginSetUp): Promise<types.BufferSyncResult>=>{

        const loginSyncResult: types.BufferSyncResult = {
            deleteAccount: false,
            operationStatus: {
                userSettingsSync: false,
                premiumStatusSync: false,
                userContentSync: {
                    valid: false,
                    failedContent: [],
                    failedContentIndex: 0
                }
            }

        }
        
        return new Promise(async(resolve, reject)=>{

            //Delete user
            if(APILoginResponse.userDeleted.valid){

                try{
                    //Delete account
                    const deleteResponse = await UserDetails.deleteAccountBackend(userId);

                    if(deleteResponse.success){
                        //If account successfully deleted locally
                        loginSyncResult.deleteAccount = true;
                        resolve(loginSyncResult);
                        
                    }else if (!deleteResponse.success){
                        //Some error occured with deleing db locally
                        reject(loginSyncResult);
                        
                    }

                }catch(e){

                    //Local delete account didn't work
                    reject(loginSyncResult);

                }finally{
                    //Cancel syncing
                    return 
                }
            }

            //Set user settings
            try{

                await UserDetails.syncUserSettings(userId, APILoginResponse.userSettings);

                loginSyncResult.operationStatus.userSettingsSync = true;

            }catch(e){

                const syncUserSettingsResponse = e as types.LocalOperationResponse;
                console.log(syncUserSettingsResponse);
            
            }

            //Set premium status
            try{

                await UserDetails.syncPremiumStatus(userId, APILoginResponse.userPremiumStatus);
                loginSyncResult.operationStatus.premiumStatusSync = true;

            }catch(e){

                const syncUserPremiumStatusResponse = e as types.LocalOperationResponse;
                console.log(syncUserPremiumStatusResponse);
                
            }

            //Sync user content
            try{

                await UserContent.syncUserContent(userId, APILoginResponse.userContent);
                loginSyncResult.operationStatus.userContentSync.valid = true;


            }catch(e){

                loginSyncResult.operationStatus.userContentSync.failedContent = e.failedContent;
                loginSyncResult.operationStatus.userContentSync.failedContentIndex = e.failedContentIndex;
            }

            resolve(loginSyncResult);

        })


    }

}

export default SyncManager;