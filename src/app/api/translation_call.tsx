/* eslint-disable */

import { languageObject } from "app/types/types.d";

class DeeplTranslate{

    //No constructor necessary

    constructor(){};

    static #changeLanguageValue(target_lang: string, output_lang:string){

        let languageObject: languageObject = {
            Bulgarian: "BG",
            Czech: "CS",
            Danish: "DA",
            Greek: "EL",
            Estonian: "ET",
            Finnish: "FI",
            French: "FR",
            Hungarian: "HU",
            Indonesian: "ID",
            Italian: "IT",
            Japanese: "JA",
            Korean: "KO",
            Lithuanian: "LT",
            Latvian: "LV",
            Norwegian: "NB",
            Dutch: "NL",
            Polish: "PL",
            Portuguese: "PT",
            Romanian: "RO",
            Russian: "RU",
            Slovak: "SK",
            Slovenian: "SL", 
            Swedish: "SV",
            Turkish: "TR",
            Ukrainian: "UK",
            Chinese: "ZH",
            Spanish: "ES",
            English: "EN",
            German: "DE"
        };

        let target_language_id = languageObject[`${target_lang}`];
        let output_language_id = languageObject[`${output_lang}`];

        return [target_language_id, output_language_id]
    }


    static async translate(searchTerms: {targetText: string, targetLanguage: string, outputLanguage: string}){

        return new Promise(async(resolve, reject)=>{


            let [target_language_id, output_language_id] = this.#changeLanguageValue(searchTerms.targetLanguage, searchTerms.outputLanguage);

            let requestOptions = {

                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    source_lang: target_language_id,
                    target_lang: output_language_id,
                    text: searchTerms.targetText

                })
            };

            try{
                let apiResponse = await fetch('http://149.100.159.55:3000/api', requestOptions);
                
                let response = await apiResponse.json();


                //return translation which was nested in the returned response object
                resolve(response.translations[0]);
        
            }catch (error) {
                console.error(error);
                reject(error);
            }
        })
    }
};

export default DeeplTranslate;