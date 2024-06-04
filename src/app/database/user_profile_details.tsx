/* eslint-disable */

import * as types from '@customTypes/types.d'
import LocalDatabase from "app/database/local_database";
import SQLStatements from "app/database/prepared_statements";
import BufferManager from 'app/api/buffer';
import UserContent from "app/database/user_content"

class UserDetails extends LocalDatabase{

    //Login events

    static signIn = (user:string, password:string):Promise<types.LoginResult>=>{
        return new Promise(async(resolve, reject)=>{

            const resultObject: types.LoginResult = {
                
                loginSuccess: false,
                username: "",
                identifierType: "",
                password: "",
                userId: ""
            };

            try{
                //Try completing login with username

                const resultArrayRawUser = await super.transactionPromiseWrapper(SQLStatements.generalStatements.getUserLoginByUsername, [user], "User logins fetched");

                const resultArrayUsername = super.parseRowResults(resultArrayRawUser);

                if(resultArrayUsername.length === 0){
                    //If username  or email does not match any entries, then try comparing with emails
                
                }else if(resultArrayUsername.length === 1){
                    //If username matches one user, then attempt password match
                    const userPassword = resultArrayUsername[0].password_hash;

                    if(userPassword === password){
                        resultObject.loginSuccess = true
                        resultObject.username = resultArrayUsername[0].username
                        resultObject.userId = resultArrayUsername[0].id
                        resolve(resultObject);
                        return // Break from event loop here
                    }
                }   

                const resultArrayRawEmail = await super.transactionPromiseWrapper(SQLStatements.generalStatements.getUserLoginByEmail, [user], "User emails fetched");
        
                const resultArrayEmail = super.parseRowResults(resultArrayRawEmail);

                if(resultArrayEmail.length === 0){
                    //If username  or email does not match any entries, then login failed
                    resolve(resultObject)
                
                }else if(resultArrayEmail.length === 1){
                    //If Email matches one user, then attempt password match
                    const userPassword = resultArrayEmail[0].password_hash;

                    if(userPassword === password){
                        resultObject.loginSuccess = true
                        resultObject.username = resultArrayEmail[0].username
                        resultObject.userId = resultArrayEmail[0].id
                        resolve(resultObject);
                    }
                }
            
            }catch(e){
                //Some error occured while signing in
                resultObject.error = e;
                reject(resultObject);

            }
        })
    };

    static getLastLoggedIn = (userId: string): Promise<string | null> =>{
        return new Promise(async(resolve, reject)=>{
            try{

                const resultArrayRaw = await super.transactionPromiseWrapper(SQLStatements.generalStatements.getLastLoggedIn, [
                    userId
                ], "fetch last logged in");


                if(resultArrayRaw.rowsAffected === 0){
                    //Failure to identify user, throws error
                    reject(null);
                    return
                }
                    

                const resultArray = super.parseRowResults(resultArrayRaw);

                if(resultArray.length === 0){
                    console.log("Error: no last logged in data found");

                    resolve(null)
                    
                } else if(resultArray.length === 1){

                    const lastLoggedInTime: string = resultArray[0]["last_logged_in"];

                    resolve(lastLoggedInTime);
                }

            }catch(e){
                reject(e);
            }
        })
    };

    static getLastActivity = (userId: string): Promise<Array<null | types.EntryDetails>>=>{

        return new Promise(async(resolve, reject)=>{

            //Get last logged in time
            const lastLoggedInTime = await this.getLastLoggedIn(userId);

            //start transaction, returns array  of user entries entered since last logged in time.

            try{
                const resultArrayRaw = await super.transactionPromiseWrapper(SQLStatements.generalStatements.getLastActivity, [
                    lastLoggedInTime, 
                    userId
                ],
                "Fetched last activity");


                const resultArray: Array<types.SQLDBResult<types.SQLUserEntries> | null> = this.parseRowResults(resultArrayRaw); //Returns empty array or list of entries

                if(resultArray.length === 0){
                    resolve([])
                }else if(resultArray.length > 0){

                    const convertedResultArray = resultArray.map((storedEntry: types.SQLUserEntries)=>{

                        const convertedEntry = UserContent.convertSQLEntry(storedEntry);
                        convertedEntry.dataType = "entry";
                        return convertedEntry
    
                    })
                    resolve(convertedResultArray);

                }
               

            }catch(e){
                console.log("Error fetching last activity data");
                reject(e);
            }
                    
        })

    };
    
