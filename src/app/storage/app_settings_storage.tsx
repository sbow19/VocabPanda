/* eslint-disable */

import AsyncStorage from '@react-native-async-storage/async-storage'

import * as types from '@customTypes/types.d'
import PremiumChecks from 'app/premium/premium_checks';

/* App settings class object */
class AppSettings {

    constructor(){

    }

    static async upgradeToPremium(userName: string, endTime: string){

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
                        translationsLeft: 120,
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
}

    static async downgradeToFree(userName: string){

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
}

    static async newSettings(userName: string){

        return new Promise(async(resolve,reject)=>{

            try{
                const allAppSettingsRaw = await AsyncStorage.getItem('allDefaultSettings');

                const allAppSettings =  JSON.parse(allAppSettingsRaw)

                if(allAppSettings[userName]){
    
                    /* If app settings already exists on user, just add login time and resolve promise */
                    
                    allAppSettings[userName].lastLoggedIn = new Date() //Set logged in time
            
                    const stringifiedSettings = JSON.stringify(allAppSettings)
    
                    await AsyncStorage.setItem('allDefaultSettings', stringifiedSettings)

                    resolve("User exists")
    
                } else if (!allAppSettings[userName]) {
    
                    /* If no app settings exist on user, set default settings on user */

                    allAppSettings[userName] = {} //Create new settings object on user

                    allAppSettings[userName].gameSettings = {
                        timerOn: false,
                        noOfTurns: 10
                    } // Set default game settings

                    allAppSettings[userName].dropDownLanguages = {
                        targetLanguage: "English",
                        outputLanguage: "English"
                    } // Set default target and output languages, which appear on translation dropdowns

                    allAppSettings[userName].projects = [] // Set empty projects list

                    /* Set logged in time */
                    allAppSettings[userName].lastLoggedIn = new Date()

                    /*Set premium details*/
                    allAppSettings[userName].premium = {
                        premium: false,
                        endTime: "",
                    }

                    /* Games left */
                    allAppSettings[userName].gamesLeft = {
                        gamesLeft: 10,
                        refreshBaseTime: "",
                        refreshNeeded: false
                    }

                    /* Translations left */
                    allAppSettings[userName].translationsLeft = {
                        translationsLeft: 40,
                        refreshBaseTime: "",
                        refreshNeeded: false
                    }

                    const stringifiedSettings = JSON.stringify(allAppSettings)
    
                    await AsyncStorage.setItem('allDefaultSettings', stringifiedSettings)

                    resolve("User does not exist")
                }
    
            } catch(e){

                /* When app first loaded, object set in storage marked to contain app settings */
                
                let newGame = JSON.stringify({})

                await AsyncStorage.setItem("allDefaultSettings", newGame)
                reject("No user settings")
            }
        })
       
    }

    static async getLastLoggedInDate(userName: string){
        return new Promise(async(resolve,reject)=>{

            try{
                const allAppSettingsRaw = await AsyncStorage.getItem('allDefaultSettings');

                const allAppSettings =  JSON.parse(allAppSettingsRaw)

                const lastLoggedIn = allAppSettings[userName].lastLoggedIn

                resolve(lastLoggedIn)
            } catch(e){
                reject(e)
            }
        })

    }

    static async setDefaultSettings(userName: string, settingsObject:types.AppSettingsObject)
    
    {

        if(settingsObject.gameSettings){
            try{
                const appSettingsRaw = await AsyncStorage.getItem('allDefaultSettings')
    
                const appSettings = JSON.parse(appSettingsRaw)
    
                
                appSettings[userName].gameSettings.timerOn = settingsObject.gameSettings.timerOn
                appSettings[userName].gameSettings.noOfTurns = settingsObject.gameSettings.noOfTurns
    
                const finalAppSettings = JSON.stringify(appSettings)
    
                
                await AsyncStorage.setItem('allDefaultSettings', finalAppSettings)
            } catch (e){
                console.log(e)
            }
        }

        if(settingsObject.dropDownLanguages){

            try{
                const appSettingsRaw = await AsyncStorage.getItem('allDefaultSettings')
    
                const appSettings = JSON.parse(appSettingsRaw)

                appSettings[userName].dropDownLanguages.targetLanguage = settingsObject.dropDownLanguages.targetLanguage

                appSettings[userName].dropDownLanguages.outputLanguage = settingsObject.dropDownLanguages.outputLanguage
    
                const finalAppSettings = JSON.stringify(appSettings)

    
                
                await AsyncStorage.setItem('allDefaultSettings', finalAppSettings)
            } catch (e){
                console.log(e)
            }
        }
    
    } 

    static setGamesLeftDetails(userName: string, appSettings){

        return new Promise(async(resolve, reject)=>{

            try{

                const appSettingsRaw = await AsyncStorage.getItem('allDefaultSettings');
    
                const appSettings = JSON.parse(appSettingsRaw)

                /* Check game details */

                if(!appSettings[userName].gamesLeft.refreshNeeded){

                    appSettings[userName].gamesLeft.refreshNeeded = true

                    let newStartTime = new Date()

                    appSettings[userName].gamesLeft.refreshBaseTime = newStartTime
                }

                appSettings[userName].gamesLeft.gamesLeft -= 1

                const stringifiedSettings = JSON.stringify(appSettings)

                await AsyncStorage.setItem('allDefaultSettings', stringifiedSettings)

                resolve(appSettings[userName])

            } catch(e){

                reject(e)
            }
        })
    }

