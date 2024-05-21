/*
    eslint-disable
*/

import axios from 'axios';
import axiosRetry from 'axios-retry';
import NetInfo from "@react-native-community/netinfo";
import BufferManager from './buffer';
import * as types from '@customTypes/types.d'

const axiosConfig = (bufferFlushingStatus: boolean)=>{
    // Set base URL if your API endpoints share a common base URL
    axios.defaults.baseURL = 'http://192.168.1.171:3000';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.bufferStatus = bufferFlushingStatus;


    //Set default timeout to 5 seconds
    axios.defaults.timeout = 10000;

    //Add interceptors to ensure that networking and buffers are handled correctly
    axios.interceptors.request.use(
    async (config)=>{

        try{


            const urls = [
                "/account/createaccount",
                "/account/deleteaccount",
                "/account/updatepassword",
                "/generateapikey"
             ] ;

            //Check if there is an internet connection
            const internetStatus = await NetInfo.fetch();

            if(urls.includes(config.url)){
                //If the buffer is flushing, then create/delete/update password cannot be queued. Create account must occur while no buffer operations are taking place.

                return config

            }
            else if(!internetStatus.isInternetReachable && !axios.defaults.bufferStatus){
                
                const requestData = config.data;

                //Add to main queue if retry not processed.
                if(!config.__storageProcessed){

                    await BufferManager.storeRequestMainQueue(config.url, requestData);

                    //Set storage processed flag
                    config.__storageProcessed = true;
                }
                
                return config

            } 
            else if (internetStatus.isInternetReachable && axios.defaults.bufferStatus){


                const requestData = config.data;

                //Add to secondary buffer if retry not processed

                if(!config.__storageProcessed){

                    await BufferManager.storeRequestSecondaryQueue(config.url, requestData);

                    //Set storage processed flag
                    config.__storageProcessed = true;

                }            

                return config;

            }

            //Carries on with request
            return config

        }catch(APIOperationResponse){

            throw APIOperationResponse

        }
    
    },
    (APIOperationResponse)=>{
        //Store the request anyway
        console.error('Response Error:', APIOperationResponse);
        return Promise.reject(APIOperationResponse);

    });


    //Retry logic
    axiosRetry(axios, 
        { 
            retryDelay: axiosRetry.exponentialDelay,
            retries: 5,
            onMaxRetryTimesExceeded: (error)=>{

                console.log(error, "axios max retry times");
                /* Code to store request in */

            },
            retryCondition: (error) => {
                console.log('Retry condition check:', error.message);
                //If buffer is flushing then we retry
                return axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error) || bufferFlushingStatus;
            }

        }
    )

};

export default axiosConfig;