    static getDefaultAppSettings(userId: string): Promise<types.AppSettingsObject>{
        return new Promise(async(resolve, reject)=>{

            const defaultAppSettings: types.AppSettingsObject = {};

            try{
                //Get user settings
                const userSettings = await this.getUserSettings(userId);

                defaultAppSettings.userSettings = userSettings;
                   

                //Get user projects
                defaultAppSettings.projects = await this.getUserProjects(userId);
            
                //Get last logged in
                defaultAppSettings.lastLoggedIn = await this.getLastLoggedIn(userId);

                //get premium
                defaultAppSettings.premium.premium= await this.checkPremiumStatus(userId);

                //Get plays left
                defaultAppSettings.playsLeft = await this.getPlaysLeft(userId);

                //Get playsr efresh time left
                defaultAppSettings.playsRefreshTime = await UserDetails.getPlaysRefreshTimeLeft(userId);

            
                //Get translations left
                defaultAppSettings.translationsLeft = await this.getTranslationsLeft(userId);

                //Get translations refresh time left
                defaultAppSettings.translationsRefreshTime = await UserDetails.getTranslationsRefreshTimeLeft(userId);

                resolve(defaultAppSettings);

            }catch(e){

                console.trace();
                console.log(e);
                reject(e);

            }

        })
    };

    static getUserSettings = (userId: string): Promise<types.UserSettings>=>{
        return new Promise(async(resolve, reject)=>{


            try{
                //Start transaction --
                const resultArrayRawSettings = await super.transactionPromiseWrapper(SQLStatements.generalStatements.getAppSettings, [
                    userId
                ], "User settings fetched");

                if(resultArrayRawSettings.rowsAffected === 0){
                    //Failure to identify user, throws error
                    reject(null);
                    return
                }


                const resultArraySettings: Array<types.SQLDBResult<types.SQLUserSettings> | null> = super.parseRowResults(resultArrayRawSettings);

                if(resultArraySettings.length === 0){

                    //There should be a user in the db. This triggers an error.
                    reject("Error: no user settings found")

                }else if (resultArraySettings.length === 1){

                    const rawUserSettings: types.SQLDBResult<types.SQLUserSettings> = resultArraySettings[0];

                    const userSettings: types.UserSettings = {

                        gameTimerOn: rawUserSettings.timer_on,
                        gameNoOfTurns: rawUserSettings.slider_val,
                        defaultTargetLanguage: rawUserSettings.target_lang,
                        defaultOutputLanguage: rawUserSettings.output_lang,
                        defaultProject: rawUserSettings.default_project,
                        dataType: "settings"

                    }

                    //Return user settings
                    resolve(userSettings);

                }

            }catch(e){

                console.trace();
                console.log(e);
                reject(e);

            }

        })
    };

    static getUserProjects = (userId: string): Promise<Array<types.ProjectDetails | null>>=>{
        return new Promise(async(resolve, reject)=>{

            try{
                
                const resultArrayRawProjects = await super.transactionPromiseWrapper(SQLStatements.generalStatements.getAllProjects, [
                    userId
                ],
                "User projects fetched");

                if(resultArrayRawProjects.rowsAffected === 0){
                    //Failure to identify user, throws error
                    reject(null);
                    return
                }

                const resultArrayProjects: Array<types.SQLDBResult<types.SQLUserProjects> | null> = super.parseRowResults(resultArrayRawProjects);

                if(resultArrayProjects.length === 0){

                    console.log("Error: no projects found");

                    resolve([]); //No projects assigned to user

                }else if (resultArrayProjects.length >= 1){

                    const projectArray: Array<types.ProjectDetails> = [];

                    //Cycle through projects identified in projects table and add details to app setting object.
                    for(let project of resultArrayProjects){

                        let projectObject: types.ProjectDetails = {
                            projectName: project.project,
                            targetLanguage: project.target_lang,
                            outputLanguage: project.output_lang,
                            dataType: "project"
                        };

                        projectArray.push(projectObject);

                    };

                    resolve(projectArray); 
                }
               

            }catch(e){

                console.trace();
                console.log(e);
                reject(e);

            }

        })
    };

    static updateUserLoginTime(username: string){
        return new Promise(async(resolve, reject)=>{

            //Get new db transaction, and update time in database.

            try{
                //get user ID 

                const userId = await super.getUserId(username);

                //Get user id
                await super.transactionPromiseWrapper(SQLStatements.updateStatements.updateLastLoggedIn, [
                    userId
                ]
                , "User login time updated ");

                resolve(null)
                
            } catch(e){
                console.log("Could not update last logged in time;")
                console.log(e);
                console.trace();
                reject(e);
            }
        })
    };



