/* eslint-disable */

import LocalDatabase from "app/database/local_database"
import * as types from '@customTypes/types.d'
import UserContent from "app/database/user_content"

class PremiumChecks extends LocalDatabase {

    static checkProjectLength = (userId: string, projectName:string , appSettings: types.AppSettingsObject) : Promise<types.ProjectLengthResponseObject>=>{

        return new Promise(async(resolve, reject)=>{

            const responseObject: types.ProjectLengthResponseObject = {
                upgradeNeeded: false,
                reason: "",
            }

            try{

                const resultArray = await UserContent.getProjectEntries(userId, projectName);

                const resultArrayLength = resultArray.length;
    
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

            }catch(e){
                //Some error while checking project length
                reject(e);
            }

 
        })
    }

}

export default PremiumChecks