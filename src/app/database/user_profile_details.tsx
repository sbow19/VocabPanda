/* eslint-disable */

import BackendAPI from "app/api/backend";
import * as types from '@customTypes/types.d'
import LocalDatabase from "app/database/local_database";
import SQLStatements from "app/database/prepared_statements";

class UserDetails extends LocalDatabase{

    //Login events

    static signIn = (user:string, password:string):Promise<types.LoginResultObject>=>{
        return new Promise(async(resolve, reject)=>{

            const resultObject: types.LoginResultObject = {
                loginSuccess: false,
                username: "",
                identifierType: "",
                password: ""
            };

                try{

                    const resultArrayRawUser = await super.transactionPromiseWrapper(SQLStatements.generalStatements.getUserLoginByUsername, [user], "User logins fetched");

                    const resultArrayUsername = super.parseRowResults(resultArrayRawUser);

                    if(resultArrayUsername.length === 0){
                        //If username  or email does not match any entries, then login failed
                        
                    
                    }else if(resultArrayUsername.length === 1){
                        //If username matches one user, then attempt password match
                        const userPassword = resultArrayUsername[0].password_hash;

                        if(userPassword === password){
                            resultObject.loginSuccess = true
                            resultObject.username = resultArrayUsername[0].username
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
                            resolve(resultObject);
                        }
                    }
                
                }catch(e){

                    const signInError = new Error("Error occurred while signing in");

                    reject(signInError);

                }
            })
    };

    static getLastLoggedIn = (username: string) =>{
        return new Promise(async(resolve, reject)=>{


            //Create transaction

            try{

                const resultArrayRaw = await super.transactionPromiseWrapper(SQLStatements.generalStatements.getLastLoggedIn, [
                    username
                ], "fetch last logged in");

                const resultArray = super.parseRowResults(resultArrayRaw);

                if(resultArray.length === 0){
                    console.log("Error: no last logged in data found");

                    resolve(null)
                    
                } else if(resultArray.length === 1){

                    const lastLoggedInTime = resultArray[0]["last_logged_in"];

                    resolve(lastLoggedInTime);
                }

            }catch(e){
                reject(e);
            }
        })
    };

    static getLastActivity = (username: string) =>{

        return new Promise(async(resolve, reject)=>{


            //Get last logged in time

            const lastLoggedInTime = await this.getLastLoggedIn(username);

            console.log(lastLoggedInTime)

            //start transaction, returns array  of user entries entered since last logged in time.

            try{
                const resultArrayRaw = await super.transactionPromiseWrapper(SQLStatements.generalStatements.getLastActivity, [
                    lastLoggedInTime, 
                    username
                ],
                "Fetched last activity");

                const resultArray = this.parseRowResults(resultArrayRaw);

                resolve(resultArray);

            }catch(e){
                console.log("Error fetching last activity data");
                reject(e);
            }
                    
        })

    };
    
    static getDefaultAppSettings(username: string): Promise<types.AppSettingsObject>{
        return new Promise(async(resolve, reject)=>{

            try{

                console.log("hello")
                //get user ID 

                const userId = await super.getUserId(username);

                //Get user settings

                const userSettingsRaw = await this.getUserSettings(userId);


                const defaultAppSettings = {
                    userSettings: {
                      targetLanguage: userSettingsRaw["target_lang"],
                      outputLanguage: userSettingsRaw["output_lang"],
                      timerOn: userSettingsRaw["timer_on"],
                      noOfTurns: userSettingsRaw["slider_val"]
                    },
                    premium:{
                        premium: 0,
                        endTime: null
                    }
                };

                //Get user projects

                defaultAppSettings.projects = await this.getUserProjects(userId);


            
                //Get last logged in

                const lastLoggedIn = await this.getLastLoggedIn(username);

                defaultAppSettings.lastLoggedIn = lastLoggedIn;

      

                //get premium

                const premium = await this.checkPremiumStatus(username);

                defaultAppSettings.premium.premium = premium;


                //Get plays left

                const playsLeft = await this.getPlaysLeft(userId);

                defaultAppSettings.playsLeft = playsLeft;

                //Get playsr efresh time left

                const playsRefreshTimeRaw = await UserDetails.getPlaysRefreshTimeLeft(userId);

                defaultAppSettings.playsRefreshTime = playsRefreshTimeRaw["games_refresh"]


                //Get translations left

                const translationsLeft = await this.getTranslationsLeft(userId);

                defaultAppSettings.translationsLeft = translationsLeft;

                //Get translations refresh time left

                const translationsRefreshTimeRaw = await UserDetails.getTranslationsRefreshTimeLeft(userId);

                defaultAppSettings.translationsRefreshTime = translationsRefreshTimeRaw["translations_refresh"]


                resolve(defaultAppSettings);

            }catch(e){

                console.trace();
                console.log(e);
                reject(e);

            }

        })
    };