    //Creating or updating user details events
      
    static createNewUser = (
        email:string, 
        username:string, 
        password: string,
        id: string
    ): Promise<types.LocalOperationResponse>=>{

        return new Promise(async(resolve, reject)=>{

            const createNewUser: types.LocalOperationResponse = {
                success: false,
                message: "operation unsuccessful"
            }

            try{

                //Hash password

                //Get SQL formatted datetime (move to local database class)
                const currentTime = super.getCurrentTime();

                //Promise array

                const promiseArray = [
                
                this.transactionPromiseWrapper(SQLStatements.addNewUser.USERS, [
                    id,
                    username,
                    email,
                    password,
                    0 //Not verified
                ], 
                "user added to users table"),

                this.transactionPromiseWrapper(SQLStatements.addNewUser.USER_DETAILS, [
                    username,
                    id,
                    currentTime,
                    0  //Not premium
                ], 
                "user settings added to user settings table"),

                this.transactionPromiseWrapper(SQLStatements.addNewUser.USER_SETTINGS, [
                    id,
                    1, //Timer on
                    10, //Default slider value to 10
                    "EN", //Default target lang  TODO: change depend on user pref
                    "EN", //DEfault output lang  TODO: change depend on user pref
                    null //default project
                ], 
                "user settings created or exists"),

                this.transactionPromiseWrapper(SQLStatements.addNewUser.TRANSLATIONS_LEFT, [
                    id,
                    100
                ], 
                "translations left added to table"),

                this.transactionPromiseWrapper(SQLStatements.addNewUser.PLAYS_LEFT, [
                    id,
                    10
                ], 
                "plays left added to table"),

                this.transactionPromiseWrapper(SQLStatements.addNewUser.NEXT_PLAYS_REFRESH, [
                    id,
                    null
                ], 
                "next plays refresh table created or exists"),

                this.transactionPromiseWrapper(SQLStatements.addNewUser.NEXT_TRANSLATIONS_REFRESH, 
                    [
                        id,
                        null
                    ], "next translations refresh added to table"),

                ];

                //wait for all db transactions to complete
                await Promise.all(promiseArray);

                //Add new users to buffer queues
                await BufferManager.addNewUser(id);

                createNewUser.success = true;
                resolve(createNewUser);

                    
            }catch(e){

                createNewUser.error = e;
                reject(createNewUser)
            }
    })}

    static changePassword = async (newPassword:string, username: string ): Promise<types.ChangePasswordResponse>=>{

        return new Promise(async(resolve, reject)=>{

            const resultObject: types.ChangePasswordResponse = {
                changeSuccessful: false,
                changeMessage: ""
            }

            try{

                const result = await this.transactionPromiseWrapper(SQLStatements.updateStatements.updateUserPassword, [
                    newPassword,
                    username
                ],
                "Password updated successfully");


                if(result.rowsAffected === 0){
                    //Password change failed locally...
                    reject(resultObject)

                }else if(result.rowsAffected === 1){

                    resultObject.changeSuccessful = true;

                    resolve(resultObject);

                }

            }catch(e){
                console.log(e);
                console.trace();
                resultObject.changeMessage = "Error saving password."
                reject(resultObject);
            } 

        })
           
    };

    static deleteAccount = (userId: string, password: string) : Promise<types.LocalOperationResponse> =>{

        return new Promise(async (resolve, reject)=>{

            let deleteAccountResponse: types.LocalOperationResponse = {
                success: false,
                operationType: "remove",
                contentType: "account",
                message: "operation unsuccessful" 
            }

            try{

                //Start fetch
                const resultArrayRaw = await this.transactionPromiseWrapper(SQLStatements.generalStatements.getUserLoginById,[
                    userId
                ],
                "Retrieved login details.");

                const resultArray = super.parseRowResults(resultArrayRaw);

                if(resultArray.length === 0){
                    //If username does not match any entries, then login failed

                    deleteAccountResponse.error = "No matches for username."
                    reject(deleteAccountResponse);
                
                }else if(resultArray.length === 1){
                    //If username matches one user, then attempt password match
                    const userPassword = resultArray[0].password_hash;

                    const userId = resultArray[0].id;

                    if(userPassword === password){

                        const result = await this.transactionPromiseWrapper(SQLStatements.deleteStatements.deleteUser, [
                            userId
                        ],
                        "User deleted successfully");

                        if(result.rowsAffected === 0){
                            //User deletion failed //TODO: ensure that if user tries to login again, then it fails.
                            reject(deleteAccountResponse);

                        }else if (result.rowsAffected){
                            //Delete buffer storage 
                            await BufferManager.deleteUser(userId);

                            deleteAccountResponse.success = true;
                            resolve(deleteAccountResponse);
                        }
                        
                    }
                        
                    }else{
                        deleteAccountResponse.error = "Password incorrect"
                        throw deleteAccountResponse;
                    }
            }catch(deleteAccountResponse){

                //Some error occured when deleting the account
                reject(deleteAccountResponse);

            }
        })
    };    
    
