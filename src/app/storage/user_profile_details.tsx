/* eslint-disable */

import EncryptedStorage from "react-native-encrypted-storage";
import AppSettings from "./app_settings_storage";
import NetInfo from "@react-native-community/netinfo";
import BackendAPI from "app/api/backend";

class AppLoginDetails {

    constructor(){

    }

    static signIn = async(user:string, password:string)=>{

        return new Promise(async(resolve, reject)=>{

            /* fetch user data */

            let resultObject = {
                loginSuccess: false,
                userName: ""
            }

            try{

                let usersDetailsRaw = await EncryptedStorage.getItem('users');

                let usersDetails = JSON.parse(usersDetailsRaw);

                /* check username and password */

                if(usersDetails[user] && usersDetails[user].password === password){

                    resultObject.loginSuccess = true
                    resultObject.userName = user
                    resolve(resultObject)
                }else{

                    /*Cycle through users to find email and password*/
                    for(let userName of Object.keys(usersDetails)){

                        if(usersDetails[userName].password === password && usersDetails[userName].email === user){
                            resultObject.loginSuccess = true
                            resultObject.userName = userName
                            resolve(resultObject)
                            return
                        }
                    }

                    /* If no matches then return falsy resultObject*/

                    resolve(resultObject)


                }

            }catch(e){
                console.log(e)
            }


        })
    };

    static checkLoginDetails = (email:string, username:string)=>{

        /* CHecks login details object of users listed on the phone */

        return new Promise(async(resolve, reject) =>{

            let resultObject = {
                match: false,
                local: false,
                online: false,
                error: false,
                errorMessage: ""
            };
    
            /* test for internet connection */
            let internetConnection = false
            
            /* try async storage to see if users object exists. Error if fails */
            try{
    
                let usersDetailsRaw = await EncryptedStorage.getItem("users");
    
                let usersDetails = JSON.parse(usersDetailsRaw);

    
                /* If empty then returns  results Object with no match */
                /* Checks details on local device. If email, then all usres are cycled through to see if email matches any of the users emails  */

                if(Object.keys(usersDetails).length === 0){

                    resolve(resultObject)
                    return 
                }
                
                if(Object.keys(usersDetails).length !== 0){

                    for (let savedUsername of Object.keys(usersDetails)){

                        if(usersDetails[savedUsername].email === email){
    
                            resultObject.match = true
                            resultObject.local = true
                            resolve(resultObject);
                            return
                        }
                    }
                }
                
                if(usersDetails[username]){   
                    
                    console.log("Match")
    
                    resultObject.match = true
                    resultObject.local = true
                    resolve(resultObject)

                } else if(internetConnection == true) {
    
                    /* online test */
                    
                    try {
                        /* Search request with user details */
                        resultObject.match = true
                        resultObject.online = true
                        resolve(resultObject)
    
                    } catch(e){
    
                        reject(e)
                        console.log(e)
                        console.log("Error whilst validating online")
    
                    }
    
                } else {
    
                    resultObject.error = true
                    resultObject.errorMessage = "no internet"
                    resolve(resultObject)
                }
    
                   
            } catch (e){
                console.log(e)
                reject(e)
            }
        })
    };

    static setInitial = ()=>{

        return new Promise(async(resolve, reject)=>{

            try{

                let usersDetailsRaw = await EncryptedStorage.getItem('users');

                let usersDetails = JSON.parse(usersDetailsRaw);

                console.log(usersDetails)

                //Check for internet connection

                const isOnline = await NetInfo.fetch().then(state=>{

                    return state.isConnected;
                });

                //Testing backend API key generatio
    
                if(!usersDetailsRaw && isOnline){

                    //Where user device has no data and is connected to internet, api key requewst made

                    const APIKey = await BackendAPI.requestAPIKey();

                    console.log(APIKey)

                    if(!APIKey){
                        const error = "Backend error generating API key."
                        throw error;
                    };

   
                    const usersDetails = {
                        "api-key": APIKey
                    };

                    await EncryptedStorage.setItem('users',
                        JSON.stringify(usersDetails)
                    );

                    //Once API key set in local storage  we need to re add the global headers

                    await BackendAPI.setGlobalHeaders();

                    resolve(null);
                    return

                } else if (!usersDetailsRaw && !isOnline){

                    const error = "User must be online before starting app.";
                    throw error

                } else if (usersDetailsRaw){

                    //Check if API key exists

                    const resultObject = await AppLoginDetails.checkAPIKey();
                    
                    if(!resultObject.APIKeyExists && !isOnline){

                        throw "Cannot start without internet connection."

                    } else if (!resultObject.APIKeyExists && isOnline){

                        //Where user device has no data and is connected to internet, api key requewst made

                        const APIKeyRequestResponse = await BackendAPI.requestAPIKey();

                        if(!APIKeyRequestResponse){
                            const error = "Backend error generating API key."
                            throw error;
                        };

                        usersDetails["api-key"] = APIKeyRequestResponse.APIKey
                        

                        await EncryptedStorage.setItem('users',
                            JSON.stringify(usersDetails)
                        );

                        //Once API key set in local storage  we need to re add the global headers
                        await BackendAPI.setGlobalHeaders();

                        resolve(null);
                        return

                    } else if (resultObject.APIKeyExists){
                        
                        resolve(null);
                        return
                    }

                }
            
            
            }catch(e){
                console.log(e);
                const AddLocalUserDetailsError = new Error(
                    "Error creating local storage for user details."
                ).stack;
                
                reject(AddLocalUserDetailsError);
            }
        })

        /* Check whether there is a users object set in storage. If not, then add to users object to storage*/

        
    };
      