    static getUserSettings(userId: string){
        return new Promise(async(resolve, reject)=>{


            try{
                //Start transaction --
                const resultArrayRawSettings = await super.transactionPromiseWrapper(SQLStatements.generalStatements.getAppSettings, [
                    userId
                ], "User settings fetched");


                const resultArraySettings = super.parseRowResults(resultArrayRawSettings);

                if(resultArraySettings.length === 0){

                    resolve("Error: no user settings found")

                }else if (resultArraySettings.length === 1){

                    const rawUserSettings = resultArraySettings[0];

                    //Return user settings
                    resolve(rawUserSettings);

                }

            }catch(e){

                console.trace();
                console.log(e);
                reject(e);

            }

        })
    };

    static getUserProjects(userId: string){
        return new Promise(async(resolve, reject)=>{

            //Start transaction --

            //Get user projects

            try{
                
                const resultArrayRawProjects = await super.transactionPromiseWrapper(SQLStatements.generalStatements.getAllProjects, [
                    userId
                ],
                "User projects fetched");

                const resultArrayProjects = super.parseRowResults(resultArrayRawProjects);

                if(resultArrayProjects.length === 0){

                    console.log("Error: no projects found");

                    resolve([]); //No projects assigned to user

                }else if (resultArrayProjects.length >= 1){

                    const projectArray: Array<types.ProjectObject> = [];

                    //Cycle through projects identified in projects table and add details to app setting object.

                    for(let project of resultArrayProjects){

                        let projectObject: types.ProjectObject = {
                            projectName: project["project"],
                            targetLanguage: project["target_lang"],
                            outputLanguage: project["outputLang"]
                        
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
    )=>{

        return new Promise(async(resolve, reject)=>{

            try{

            //Hash password

            //Get SQL formatted datetime (move to local database class)

            const currentTime = super.getCurrentTime();

                await this.transactionPromiseWrapper(SQLStatements.addNewUser.USERS, [id,
                username,
                    email,
                    password], 
                "user added to users table");

                await this.transactionPromiseWrapper(SQLStatements.addNewUser.USER_DETAILS, [
                    username,
                    id,
                    currentTime,
                    0  //Not premium
                ], 
                "user settings added to user settings table");
                await this.transactionPromiseWrapper(SQLStatements.addNewUser.USER_SETTINGS, [
                    id,
                    1, //Timer on
                    10, //Default slider value to 10
                    "EN", //Default target lang  TODO: change depend on user pref
                    "EN", //DEfault output lang  TODO: change depend on user pref
                    null //default project
                ], 
                "user settings created or exists");

                await this.transactionPromiseWrapper(SQLStatements.addNewUser.TRANSLATIONS_LEFT, [
                    id,
                    100
                ], 
                "translations left added to table");

                await this.transactionPromiseWrapper(SQLStatements.addNewUser.PLAYS_LEFT, [
                    id,
                    10
                ], 
                "plays left added to table");

                await this.transactionPromiseWrapper(SQLStatements.addNewUser.NEXT_PLAYS_REFRESH, [
                    id,
                    null
                ], 
                "next plays refresh table created or exists");

                await this.transactionPromiseWrapper(SQLStatements.addNewUser.NEXT_TRANSLATIONS_REFRESH, 
                    [
                        id,
                        null
                    ], "next translations refresh added to table");

                resolve(null);

                    
            }catch(e){
                reject(e)
            }

            /* Prime for account creation online */
    })}

    static changePassword = async (newPassword:string, username: string ): Promise<types.ChangePasswordResponse>=>{

        return new Promise(async(resolve, reject)=>{

            const resultObject: types.ChangePasswordResponse = {
                changeSuccessful: false,
                changeMessage: ""
            }

            try{

                await this.transactionPromiseWrapper(SQLStatements.updateStatements.updateUserPassword, [
                    newPassword,
                    username
                ],
                "Password updated successfully");

                resultObject.changeSuccessful = true;

                resolve(resultObject);
            
    
            }catch(e){
                console.log(e);
                console.trace();
                resultObject.changeMessage = "Error saving password."
                reject(resultObject);
            } 

        })
           
    };

    static deleteAccount = (username: string, password: string) : Promise<types.DeleteAccountResponseObject> =>{

        return new Promise(async (resolve)=>{

            const resultObject: types.DeleteAccountResponseObject = {
                username: username, 
                deletionSuccessful: false,
                message: ""
            };

            try{

                //Start fetch

                const resultArrayRaw = await this.transactionPromiseWrapper(SQLStatements.generalStatements.getUserLoginByUsername,[
                    username
                ],
                "Retrieved login details.");

                const resultArray = super.parseRowResults(resultArrayRaw);

                if(resultArray.length === 0){
                    //If username does not match any entries, then login failed

                    resultObject.deletionSuccessful = false
                    resultObject.message = "No matches for username."
                    resolve(resultObject);
                
                }else if(resultArray.length === 1){
                    //If username matches one user, then attempt password match
                    const userPassword = resultArray[0].password_hash;

                    if(userPassword === password){

                        await this.transactionPromiseWrapper(SQLStatements.deleteStatements.deleteUser, [
                            username
                        ],
                        "User deleted successfully");

                        resultObject.deletionSuccessful = true
                        resultObject.username = resultArray[0].username
                        resolve(resultObject);
                        }
                        
                    }else{
                        resolve(resultObject);
                    }
            }catch(e){

                console.log(e);
                console.trace();
                resultObject.message = "Account deletion failed"
                resolve(resultObject)

            }
        })
    };      
       
    //TODO - update to sqllite storage
    static upgradeToPremium(username: string, endTime: string){
        return new Promise(async(resolve,reject)=>{

            try{
                const allAppSettingsRaw = await AsyncStorage.getItem('allDefaultSettings');

                const allAppSettings =  JSON.parse(allAppSettingsRaw)

                if(allAppSettings[userName]){
    
                    /* If app settings already exists on user, just add login time and resolve promise */
                    
                    allAppSettings[userName].gamesLeft = 
                    {
                        gamesLeft: 10,
                        refreshBaseTime: "",
                        refreshNeeded: false
                    }

                    allAppSettings[userName].translationsLeft = 
                    {
                        translationsLeft: 250,
                        refreshBaseTime: "",
                        refreshNeeded: false
                    }

                    /*Set premium details*/
                    allAppSettings[userName].premium = {
                        premium: true,
                        endTime: endTime
                    }

                    const stringifiedSettings = JSON.stringify(allAppSettings)
    
                    await AsyncStorage.setItem('allDefaultSettings', stringifiedSettings)

                    resolve("User exists")
                }
            }catch(e){
                reject(e)
            }
    })
    };

    static downgradeToFree(userName: string){

        return new Promise(async(resolve,reject)=>{

            try{
                const allAppSettingsRaw = await AsyncStorage.getItem('allDefaultSettings');

                const allAppSettings =  JSON.parse(allAppSettingsRaw)

                if(allAppSettings[userName]){
    
                    /* If app settings already exists on user, just add login time and resolve promise */
                    
                    allAppSettings[userName].gamesLeft = 
                    {
                        gamesLeft: 10,
                        refreshBaseTime: "",
                        refreshNeeded: false
                    }

                    allAppSettings[userName].translationsLeft = 
                    {
                        translationsLeft: 40,
                        refreshBaseTime: "",
                        refreshNeeded: false
                    }

                    /*Set premium details*/
                    allAppSettings[userName].premium = {
                        premium: false,
                        endTime: ""
                    }

                    const stringifiedSettings = JSON.stringify(allAppSettings)
    
                    await AsyncStorage.setItem('allDefaultSettings', stringifiedSettings)

                    resolve("User exists")
                }
            }catch(e){
                reject(e)
            }
    })
    };

    static updateTimerValue(username: string, value: boolean){
        return new Promise(async(resolve, reject)=>{

            try{

                //Get userId 
                const userId = await super.getUserId(username);

                //Get new db transaction, and update time in database.

                await super.transactionPromiseWrapper(SQLStatements.updateStatements.updateTimerOn, [
                    value,
                    userId
                ],
                "Updated timer value");
                
                resolve(null);
            
            } catch(e){
                console.log("Could not update timer value.")
                console.log(e);
                console.trace();
                reject(e);
            }
        })
    };

    static updateTurnsValue(username: string, value: number){
        return new Promise(async(resolve, reject)=>{

            try{

                //Get userId 
                const userId = await super.getUserId(username);
        
                //Get new db transaction, and update time in database.

                await this.transactionPromiseWrapper(SQLStatements.updateStatements.updateNoOfTurns, [
                    value,
                    userId
                ],
                "Updated turns value");

                resolve(null);
               

            } catch(e){
                console.log("Could not update no of turns.")
                console.log(e);
                console.trace();
                reject(e);
            }
        })
    };

    static updateTargetLangDefault(username: string, value: string){
        return new Promise(async(resolve, reject)=>{

            try{ 
                //Get userId 
                const userId = await super.getUserId(username);
                

                //Get new db transaction, and update time in database.
            
                await this.transactionPromiseWrapper(SQLStatements.updateStatements.updateDefaultTargetLang, [
                    value,
                    userId
                ], 
                "Updated target language");
            
                resolve(null);
                
            } catch(e){
                console.log("Could not update default target lang.")
                console.log(e);
                console.trace();
                reject(e);
            }
        })
    };

    static updateOutputLangDefault(username: string, value: string){
        return new Promise(async(resolve, reject)=>{

            try{  
                
                //Get userId 

                const userId = await this.getUserId(username);

                //Get new db transaction, and update time in database.
            
                await this.transactionPromiseWrapper(SQLStatements.updateStatements.updateDefaultOutputLang, [
                    value,
                    userId
                ], 
                "Updated output language");
            
                resolve(null);
                
            } catch(e){
                console.log("Could not update default target lang.")
                console.log(e);
                console.trace();
                reject(e);
            }
        })
    };

    static setTranslationsLeft(username: string, translationsLeft: number){
        return new Promise(async(resolve, reject)=>{

            try{
    
                //Get userId 
                const userId = await super.getUserId(username);

                //Get remaining translations

                const newValue = translationsLeft - 1;

                //Get new db transaction, and update time in database

                await super.transactionPromiseWrapper(SQLStatements.updateStatements.updateTranslationsLeft, [
                    newValue,
                    userId
                ],
               "Set translations left");
                resolve(null);
        

            } catch(e){
                console.log("Could not update translations left.")
                console.log(e);
                console.trace();
                reject(e);
            }
        })
    };

    static setPlaysLeft(username: string, playsLeft: number){
        return new Promise(async(resolve, reject)=>{

            try{

                //Get userId 

                const userId = await this.getUserId(username);

                //Get new db transaction, and update time in database.

                await this.transactionPromiseWrapper(SQLStatements.updateStatements.updatePlaysLeft, [
                    playsLeft,
                    userId
                ],
                "Updated plays left");
                resolve(null);
                
            } catch(e){
                console.log("Could not update plays left.")
                console.log(e);
                console.trace();
                reject(e);
            }
        })
    };

    static setPlaysRefreshTimeLeft(username: string){
        return new Promise(async(resolve, reject)=>{

            try{

                //Get userId 
                const userId = await this.getUserId(username);

                //Check whether time exists
                const checkValue = await this.getPlaysRefreshTimeLeft(userId);

                if(checkValue["game_refresh"] !== null){
                    //If there is already a time set, don't refresh it
                    resolve(checkValue["game_refresh"])
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
                await this.transactionPromiseWrapper(SQLStatements.refreshStatements.setPlaysRefreshTime, [
                    formattedTime,
                    userId
                ],
                "Updated plays refresh time");
                resolve(newTime); //Resolves plays refresh time
                
            } catch(e){
                console.log("Could not update plays refresh time left.")
                console.log(e);
                console.trace();
                reject(e);
            }
        })
    };

    static setTranslationsRefreshTimeLeft(username: string){
        return new Promise(async(resolve, reject)=>{

            try{

                //Get userId 
                const userId = await this.getUserId(username);

                //Check whether time exists
                const checkValue = await this.getTranslationsRefreshTimeLeft(userId);

                if(checkValue["translations_refresh"] !== null){
                    //If there is already a time set, don't refresh it
                    resolve(checkValue["translations_refresh"]);
                    return 
                };

                //Add an week in milliseconds

                const currentTime = new Date();
                const WEEK_IN_MILLISECONDS = 604800000;
                const currentTimeMillis = currentTime.getTime();

                // Calculate the new time by adding a week
                const newTimeMillis = currentTimeMillis + WEEK_IN_MILLISECONDS;

                // Create a new Date object with the calculated time
                const newTime = new Date(newTimeMillis);

                const formattedTime = newTime.toISOString();
                //Get new db transaction, and update time in database.

                await this.transactionPromiseWrapper(SQLStatements.refreshStatements.setTranslationRefreshTime, [
                    formattedTime,
                    userId
                ],
                "Updated translations refresh time");

                resolve(newTime); // Resolves to new time
                
            } catch(e){
                console.log("Could not update translations refresh time left.")
                console.log(e);
                console.trace();
                reject(e);
            }
        })
    };

    //Refreshing user plays and translations

    static refreshGamesLeft(userId: string){

        return new Promise(async(resolve, reject)=>{


            try{


                //Start transaction


                    await this.transactionPromiseWrapper(SQLStatements.refreshStatements.updatePlaysRefresh, [
                        userId
                    ],
                    "Updated plays refresh time");
                    
                    await this.transactionPromiseWrapper(SQLStatements.refreshStatements.updatePlaysRemaining, [
                        userId
                    ],
                    "updated plays left");

                    resolve(null);
          

            } catch(e){

                console.log("Unable to update plays refresh or remaining tables.");
                console.trace();
                reject(e);
            }
        })
    };

    static refreshTranslationsLeftPremium(userId: string){

        return new Promise(async(resolve, reject)=>{

            try{


                //Start transaction

          
                await this.transactionPromiseWrapper(SQLStatements.refreshStatements.updateTranslationsRemainingPremium, [
                    userId
                ],
                "updated translations refresh premium");
                await this.transactionPromiseWrapper(SQLStatements.refreshStatements.updateTranslationsRefreshPremium, [
                    userId
                ],
                "Updated refresh premium");

            
                    resolve(null);
               

                
            } catch(e){

                console.log("Unable to update translations refresh or remaining tables.");
                console.trace();
                reject(e);
            }
        })
    };

    static refreshTranslationsLeftFree(userId: string){

        return new Promise(async(resolve, reject)=>{

            try{

                //Start transaction

                await this.transactionPromiseWrapper(SQLStatements.refreshStatements.updateTranslationsRemainingFree, [
                    userId
                ],
                "Updated translations remaining free");
                await this.transactionPromiseWrapper(SQLStatements.refreshStatements.updateTranslationsRefreshFree, [
                    userId
                ],
                "Updated translations refresh");
        
                resolve(null);


            } catch(e){

                console.log("Unable to update translations refresh or remaining tables.");
                console.trace();
                reject(e);
            }
        })
    };


    //Get information events

    static getPlaysRefreshTimeLeft(userId: string){

        return new Promise(async(resolve, reject)=>{

            try{

                //Start transaction

                const resultArrayRaw = await this.transactionPromiseWrapper(SQLStatements.refreshStatements.getPlaysRefreshTimeLeft, [
                    userId
                ],
                "Fetched plays refresh time");

                const resultArray = super.parseRowResults(resultArrayRaw);

                if(resultArray.length === 0){

                    throw "Error: no plays refresh time found."

                }else if (resultArray.length === 1){

                    const nextPlaysRefreshTime = resultArray[0];

                    resolve(nextPlaysRefreshTime);

                };

            } catch(e){

                reject(e)
            }
        })
    };

    static getTranslationsRefreshTimeLeft(userId: string){

        return new Promise(async(resolve, reject)=>{
            try{

                const resultArrayRaw = await this.transactionPromiseWrapper(SQLStatements.refreshStatements.getTranslationsRefreshTimeLeft, [
                    userId
                ],
                "Fetched translations refresh time");

                const resultArray = super.parseRowResults(resultArrayRaw);

                if(resultArray.length === 0){

                    throw "Error: no translations refresh time found."

                }else if (resultArray.length === 1){

                    const nextTranslationsRefreshTime = resultArray[0];

                    resolve(nextTranslationsRefreshTime);
                };
                
            } catch(e){

                console.log(e); 
                console.trace();
                reject(e);
            }
        })
    };

    static getPlaysLeft(userId: string){

        return new Promise(async(resolve, reject)=>{

            try{

                //Start transaction

                const resultArrayRaw = await super.transactionPromiseWrapper(SQLStatements.generalStatements.getPlaysLeft, [
                    userId
                ],
                "Fetched plays left");

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

    static getTranslationsLeft(userId: string){

        return new Promise(async(resolve, reject)=>{

            try{


                //Start transaction

                const resultArrayRaw = await super.transactionPromiseWrapper(SQLStatements.generalStatements.getTranslationsLeft, [
                    userId
                ],
                "Fetched translations left");

                const resultArray = super.parseRowResults(resultArrayRaw);

                if(resultArray.length === 0){

                    throw "Error: no translations left found."

                }else if (resultArray.length === 1){

                    const translationsLeft = resultArray[0]["translations_left"];

                    resolve(translationsLeft);
                };

                    

            } catch(e){

                reject(e)
            }
        })
    };

    static checkPremiumStatus(username:string): Promise<boolean>{

        return new Promise(async(resolve, reject)=>{

            try{


                //Start transaction
            
                const resultArrayRaw = await super.transactionPromiseWrapper(SQLStatements.generalStatements.getPremiumStatus, [
                    username
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

}



export default UserDetails