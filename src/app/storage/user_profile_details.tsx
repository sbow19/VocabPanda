/* eslint-disable */

import EncryptedStorage from "react-native-encrypted-storage";

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
    }

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
    }

    static setInitial = ()=>{

        return new Promise(async(resolve, reject)=>{

            try{

                let usersDetailsRaw = await EncryptedStorage.getItem('users')
    
                if(!usersDetailsRaw){
    
                    let usersDetails = {}
                    await EncryptedStorage.setItem('users',
                    
                    JSON.stringify(usersDetails)
                    )

                    resolve(null)
                }
            
                resolve(null)
            }catch(e){
                console.log(e)
                resolve(e)
            }



        })

        /* Check whether there is a users object set in storage. If not, then add to users object to storage*/

        
    }
      
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
       
}

export default AppLoginDetails