    static refreshGamesLeft(userName: string, appSettings){

        return new Promise(async(resolve, reject)=>{

            try{

                const appSettingsRaw = await AsyncStorage.getItem('allDefaultSettings');
    
                const appSettings = JSON.parse(appSettingsRaw)

                /* Check game details */

                if(appSettings[userName].gamesLeft.refreshNeeded){

                    appSettings[userName].gamesLeft.refreshNeeded = false

                    
                }

                appSettings[userName].gamesLeft = {

                    gamesLeft: 10,
                    refreshBaseTime: "",
                    refreshNeeded: false
                    
                }

                const stringifiedSettings = JSON.stringify(appSettings)

                await AsyncStorage.setItem('allDefaultSettings', stringifiedSettings)

                resolve(appSettings[userName])

            } catch(e){

                reject(e)
            }
        })
    }

    static setTranslationsLeftDetails(userName: string, appSettings){

        return new Promise(async(resolve, reject)=>{

            try{

                const appSettingsRaw = await AsyncStorage.getItem('allDefaultSettings');
    
                const appSettings = JSON.parse(appSettingsRaw)

                /* Check game details */

                if(!appSettings[userName].translationsLeft.refreshNeeded){

                    appSettings[userName].translationsLeft.refreshNeeded = true

                    let newStartTime = new Date()

                    appSettings[userName].translationsLeft.refreshBaseTime = newStartTime

                }

                appSettings[userName].translationsLeft.translationsLeft -= 1

                const stringifiedSettings = JSON.stringify(appSettings)

                await AsyncStorage.setItem('allDefaultSettings', stringifiedSettings)

                resolve(appSettings[userName])

            } catch(e){

                reject(e)
            }
        })
    }

    static refreshTranslationsLeft(userName: string, appSettings){

        return new Promise(async(resolve, reject)=>{

            try{

                const appSettingsRaw = await AsyncStorage.getItem('allDefaultSettings');
    
                const appSettings = JSON.parse(appSettingsRaw)

                /* Check game details */

                if(appSettings[userName].translationsLeft.refreshNeeded){

                    appSettings[userName].translationsLeft.refreshNeeded = false
                    
                }

                if(appSettings.premium.premium){

                    appSettings[userName].translationsLeft = {
                        translationsLeft: 150,
                        refreshBaseTime: "",
                        refreshNeeded: false
                    }
                    
                } else
                if(!appSettings.premium.premium){

                    appSettings[userName].translationsLeft = {
                        translationsLeft: 40,
                        refreshBaseTime: "",
                        refreshNeeded: false
                    }

                }

                const stringifiedSettings = JSON.stringify(appSettings)

                await AsyncStorage.setItem('allDefaultSettings', stringifiedSettings)

                resolve(appSettings[userName])

            } catch(e){

                reject(e)
            }
        })
    }

    static getDefaultAppSettings(userName: string){

        return new Promise(async(resolve, reject)=>{

            try{

                const appSettingsRaw = await AsyncStorage.getItem('allDefaultSettings');
    
                const appSettings = JSON.parse(appSettingsRaw)
    
                resolve(appSettings[userName])
            } catch (e){
                reject(e)
            }
        })
    }

    static addProject(userName: string, project: types.ProjectObject){

        return new Promise(async(resolve, reject)=>{

            try{

                const appSettingsRaw = await AsyncStorage.getItem('allDefaultSettings');
    
                const appSettings = JSON.parse(appSettingsRaw)

                appSettings[userName].projects.push(project)

                const newAppSettings = JSON.stringify(appSettings)

                await AsyncStorage.setItem('allDefaultSettings', newAppSettings)
    
                resolve(appSettings[userName])
            } catch (e){
                reject(e)
            }
        })
    }

    static deleteProject(userName: string, project: string){

        return new Promise(async(resolve, reject)=>{

            try{

                const appSettingsRaw = await AsyncStorage.getItem('allDefaultSettings');
    
                const appSettings = JSON.parse(appSettingsRaw)

                const newList = appSettings[userName].projects.filter(item => item?.projectName !== project);


                appSettings[userName].projects = newList

                const newAppSettings = JSON.stringify(appSettings)

                await AsyncStorage.setItem('allDefaultSettings', newAppSettings)

                /*  Return new object reference */

                const newAppDetails = {...appSettings[userName]}
    
                resolve(newAppDetails)
            } catch (e){
                reject(e)
            }


        })
    }

    static deleteUserSettings(userName: string){

        return new Promise(async(resolve)=>{

            let resultObject = {
                username : userName,
                settingsDeletionSuccessful: false
            }
    
            try{
    
                const gameSettingsRaw = await AsyncStorage.getItem('allDefaultSettings');
    
                const gameSettings = JSON.parse(gameSettingsRaw)
    
                delete gameSettings[userName]
    
                let newGameSettings = JSON.stringify(gameSettings)
    
                await AsyncStorage.setItem('allDefaultSettings', newGameSettings)
    
                resultObject.settingsDeletionSuccessful = true
    
                resolve(resultObject)
            } catch (e){
    
                resolve(resultObject)
            }
        })    
    }
}



export default AppSettings