/* eslint-disable */

import * as types from '@customTypes/types.d'
import LocalDatabase from 'app/database/local_database'

class GameLogic {

    constructor(gameSettings: types.GameSettingsObject, userName: string, databaseObject, resultArrayParam: Array<any>){

        /* Turn timer on? */
        this.timerOn = gameSettings.timerOn

        /* Game mode */
        this.gameMode = gameSettings.gameMode

        /* No of turns */
        this.noOfTurns = gameSettings.noOfTurns

        /* Set game project */
        this.project = gameSettings.project

        /* Set username */
        this.userName = userName

        /* Set database Object */

        this.databaseObject = databaseObject

        /* Set result array */
        
        this.resultArray = resultArrayParam
    }

    resultArray: Array<any> = [];
    gameArray: Array<any> = [];
    currentPoints = 0;
    lastRoundScore = 0;
    lastRoundAnswer = "";
    turnNumber = 1;
    turnType = "target"
    gameFinished = false

    timerOn = false
    gameMode = "All Words"
    noOfTurns = 10
    project = ""
    userName = ""
    databaseObject = {}

    fetchArray = async()=>{
        return new Promise(async(resolve, reject)=>{

            if(this.gameMode === "By Project"){

                let resultArray = await LocalDatabase.getProjectEntries(this.databaseObject, this.project)

                this.resultArray = resultArray

                /* randomises result array and returns game array of no of turns length */

                let gameArray = await this.#setGameArray(resultArray)

                this.gameArray = gameArray

                resolve(gameArray)
            } else

            if(this.gameMode === "Search Results"){

                /* Result array already provided in gameSettings argument */

                let gameArray = await this.#setGameArray(this.resultArray)

                this.gameArray = gameArray

                resolve(gameArray)

            } else 

            if(this.gameMode === "Latest Activity"){

                /* Result array already provided in gameSettings argument */

                let gameArray = await this.#setGameArray(this.resultArray)


                this.gameArray = gameArray

                resolve(gameArray)

            } else 

            if(this.gameMode === "All Words"){

                /* Randomly ident */

                let resultArray = await LocalDatabase.getAll(this.userName, this.databaseObject.database)

                this.resultArray = resultArray

                /* randomises result array and returns game array of no of turns length */

                let gameArray = await this.#setGameArray(resultArray)

                this.gameArray = gameArray

                resolve(gameArray)
            } else

            if(this.gameMode === "Latest Activity - By Project"){

                /* Result array already provided in gameSettings argument */

                let gameArray = await this.#setGameArray(this.resultArray)


                this.gameArray = gameArray

                resolve(gameArray)


            }

            reject("Nothing")
        })
    }

    #setGameArray = async(resultArray: Array<any>)=>{

        return new Promise((resolve, reject)=>{

            let randomisedArray = []
            let filteredArray = []
            let resultArrayLength = resultArray.length

            
            for(let i=0; i< resultArrayLength ; i++){

                filteredArray.push(resultArray[i])

            }

            if(resultArrayLength < this.noOfTurns){
                
                this.noOfTurns = resultArrayLength
            }


            for(let i = 0 ; i < resultArrayLength && i < this.noOfTurns ; i++){

                let filteredArrayLength = filteredArray.length
                let randomNum = Math.floor((Math.random() * filteredArrayLength))


                randomisedArray.push(filteredArray[randomNum])

                filteredArray.splice(randomNum, 1)

            }

            resolve(randomisedArray)
        })


    }

    getTurnTime = () =>{
    

        let currentTurnContent = this.gameArray[this.turnNumber - 1]

        if(this.turnType === "target"){

            if(currentTurnContent.target_language.length < 10){

                return 10
            } else if(currentTurnContent.target_language.length >= 10 && currentTurnContent.target_language.length < 20){

                return 15
            } else if (currentTurnContent.target_language.length >= 20){

                return 20
            }
            
        } else if (this.turnType === "output"){

            
            if(currentTurnContent.output_language.length < 10){

                return 10
            } else if(currentTurnContent.output_language.length >= 10 && currentTurnContent.output_language.length < 20){

                return 15
            } else if (currentTurnContent.output_language.length >= 20){

                return 20
            }

        }
    }

    setTurnType = ()=>{

        let turnType;

        let randomNum = Math.floor(Math.random() * 1.99);

        if(randomNum === 1){
            turnType = "target"
        } else if (randomNum === 0)[

            turnType = "output"
        ]

        /* Sets turn type */
        this.turnType = turnType


        return turnType

    }

    checkAnswer = (inputString: string, answerString: string,  timeLeft: number|null)=>{


        this.lastRoundAnswer = answerString;

        let correctScoreBase: number = 0;
        let timerScore: number = 0; 

        let pointsSchema = {
            chars5: 50, // If output word is up to 5 characters long, then max of 50 points
            chars10: 100, // If output word is up to 10 characters long, then max of 100 points
            chars15: 150, // If output word is up to 15 characters long, then max of 150 points
            chars20: 200, // If output word is up to 20 characters long, then max of 200 points
            chars25: 250, // If output word is up to 25 characters long, then max of 250 points
        };

        /* Code to determine the base match score between user input and answer string */

        let inputStringCleaned = inputString.trim(); //Remove trailing whitespace from user input
        let answerStringCleaned = answerString.trim(); // Remove trailing whitespace from  answer

        let inputStringArray = inputStringCleaned.split('') // Convert input string to array of characters
        let answerStringArray = answerStringCleaned.split('') // convert answers string to array of characters
        let answerStringLength = answerString.length
        let inputStringLength = inputString.length
        let matchScore: number = 0; 

        /* We iterate over the input string length to check whether each element matches each element of the answer string array. */

        for(let i=0 ; i<inputStringLength ; i++){

            if(inputStringArray[i] === answerStringArray[i]){
                matchScore += 1 
            }        
        }

        /* With the match score, we calculate as a percentage the match between the two strings */

        let matchScorePercentageFraction = matchScore/answerStringLength

        let matchScorePercentage = Math.round(matchScorePercentageFraction * 100)

        /*
            The points system works as such:
                100% match awards full marks, according to the points schema
                75% match and above awards 3/4 marks, according to the points schema
                66% - 74% match awards 2/3 marks 
                66% and less awards no marks

        */

                /* Determine full marks amount based on answer strng length */

        let fullMarks: number = 0;

        if(answerStringLength >= 21){
            fullMarks = pointsSchema.chars25
        } else 
        if(answerStringLength <= 20 && answerStringLength >=16){
            fullMarks = pointsSchema.chars20
        } else
        if(answerStringLength <= 15 && answerStringLength >=11){
            fullMarks = pointsSchema.chars15
        } else 
        if(answerStringLength <= 10 && answerStringLength >=6){
            fullMarks = pointsSchema.chars10
        } else
        if(answerStringLength <= 5){
            fullMarks = pointsSchema.chars5
        } 

        /* Determine actual score base */

        if(matchScorePercentage === 100){
            correctScoreBase = fullMarks
        } else
        if(matchScorePercentage <= 99 && matchScorePercentage >= 75){
            correctScoreBase = Math.round(fullMarks * 0.75)
        } else
        if(matchScorePercentage <= 74 && matchScorePercentage >= 66){

            correctScoreBase = Math.round(fullMarks * 0.66)
        }


        /* If the user selected a timer mode, then score is multiplied by time left */
        if(typeof timeLeft === "number"){

            timerScore = correctScoreBase * timeLeft
            this.lastRoundScore = timerScore

            return timerScore
        } else {

            this.lastRoundScore = correctScoreBase

            return correctScoreBase
        }
    }
}

export default GameLogic;