    static deleteAccountBackend = (userId: string) : Promise<types.LocalOperationResponse> =>{

        return new Promise(async (resolve, reject)=>{

            let deleteAccountResponse: types.LocalOperationResponse = {
                success: false,
                operationType: "remove",
                contentType: "account",
                message: "operation unsuccessful" 
            }

            try{

                //Delete account
                const resultArrayRaw = await this.transactionPromiseWrapper(SQLStatements.deleteStatements.deleteUser,[
                    userId
                ],
                "Deleted user");

                if(resultArrayRaw.rowsAffected === 0){
                    //Local delete failed.

                    reject(deleteAccountResponse)
                }else if (resultArrayRaw.rowsAffected === 1){
                    //Local delete successful
                    deleteAccountResponse.message = "operation successful";
                    deleteAccountResponse.success = true;

                    await BufferManager.deleteUser(userId);

                    resolve(deleteAccountResponse);
                }

            }catch(deleteAccountResponse){

                reject(deleteAccountResponse)

            }
        })
    };  




    static updateTimerValue = (userId: string, value: boolean): Promise<types.LocalOperationResponse>=>{
        return new Promise(async(resolve, reject)=>{

            const timerUpdateSuccess: types.LocalOperationResponse = {
                success: false,
                operationType: "update",
                message: "operation unsuccessful"
            }

            try{

                //Get new db transaction, and update time in database.
                const resultRow = await super.transactionPromiseWrapper(SQLStatements.updateStatements.updateTimerOn, [
                    value,
                    userId
                ],
                "Updated timer value");

                if(resultRow.rowsAffected === 0){
                    reject(timerUpdateSuccess) //Failed to update timer
                } else if (resultRow.rowsAffected === 1){

                    timerUpdateSuccess.success = true;
                    timerUpdateSuccess.message = "operation successful";
                    resolve(timerUpdateSuccess);

                }
            
            } catch(e){
                console.log("Could not update timer value.")
                console.log(e);
                console.trace();
                reject(e);
            }
        })
    };

    static updateTurnsValue = (userId: string, value: number): Promise<types.LocalOperationResponse> =>{
        return new Promise(async(resolve, reject)=>{

            let updateTurnsResponse: types.LocalOperationResponse = {
                success: false,
                operationType: "update",
                contentType: "account",
                message: "operation unsuccessful" 
            }

            try{

        
                //Get new db transaction, and update time in database.

                const resultRow = await this.transactionPromiseWrapper(SQLStatements.updateStatements.updateNoOfTurns, [
                    value,
                    userId
                ],
                "Updated turns value");

                if(resultRow.rowsAffected === 0){
                    reject(updateTurnsResponse) //Failed to update timer
                } else if (resultRow.rowsAffected === 1){

                    updateTurnsResponse.success = true;
                    updateTurnsResponse.message = "operation successful";
                    resolve(updateTurnsResponse);

                }               

            } catch(e){
                console.log("Could not update no of turns.")
                console.log(e);
                console.trace();
                reject(e);
            }
        })
    };

    static updateTargetLangDefault = (userId: string, value: string): Promise<types.LocalOperationResponse> =>{
        return new Promise(async(resolve, reject)=>{

            let updateTargetLangResponse: types.LocalOperationResponse = {
                success: false,
                operationType: "update",
                contentType: "settings",
                message: "operation unsuccessful" 
            }

            try{ 
    
                //Get new db transaction, and update time in database.
            
                const resultRow = await this.transactionPromiseWrapper(SQLStatements.updateStatements.updateDefaultTargetLang, [
                    value,
                    userId
                ], 
                "Updated target language");
            
                if(resultRow.rowsAffected === 0){
                    reject(updateTargetLangResponse) //Failed to update target lang
                } else if (resultRow.rowsAffected === 1){

                    updateTargetLangResponse.success = true;
                    updateTargetLangResponse.message = "operation successful";
                    resolve(updateTargetLangResponse);

                }    
                
            } catch(e){
                console.log("Could not update default target lang.")
                console.log(e);
                console.trace();
                reject(e);
            }
        })
    };

