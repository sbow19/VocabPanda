/* eslint-disable */

import SQLite from 'react-native-sqlite-storage'

class LocalDatabase {

    constructor(){

    }


    static createTestDatabase = ()=>{

        return new Promise(async (resolve, reject)=>{

            let database = await SQLite.openDatabase({
                name: "player.db",
                location: "default"
            },
            e=>{
                console.log("Open successful")
                console.log(e)
            },
            e=>{
                console.log("Open unsuccessful")
                reject(e)
            })
    
            

            resolve(database)


        })
    }
}

export default LocalDatabase;