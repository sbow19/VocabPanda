/* eslint-disable */

import LocalDatabase from "app/database/local_database"

class PremiumChecks {

    constructor(){

    }

    static checkProjectLength = (databaseObject, projectName, appSettings)=>{

        let responseObject = {
            upgrade: false,
            reason: "",
        }

        return new Promise(async(resolve)=>{

            let resultArray = await LocalDatabase.getProjectEntries(databaseObject, projectName);

            let resultArrayLength = resultArray.length

            if(resultArrayLength >= 50){
                responseObject.reason = "50 Limit"
                resolve(responseObject)
            } else
            if(resultArrayLength >= 20 && !appSettings.premium.premium){
                responseObject.upgrade = true
                responseObject.reason = "20 Limit"
                resolve(responseObject)
            } else 
            if(resultArrayLength < 20){
                resolve(responseObject)
            }
        })
    }

}

export default PremiumChecks