    static updateOutputLangDefault = (userId: string, value: string): Promise<types.LocalOperationResponse>=>{
        return new Promise(async(resolve, reject)=>{

            let updateOutputLangResponse: types.LocalOperationResponse = {
                success: false,
                operationType: "update",
                contentType: "settings",
                message: "operation unsuccessful" 
            }


            try{  
            
                //Get new db transaction, and update time in database.
            
                const resultRow = await this.transactionPromiseWrapper(SQLStatements.updateStatements.updateDefaultOutputLang, [
                    value,
                    userId
                ], 
                "Updated output language");
            
                if(resultRow.rowsAffected === 0){
                    reject(updateOutputLangResponse) //Failed to update target lang
                } else if (resultRow.rowsAffected === 1){

                    updateOutputLangResponse.success = true;
                    updateOutputLangResponse.message = "operation successful";
                    resolve(updateOutputLangResponse);

                }  
                
            } catch(e){
                console.log("Could not update default target lang.")
                console.log(e);
                console.trace();
                reject(e);
            }
        })
    };

    static setTranslationsLeft = (userId: string, translationsLeft: number): Promise<types.LocalOperationResponse>=>{
        return new Promise(async(resolve, reject)=>{

            let updateTranslationsResponse: types.LocalOperationResponse = {
                success: false,
                operationType: "update",
                contentType: "settings",
                message: "operation unsuccessful" 
            }

            try{
    
                //Get new db transaction, and update time in database
                const resultRow = await super.transactionPromiseWrapper(SQLStatements.updateStatements.updateTranslationsLeft, [
                    translationsLeft,
                    userId
                ],
                "Set translations left");

            if(resultRow.rowsAffected === 0){
                reject(updateTranslationsResponse) //Failed to update target lang
            } else if (resultRow.rowsAffected === 1){

                updateTranslationsResponse.success = true;
                updateTranslationsResponse.message = "operation successful";
                resolve(updateTranslationsResponse);

            }    
        

            } catch(e){
                console.log("Could not update translations left.")
                console.log(e);
                console.trace();
                reject(e);
            }
        })
    };

    static setPlaysLeft = (userId: string, playsLeft: number): Promise<types.LocalOperationResponse>=>{
        return new Promise(async(resolve, reject)=>{

            
            let updatePlaysResponse: types.LocalOperationResponse = {
                success: false,
                operationType: "update",
                contentType: "settings",
                message: "operation unsuccessful" 
            }

            try{
                //Get new db transaction, and update time in database.

                const resultRow = await this.transactionPromiseWrapper(SQLStatements.updateStatements.updatePlaysLeft, [
                    playsLeft,
                    userId
                ],
                "Updated plays left");

                if(resultRow.rowsAffected === 0){
                    reject(updatePlaysResponse) //Failed to update target lang
                } else if (resultRow.rowsAffected === 1){

                    updatePlaysResponse.success = true;
                    updatePlaysResponse.message = "operation successful";
                    resolve(updatePlaysResponse);

                } 
                
            } catch(e){
                console.log("Could not update plays left.")
                console.log(e);
                console.trace();
                reject(e);
            }
        })
    };

    static setPlaysRefreshTimeLeft = (userId: string):Promise<types.LocalOperationResponse<number|null>>=>{
        return new Promise(async(resolve, reject)=>{

            let updatePlaysRefreshResponse: types.LocalOperationResponse<number| null> = {
                success: false,
                operationType: "update",
                contentType: "settings",
                message: "operation unsuccessful",
                customResponse: 0
            }

            try{
                //Check whether time exists
                const checkValue = await this.getPlaysRefreshTimeLeft(userId);

                if(checkValue !== null){
                    //If there is already a time set, don't refresh it
                    updatePlaysRefreshResponse.success = true;
                    updatePlaysRefreshResponse.message = "operation successful";
                    updatePlaysRefreshResponse.customResponse = checkValue;
                    resolve(updatePlaysRefreshResponse);
                    return 
                };

                //Add an hour in milliseconds

                const currentTime = new Date();
                const HOUR_IN_MILLISECONDS = 3600000;
                const currentTimeMillis = currentTime.getTime();

                // Calculate the new time by adding an hour
                const newTimeMillis = currentTimeMillis + HOUR_IN_MILLISECONDS;

                // Create a new Date object with the calculated time
                const newTime = new Date(newTimeMillis);

                const formattedTime = newTime.toISOString();

                //Get new db transaction, and update time in database.
                const resultRow = await this.transactionPromiseWrapper(SQLStatements.refreshStatements.setPlaysRefreshTime, [
                    formattedTime,
                    userId
                ],
                "Updated plays refresh time");


                if(resultRow.rowsAffected === 0){
                    reject(updatePlaysRefreshResponse) //Failed to update target lang
                } else if (resultRow.rowsAffected === 1){

                    updatePlaysRefreshResponse.customResponse = newTime;
                    updatePlaysRefreshResponse.success = true;
                    updatePlaysRefreshResponse.message = "operation successful";
                    resolve(updatePlaysRefreshResponse);

                }   
                
            } catch(e){
                console.log("Could not update plays refresh time left.")
                console.log(e);
                console.trace();
                reject(e);
            }
        })
    };

