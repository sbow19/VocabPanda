/* eslint-disable */

import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage'

class LocalDatabase {

    constructor(){

    }

    static getAll = (userName: string, database: SQLiteDatabase) =>{

        return new Promise((resolve, reject)=>{


            const deleteTableQuery = `SELECT * FROM ${userName}`

            database.transaction(async(transaction)=>{

                let [_, resultArray] = await transaction.executeSql(deleteTableQuery)

                resolve(resultArray)
            },
            (error)=>{

                console.log("All data fetch filed")
                console.log(error)
                reject(error)
            },
            (success)=>{

                console.log("All data fetch success")
                resolve(success)
            })


        })



    }

    static deleteTable = (userName: string, database: SQLiteDatabase)=>{

        return new Promise(async(resolve, reject)=>{

            const deleteTableQuery = `DROP TABLE IF EXISTS ${userName}`

            database.transaction(transaction=>{

                transaction.executeSql(deleteTableQuery)
            },
            (error)=>{

                console.log("Account deletion failed")
                console.log(error)
                reject(error)
            },
            (success)=>{

                console.log("Account deletion successful")
                resolve(success)
            })
        })
    }

    static #createUserTable = (userName: string, database: SQLiteDatabase)=>{

        return new Promise(async(resolve, reject)=>{

            const openTableQuery = `CREATE TABLE IF NOT EXISTS ${userName}(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                target_language TEXT,
                target_language_lang TEXT,
                output_language TEXT, 
                output_language_lang TEXT,
                project TEXT,
                tags VARCHAR(255) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                
            );

            CREATE TRIGGER update_last_updated_at
            AFTER UPDATE ON ${userName}
            FOR EACH ROW
            BEGIN
                UPDATE ${userName} SET last_updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
            END;

            -- Add index on target_language column
            CREATE INDEX idx_target_language ON ${userName} (target_language);

            -- Add index on output_language column
            CREATE INDEX idx_output_language ON ${userName} (output_language);

            -- Add index on project column
            CREATE INDEX idx_project ON ${userName} (project);

            -- Add index on created_at column
            CREATE INDEX idx_create_at ON ${userName} (created_at);

            -- Add index on last_updated_at column
            CREATE INDEX idx_last_updated_at ON ${userName} (last_updated_at);
            
            `

            database.transaction(transaction =>{

                transaction.executeSql(openTableQuery)
            },
            (error)=>{

                console.log("Failed to create user table")
                reject(error)

            },
            (success)=>{

                console.log("User table created or already exists")
                resolve(success)
            })
        })
    }


    static createTestDatabase = ()=>{
        return new Promise(async (resolve, reject)=>{

            await SQLite.openDatabase({
                name: "player.db",
                location: "default"
            },
            e=>{
                console.log("Open successful")
                resolve(e)
            },
            e=>{
                console.log("Open unsuccessful")
                reject(e)
            })
        })
    }

    static openDatabase = async(userName: string) =>{

        let databaseObject = {
            database: {},
            currentUser: userName
        }

        return new Promise(async (resolve, reject)=>{

            await SQLite.openDatabase({

                    name: `vocabpanda.db`,
                    location: "default"
                },
                async (success)=>{

                    console.log("Database successfully opened... creating table")

                    await this.#createUserTable(userName, success).then(()=>{

                        databaseObject.database = success
                        resolve(databaseObject)

                    }).catch((e)=>{
                        console.log(e)
                        reject(e)
                    });
                },
                (error)=>{

                    console.log("Error opening database")
                    reject(error)

                }
            )

        })
    }

    static addNewEntry = async(databaseObject: {database: SQLiteDatabase, userName: string}, entryObject: {input: string, inputLang: string, output: string, outputLang: string, project: string})=>{

        return new Promise(async(resolve, reject)=>{

            databaseObject.database.transaction(transaction=>{

                let userName  = databaseObject.currentUser

                const executeAddQuery = `

                    INSERT INTO ${userName} (target_language, target_language_lang, output_language, output_language_lang, project) VALUES (?,?,?,?,?)
                
                `
                transaction.executeSql(executeAddQuery, [entryObject.input, entryObject.inputLang, entryObject.output, entryObject.outputLang, entryObject.project])

            },
            error=>{
                reject(error)
            },
            success=>{

                console.log("Insert into table success")
                resolve(success)
            })
        })
    }

    static getProjectEntries = async(databaseObject: {database: SQLiteDatabase, userName: string}, projectName: string) =>{

        return new Promise ((resolve, reject)=>{

            databaseObject.database.transaction(async(transaction)=>{

                let userName = databaseObject.currentUser

                const getProjectSQLQuery = `
                
                    SELECT * FROM ${userName} WHERE project = '${projectName}'
                
                `

                let [_, resultArray] = await transaction.executeSql(getProjectSQLQuery)

                resolve(resultArray)

            },
            error=>{
                reject(error)
            },
            success=>{

                console.log("Project fetch was a success")
            })

        })

    }

    static deleteProject= (userName: string, database: SQLiteDatabase, project: string)=>{

        return new Promise(async(resolve, reject)=>{

            const deleteProjectQuery = `DELETE FROM ${userName} WHERE project='${project}'`

            database.transaction(transaction=>{

                transaction.executeSql(deleteProjectQuery)
            },
            (error)=>{

                console.log("Project deletion failed")
                console.log(error)
                reject(error)
            },
            (success)=>{

                console.log("Project deletion successful")
                resolve(success)
            })
        })
    }

    static deleteEntry = (userName: string, database: SQLiteDatabase, entryId: string)=>{

        return new Promise(async(resolve, reject)=>{

            const deleteEntryQuery = `DELETE FROM ${userName} WHERE id='${entryId}'`

            database.transaction(transaction=>{

                transaction.executeSql(deleteEntryQuery)
            },
            (error)=>{

                console.log("Entry deletion failed")
                console.log(error)
                reject(error)
            },
            (success)=>{

                console.log("Entry deletion successful")
                resolve(success)
            })
        })
    }

    static searchTerm = (userName: string, database: SQLiteDatabase, searchString: string)=>{

        return new Promise((resolve, reject)=>{

            const searchQuery = `
            SELECT * FROM ${userName} 
            WHERE 
                (target_language LIKE '${searchString}%' OR 
                target_language LIKE '%${searchString}%' OR 
                target_language LIKE '%${searchString}') OR
                (output_language LIKE '${searchString}%' OR 
                output_language LIKE '%${searchString}%' OR 
                output_language LIKE '%${searchString}')
        `;

            database.transaction(async(transaction)=>{


            let [_, resultArray] = await transaction.executeSql(searchQuery)

            resolve(resultArray)

            },
            error=>{
                reject(error)
            },
            success=>{

                console.log("Project fetch was a success")
            })

        })

    }
}

export default LocalDatabase;