    static setLoginDetails = (email:string, username:string, password: string)=>{

        return new Promise(async(resolve, reject)=>{

            try{

                let usersDetailsRaw = await EncryptedStorage.getItem('users')

                let usersDetails = JSON.parse(usersDetailsRaw)

            
                if (!usersDetails[username]) {
                    usersDetails[username] = {}; // Create an empty object for the username if it doesn't exist

                    usersDetails[username].email = email
                    usersDetails[username].password = password

                    await EncryptedStorage.setItem(
                        "users",
                        JSON.stringify(usersDetails)
                    )

                    resolve(console.log(usersDetails))
                }

            }catch(e){
                reject(e)
            }

            /* Prime for account creation online */
    })}

    static changePassword = async (newPassword:string, username: string )=>{

        try{

            let usersDetailsRaw = await EncryptedStorage.getItem('users')

            let usersDetails = JSON.parse(usersDetailsRaw)

        
            usersDetails[username].password = newPassword

            let newUsersDetails = JSON.stringify(usersDetails)

            await EncryptedStorage.setItem('users', newUsersDetails)

            return("Password saved")

        }catch(e){
            return("Error saving password")
        }



    
    }

    static deleteAccount = async (username: string, password: string) =>{

        return new Promise(async (resolve)=>{

            let resultObject = {
                username: username, 
                deletionSuccessful: false,
                message: ""
            }
            try{
    
                /* delete user profile */
                let usersDetailsRaw = await EncryptedStorage.getItem('users')
    
                let usersDetails = JSON.parse(usersDetailsRaw)

                console.log(usersDetails)

                if(usersDetails[username].password === password){
                    /* Check if inputted password matches password in database */

                    delete usersDetails[username]

                }else{

                    /* Else resolve promise here with password match error */

                    resultObject.message = "Passwords do not match"
                    resolve(resultObject)
                }
    
                let newUsersDetails = JSON.stringify(usersDetails);
    
        
                /* delete saved user settings */
    
                let results = await AppSettings.deleteUserSettings(username);

                if(results.settingsDeletionSuccessful == true){

                    /* Only set encrypted storage if game settings deletion passes */
                    await EncryptedStorage.setItem('users', newUsersDetails)
                    resultObject.deletionSuccessful = true
                    resolve(resultObject)

                } else if (results.settingsDeletionSuccessful == false){

                    resultObject.message = "Account deletion failed"

                    resolve(resultObject)
                }
    
            }catch(e){
    
                resultObject.message = "Account deletion failed"
                resolve(resultObject)
    
            }
        })
    }      

    static checkAPIKey = async ()=>{

        return new Promise(async(resolve, reject)=>{

            const resultObject = {
                APIKeyExists: false,
                message: ""
            };

            try{
    
                /* delete user profile */
                let usersDetailsRaw = await EncryptedStorage.getItem('users')
    
                let usersDetails = JSON.parse(usersDetailsRaw);

                const keys = Object.keys(usersDetails);

                //Check that API key exists



                if(keys.includes("api-key")){
                    /* Check if inputted password matches password in database */

                    const APIKey = usersDetails["api-key"];

                    if(!APIKey){

                        resultObject.APIKeyExists = false;
                        resultObject.message = "No API key exists. Generating API key";

                        resolve(resultObject);
                        return

                    } else if (APIKey) {

                        resultObject.APIKeyExists = true;
                        resultObject.message = "API key exists";

                        resolve(resultObject);
                        return

                    }

                }else{

                    /* Else resolve promise here with password match error */

                    resultObject.message = "No API key exists"
                    resolve(resultObject);
                }

            }catch(e){
    
                resultObject.message = "Error checking API Key" + JSON.stringify(e);
                reject(resultObject)
    
            }
        })
    }     
    
    static getAPIKey = async ()=>{

        return new Promise(async(resolve)=>{

            const resultObject = {
                APIKey: "",
                message: ""
            };

            try{
    
                /* delete user profile */
                let usersDetailsRaw = await EncryptedStorage.getItem('users')
    
                let usersDetails = JSON.parse(usersDetailsRaw);

                //Check that API key exists

                if("api-key" in Object.keys(usersDetails)){
                    /* Check if inputted password matches password in database */

                    const APIKey = usersDetails["api-key"];

                    if(!APIKey){

                        resultObject.APIKey = "";
                        resultObject.message = "No API key exists";

                        resolve(resultObject);

                    } else {

                        resultObject.APIKey = APIKey;
                        resultObject.message = "API key exists";

                        resolve(resultObject);

                    }

                }else{

                    /* Else resolve promise here with password match error */

                    resultObject.message = "Passwords do not match"
                    resolve(resultObject)
                }

            }catch(e){
    
                resultObject.message = "No API key exists"
                resolve(resultObject)
    
            }
        })
    }     
}

export default AppLoginDetails