    static setTranslationsRefreshTimeLeft = (userId: string, translationRefreshTime): Promise<types.LocalOperationResponse>=>{
        return new Promise(async(resolve, reject)=>{

            let updateTranslationsRefreshResponse: types.LocalOperationResponse = {
                success: false,
                operationType: "update",
                contentType: "settings",
                message: "operation unsuccessful" 
            }

            try{

                const resultRow = await this.transactionPromiseWrapper(SQLStatements.refreshStatements.setTranslationRefreshTime, [
                    translationRefreshTime,
                    userId
                ],
                "Updated translations refresh time");

                if(resultRow.rowsAffected === 0){
                    reject(updateTranslationsRefreshResponse) //Failed to update target lang
                } else if (resultRow.rowsAffected === 1){
    
                    updateTranslationsRefreshResponse.success = true;
                    updateTranslationsRefreshResponse.message = "operation successful";
                    resolve(updateTranslationsRefreshResponse);
    
                } 
                
            } catch(e){
                console.log("Could not update translations refresh time left.")
                console.log(e);
                console.trace();
                reject(e);
            }
        })
    };

    //Refreshing user plays and translations

    static refreshGamesLeft = (userId: string):Promise<types.LocalOperationResponse>=>{

        return new Promise(async(resolve, reject)=>{

            let refreshPlaysRefreshResponse: types.LocalOperationResponse = {
                success: false,
                operationType: "update",
                contentType: "settings",
                message: "operation unsuccessful",
                
            }
            try{

                //Start transaction
                const resultRowRefresh = await this.transactionPromiseWrapper(SQLStatements.refreshStatements.updatePlaysRefresh, [
                    userId
                ],
                "Updated plays refresh time");
                
                const resultRowPlays = await this.transactionPromiseWrapper(SQLStatements.refreshStatements.updatePlaysRemaining, [
                    userId
                ],
                "updated plays left");

                if(resultRowRefresh.rowsAffected === 0 || resultRowPlays.rowsAffected === 0 ){
                    reject(refreshPlaysRefreshResponse) //Failed to update rows 

                } else if (resultRowRefresh.rowsAffected === 1 && resultRowPlays.rowsAffected === 1){


                    refreshPlaysRefreshResponse.success = true;
                    refreshPlaysRefreshResponse.message = "operation successful";
                    resolve(refreshPlaysRefreshResponse);

                }  
          

            } catch(e){

                console.log("Unable to update plays refresh or remaining tables.");
                console.trace();
                reject(e);
            }
        })
    };

    static refreshTranslationsLeftPremium = (userId: string): Promise<types.LocalOperationResponse>=>{

        return new Promise(async(resolve, reject)=>{

            let translationsLeftPremResponse: types.LocalOperationResponse = {
                success: false,
                operationType: "update",
                contentType: "settings",
                message: "operation unsuccessful",
            }

            try{

                const resultRowRefresh = await this.transactionPromiseWrapper(SQLStatements.refreshStatements.updateTranslationsRemainingPremium, [
                    userId
                ],
                "updated translations refresh premium");

                const resultRowTrans = await this.transactionPromiseWrapper(SQLStatements.refreshStatements.updateTranslationsRefreshPremium, [
                    userId
                ],
                "Updated refresh premium");

            
                if(resultRowRefresh.rowsAffected === 0 || resultRowTrans.rowsAffected === 0 ){
                    reject(translationsLeftPremResponse) //Failed to update rows 

                } else if (resultRowRefresh.rowsAffected === 1 && resultRowTrans.rowsAffected === 1){


                    translationsLeftPremResponse.success = true;
                    translationsLeftPremResponse.message = "operation successful";
                    resolve(translationsLeftPremResponse);

                }  
               

                
            } catch(e){

                console.log("Unable to update translations refresh or remaining tables.");
                console.trace();
                reject(e);
            }
        })
    };

