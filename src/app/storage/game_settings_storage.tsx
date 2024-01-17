/* eslint-disable */

import AsyncStorage from '@react-native-async-storage/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage/lib/typescript/EncryptedStorage';
import FlashMessage from 'react-native-flash-message';

/* Game settings class object */
class GameSettings {

    constructor(){

    }

    static async newSettings(userName: string){

        return new Promise(async(resolve,reject)=>{

            try{
                const allGameSettingsRaw = await AsyncStorage.getItem('allDefaultSettings');

                const allGameSettings =  JSON.parse(allGameSettingsRaw)

                console.log(allGameSettings)

                if(allGameSettings[userName]){
    
                    /* If game settings already exists */
                    resolve("User exists")
    
                } else if (!allGameSettings[userName]) {
    
                    /* Class */

                    allGameSettings[userName] = {}

                    allGameSettings[userName].timerOn = false
                    allGameSettings[userName].noOfTurns = 10


                    const stringifiedSettings = JSON.stringify(allGameSettings)
    
                    await AsyncStorage.setItem('allDefaultSettings', stringifiedSettings)

                    resolve("User does not exist")
                }
    
            } catch(e){
                
                let newGame = JSON.stringify({})

                await AsyncStorage.setItem("allDefaultSettings", newGame)
                reject("No user settings")
            }
        })
       
    }

    static async setDefaultSettings(newGameSettings: {timerOn:boolean, noOfTurns:number}, userName: string){

        try{
            const gameSettingsRaw = await AsyncStorage.getItem('allDefaultSettings')

            const gameSettings = JSON.parse(gameSettingsRaw)

            
            gameSettings[userName].timerOn = newGameSettings.timerOn
            gameSettings[userName].noOfTurns = newGameSettings.noOfTurns

            const finalGameSettings = JSON.stringify(gameSettings)

            
            await AsyncStorage.setItem('allDefaultSettings', finalGameSettings)
        } catch (e){
            console.log(e)
        }
    } 

    static async getDefaultSettings(userName: string){

        try{

            const gameSettingsRaw = await AsyncStorage.getItem('allDefaultSettings');

            const gameSettings = JSON.parse(gameSettingsRaw)

            return gameSettings[userName]
        } catch (e){
            console.log(e)
        }
    } 
}


export default GameSettings