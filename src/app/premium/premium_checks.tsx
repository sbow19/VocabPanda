/* eslint-disable */

import LocalDatabase from "app/database/local_database"
import * as types from '@customTypes/types.d'
import UserContent from "app/database/user_content"

class PremiumChecks extends LocalDatabase {

    static checkProjectLength = (username: string, projectName:string , appSettings: types.AppSettingsObject) : Promise<types.ProjectLengthResponseObject>=>{

        const responseObject = {
            upgradeNeeded: false,
            reason: "",
        }

        return new Promise(async(resolve)=>{

            try{

                const resultArray = await UserContent.getProjectEntries(username, projectName);

                const resultArrayLength = resultArray.length
    
                if(resultArrayLength >= 50){
                    responseObject.reason = "50 Limit"
                    resolve(responseObject)
                } else
                if(resultArrayLength >= 20 && !appSettings.premium.premium){
                    responseObject.upgradeNeeded = true
                    responseObject.reason = "20 Limit"
                    resolve(responseObject)
                } else 
                if(resultArrayLength < 20){
                    resolve(responseObject)
                }

            }catch(e){}

 
        })
    }

}

export default PremiumChecks