    static refreshTranslationsLeftFree = (userId: string): Promise<types.LocalOperationResponse>=>{

        return new Promise(async(resolve, reject)=>{

            let translationsLeftFreeResponse: types.LocalOperationResponse = {
                success: false,
                operationType: "update",
                contentType: "settings",
                message: "operation unsuccessful",
            }

            try{

                //Start transaction

                const resultRowRefresh = await this.transactionPromiseWrapper(SQLStatements.refreshStatements.updateTranslationsRemainingFree, [
                    userId
                ],
                "Updated translations remaining free");
                const resultRowTrans = await this.transactionPromiseWrapper(SQLStatements.refreshStatements.updateTranslationsRefreshFree, [
                    userId
                ],
                "Updated translations refresh");
        
                if(resultRowRefresh.rowsAffected === 0 || resultRowTrans.rowsAffected === 0 ){
                    reject(translationsLeftFreeResponse) //Failed to update rows 

                } else if (resultRowRefresh.rowsAffected === 1 && resultRowTrans.rowsAffected === 1){


                    translationsLeftFreeResponse.success = true;
                    translationsLeftFreeResponse.message = "operation successful";
                    resolve(translationsLeftFreeResponse);

                }  


            } catch(e){

                console.log("Unable to update translations refresh or remaining tables.");
                console.trace();
                reject(e);
            }
        })
    };


    //Get information events
    static getPlaysRefreshTimeLeft = (userId: string): Promise<number| null>=>{
        return new Promise(async(resolve, reject)=>{

            try{
                const resultArrayRaw = await this.transactionPromiseWrapper(SQLStatements.refreshStatements.getPlaysRefreshTimeLeft, [
                    userId
                ],
                "Fetched plays refresh time");

                if(resultArrayRaw.rowsAffected === 0){
                    reject(null) //Failed to identify User
                    return
                }

                const resultArray = super.parseRowResults(resultArrayRaw);

                if(resultArray.length === 0){
                    //If username  or email does not match any entries, then fetch failed
                    throw ""
                
                }else if(resultArray.length === 1){
                    //If Email matches one user, then attempt password match
                    const playsRefreshTime: number| null = resultArray[0]["games_refresh"]

                    resolve(playsRefreshTime);
                }

                

            } catch(e){

                reject(e)
            }
        })
    };

    static getTranslationsRefreshTimeLeft = (userId: string): Promise<number | null>=>{

        return new Promise(async(resolve, reject)=>{
            try{

                const resultArrayRaw = await this.transactionPromiseWrapper(SQLStatements.refreshStatements.getTranslationsRefreshTimeLeft, [
                    userId
                ],
                "Fetched translations refresh time");

                if(resultArrayRaw.rowsAffected === 0){
                    reject(null) //Failed to identify user
                    return
                }

                const resultArray = super.parseRowResults(resultArrayRaw);

                if(resultArray.length === 0){

                    throw "Error: no translations refresh time found."

                }else if (resultArray.length === 1){

                    const nextTranslationsRefreshTime = resultArray[0]["translations_refresh"];

                    resolve(nextTranslationsRefreshTime);
                };
                
            } catch(e){

                console.log(e); 
                console.trace();
                reject(e);
            }
        })
    };

    static getPlaysLeft=(userId: string): Promise<number> =>{

        return new Promise(async(resolve, reject)=>{

            try{

                //Start transaction

                const resultArrayRaw = await super.transactionPromiseWrapper(SQLStatements.generalStatements.getPlaysLeft, [
                    userId
                ],
                "Fetched plays left");

                if(resultArrayRaw.rowsAffected === 0){
                    reject(null) //Failed to idetnify user
                    return
                }

                const resultArray = super.parseRowResults(resultArrayRaw);

                if(resultArray.length === 0){

                    throw "Error: no plays found."

                }else if (resultArray.length === 1){

                    const playsLeft = resultArray[0]["plays_left"];

                    resolve(playsLeft);

                };
                
            } catch(e){

                reject(e)
            }
        })
    };

    static getTranslationsLeft=(userId: string) : Promise<number>=>{

        return new Promise(async(resolve, reject)=>{

            try{
                const resultArrayRaw = await super.transactionPromiseWrapper(SQLStatements.generalStatements.getTranslationsLeft, [
                    userId
                ],
                "Fetched translations left");

                if(resultArrayRaw.rowsAffected === 0){
                    reject(null) //Failed to identify user
                    return
                }

                const resultArray = super.parseRowResults(resultArrayRaw);

                if(resultArray.length === 0){

                    throw "Error: no translations left found."

                }else if (resultArray.length === 1){

                    const translationsLeft: number = resultArray[0]["translations_left"];

                    resolve(translationsLeft);
                };

                    

            } catch(e){

                reject(e)
            }
        })
    };

    static checkPremiumStatus = (userId:string): Promise<boolean | 0 | 1> => {

        return new Promise(async(resolve, reject)=>{

            try{
                //Start transaction
            
                const resultArrayRaw = await super.transactionPromiseWrapper(SQLStatements.generalStatements.getPremiumStatus, [
                    userId
                ],
                "Fetched premium status");

                const resultArray = super.parseRowResults(resultArrayRaw);

                if(resultArray.length === 0){

                    throw "Error: no user premium status found."

                }else if (resultArray.length === 1){

                    const premiumStatus = resultArray[0]["premium"];

                    resolve(premiumStatus);
                }

            }catch(e){

                console.log(e);
                console.trace();
                reject(e);

            }
        })

    };

    //Misc functions 

    static convertUserSettingsObject(settingsObject): types.UserSettings{

        const userSettings: types.UserSettings = {
            userId: settingsObject["user_id"],
            gameNoOfTurns: settingsObject["slider_val"],
            gameTimerOn: settingsObject["timer_on"],
            defaultTargetLanguage: settingsObject["target_lang"],
            defaultOutputLanguage: settingsObject["output_lang"],
            defaultProject: settingsObject["default_project"]
        };

        return userSettings;

    };

    /* Backend syncing related functions */

    //
    static syncUserSettings = (userId:string, userSettings: types.UserSettings): Promise<types.LocalOperationResponse<string>>=>{
        return new Promise(async(resolve, reject)=>{

            let syncUserSettingsResponse: types.LocalOperationResponse<string> = {
                success: false,
                operationType: "update",
                contentType: "settings",
                message: "operation unsuccessful" 
            }

            try{

                //Start transaction
                const result = await super.transactionPromiseWrapper(SQLStatements.updateStatements.syncUserSettings, [
                    userSettings.gameTimerOn,
                    userSettings.gameNoOfTurns,
                    userSettings.defaultTargetLanguage,
                    userSettings.defaultOutputLanguage,
                    userSettings.defaultProject,
                    userId
                ],
                "User settings updated");

                if(result.rowsAffected === 0){
                    //User settings not updated - no user found
                    
                    syncUserSettingsResponse.customResponse = "No user settings updated"
                    reject(syncUserSettingsResponse);

                }else if (result.rowsAffected === 1){
                    
                    syncUserSettingsResponse.message = "operation successful"
                    syncUserSettingsResponse.success = true;
                    resolve(syncUserSettingsResponse);
                }


            }catch(e){

                syncUserSettingsResponse.error = e;
                reject(syncUserSettingsResponse);

            }

        })
    }
    static syncPremiumStatus =  (userId:string, userPremiumStatus:boolean ): Promise<types.LocalOperationResponse<string>>=>{

        return new Promise(async(resolve, reject)=>{

            let syncUserPremiumStatusResponse: types.LocalOperationResponse<string> = {
                success: false,
                operationType: "update",
                contentType: "account",
                message: "operation unsuccessful" 
            }

            try{

                //Start transaction
                const result = await super.transactionPromiseWrapper(SQLStatements.updateStatements.syncPremiumStatus, [
                    userPremiumStatus,
                    userId
                ],
                "User premium status updated.");

                if(result.rowsAffected === 0){
                    //User premium status not updated - no user found
                    
                    syncUserPremiumStatusResponse.customResponse = "No user found"
                    reject(syncUserPremiumStatusResponse);

                }else if (result.rowsAffected === 1){
                    
                    syncUserPremiumStatusResponse.message = "operation successful"
                    syncUserPremiumStatusResponse.success = true;
                    resolve(syncUserPremiumStatusResponse);
                }


            }catch(e){

                syncUserPremiumStatusResponse.error = e;
                reject(syncUserPremiumStatusResponse);

            }

        })
        
    };
       

}



export default UserDetails