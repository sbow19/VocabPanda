/* eslint-disable */

const SQLStatements = {

    databaseSchema: {

        USERS: `CREATE TABLE IF NOT EXISTS "users" (

            "id" TEXT NOT NULL,
            "username" TEXT NOT NULL,
            "email" TEXT NOT NULL,
            "password_hash" TEXT NULL DEFAULT NULL,
          
            PRIMARY KEY ("id"),
            UNIQUE ("username") ,
            UNIQUE ("email")
        )
          ;
          
          CREATE INDEX IF NOT EXISTS "id_index" ON "users" ("id");
        CREATE INDEX IF NOT EXISTS "username_index" ON "users" ("username");
        CREATE INDEX IF NOT EXISTS "email_index" ON "users" ("email");`,

        TEST_FETCH: `SELECT * FROM "users";`
        ,
        
        USER_DETAILS: `CREATE TABLE IF NOT EXISTS "user_details" (
            "username" TEXT NOT NULL,
            "user_id" TEXT NULL DEFAULT NULL,
            "last_logged_in" DATETIME NOT NULL,
            "premium" TINYINT NOT NULL,
            PRIMARY KEY ("username"),
          
            CONSTRAINT "user_details_fk_2"
              FOREIGN KEY ("user_id")
              REFERENCES "users" ("id")
              ON DELETE CASCADE,
          
            CONSTRAINT "user_details_ibfk_1"
              FOREIGN KEY ("username")
              REFERENCES "users" ("username")
              ON DELETE CASCADE)
          ;`
        ,
        
        USER_SETTINGS: `CREATE TABLE IF NOT EXISTS "user_settings" (
            "user_id" TEXT NOT NULL,
            "timer_on" TINYINT NOT NULL,
            "slider_val" INT NOT NULL,
            "target_lang" TEXT NOT NULL,
            "output_lang" TEXT NOT NULL,
            "default_project" TEXT NULL DEFAULT NULL,
            PRIMARY KEY ("user_id"),
          
            CONSTRAINT "user_settings_ibfk_1"
              FOREIGN KEY ("user_id")
              REFERENCES "users" ("id")
              ON DELETE CASCADE)
          ;`,

        PROJECTS: `CREATE TABLE IF NOT EXISTS "projects" (
            "user_id" TEXT NOT NULL,
            "project" TEXT NOT NULL,
            "target_lang" TEXT NULL DEFAULT NULL,
            "output_lang" TEXT NULL DEFAULT NULL,
            PRIMARY KEY ("user_id", "project"),
            CONSTRAINT "projects_ibfk_1"
              FOREIGN KEY ("user_id")
              REFERENCES "users" ("id")
              ON DELETE CASCADE)
          ;`,

        TRANSLATIONS_LEFT: `CREATE TABLE IF NOT EXISTS "translations_left" (
            "user_id" TEXT NOT NULL,
            "translations_left" INT NOT NULL,
            PRIMARY KEY ("user_id"),
            CONSTRAINT "translations_left_ibfk_1"
              FOREIGN KEY ("user_id")
              REFERENCES "users" ("id")
              ON DELETE CASCADE)
          ;`, 

        PLAYS_LEFT: `CREATE TABLE IF NOT EXISTS "plays_left" (
            "user_id" TEXT NOT NULL,
            "plays_left" INT NULL DEFAULT NULL,
            PRIMARY KEY ("user_id"),
            CONSTRAINT "plays_left_ibfk_1"
              FOREIGN KEY ("user_id")
              REFERENCES "users" ("id")
              ON DELETE CASCADE
          );`,
        
        NEXT_PLAYS_REFRESH: `CREATE TABLE IF NOT EXISTS "next_plays_refresh" (
            "user_id" TEXT NOT NULL,
            "game_refresh" DATETIME NULL DEFAULT NULL,
            PRIMARY KEY ("user_id"),
            CONSTRAINT "next_plays_refresh_ibfk_1"
              FOREIGN KEY ("user_id")
              REFERENCES "users" ("id")
              ON DELETE CASCADE)
          ;`,
        
        NEXT_TRANSLATIONS_REFRESH: `CREATE TABLE IF NOT EXISTS "next_translations_refresh" (
            "user_id" TEXT NOT NULL,
            "translations_refresh" DATETIME NULL DEFAULT NULL,
            PRIMARY KEY ("user_id"),
            CONSTRAINT "next_translations_refresh_ibfk_1"
              FOREIGN KEY ("user_id")
              REFERENCES "users" ("id")
              ON DELETE CASCADE)
          ;`,

        USER_ENTRIES: `CREATE TABLE IF NOT EXISTS "user_entries" (
            "user_id" TEXT NULL DEFAULT NULL,
            "username" TEXT NULL DEFAULT NULL,
            "entry_id" TEXT NOT NULL,
            "target_language_text" TEXT NULL DEFAULT NULL,
            "target_language" TEXT NULL DEFAULT NULL,
            "output_language_text" TEXT NULL DEFAULT NULL,
            "output_language" TEXT NULL DEFAULT NULL,
            "tags" TINYINT NOT NULL,
            "created_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            "project" TEXT NULL DEFAULT NULL,
          
            PRIMARY KEY ("entry_id"),
          
            UNIQUE ("entry_id") ,
            UNIQUE ("user_id", "target_language_text", "target_language", "output_language"),
          
            CONSTRAINT "user_entries_ibfk_1"
              FOREIGN KEY ("user_id")
              REFERENCES "users" ("id")
              ON DELETE CASCADE,
          
            CONSTRAINT "user_entries_ibfk_2"
              FOREIGN KEY ("user_id" , "project")
              REFERENCES "projects" ("user_id" , "project")
              ON DELETE CASCADE
              ON UPDATE CASCADE)
          ;
          
          -- Create a trigger to update updated_at timestamp
            CREATE TRIGGER "update_user_entries_updated_at"
            AFTER UPDATE ON "user_entries"
            FOR EACH ROW
            BEGIN
                UPDATE "user_entries"
                SET "updated_at" = CURRENT_TIMESTAMP
                WHERE "entry_id" = NEW."entry_id";
            END;
          
          --Create index on columns
          CREATE INDEX IF NOT EXISTS "target_language_text_index" ON ("username" ASC, "target_language_text" ASC) ,
          CREATE INDEX IF NOT EXISTS "output_language_text_index" ON ("username" ASC, "output_language_text" ASC) ,
          CREATE INDEX IF NOT EXISTS "created_at_index" ON ("username" ASC, "created_at" ASC) ,
          CREATE INDEX IF NOT EXISTS "updated_at_index" ON ("username" ASC, "updated_at" ASC) ,
          CREATE INDEX IF NOT EXISTS "user_entries_ibfk_2" ON ("user_id" ASC, "project" ASC)
        
          `
          ,

        ENTRY_TAGS: `CREATE TABLE IF NOT EXISTS "entry_tags" (
        "tag_id" TEXT NOT NULL,
        "entry_id" TEXT NOT NULL,
        
        PRIMARY KEY ("entry_id", "tag_id"),
        INDEX "tag_id" ("tag_id" ASC) ,
        
        CONSTRAINT "entry_tags_ibfk_1"
            FOREIGN KEY ("entry_id")
            REFERENCES "user_entries" ("entry_id")
            ON DELETE CASCADE,
        
        CONSTRAINT "entry_tags_ibfk_2"
            FOREIGN KEY ("tag_id")
            REFERENCES "user_tags" ("tag_id")
            ON DELETE CASCADE)
        ;`,

        USER_TAGS: `CREATE TABLE IF NOT EXISTS "user_tags" (
        "user_id" TEXT NOT NULL,
        "tag_name" TEXT NOT NULL,
        "tag_id" TEXT NULL DEFAULT NULL,
        
        PRIMARY KEY ("user_id", "tag_name"),
        UNIQUE INDEX "tag_id" ("tag_id" ASC) ,
        
        CONSTRAINT "user_tags_ibfk_1"
            FOREIGN KEY ("user_id")
            REFERENCES "users" ("id")
            ON DELETE CASCADE)
        ;`

    },

    generalStatements: {

      getLastActivity: `SELECT * FROM "user_entries" 
      WHERE (updated_at > ?) AND
      (user_id = ?) 
      ;`,

      getLastLoggedIn: `SELECT ("last_logged_in") FROM "user_details"
      WHERE user_id = ?
      ;`,

      getAppSettings: `SELECT * FROM "user_settings" WHERE (user_id = ?);`,

      getPremiumStatus: `SELECT (premium) FROM "user_details" WHERE (user_id = ?);`,

      getUserId:  `SELECT id FROM "users" WHERE (username = ?);`,

      getAllProjects: `SELECT project, target_lang, output_lang FROM "projects" WHERE (user_id = ?);`,

      getPlaysLeft: `SELECT plays_left FROM plays_left WHERE (user_id = ?); `,

      getTranslationsLeft: `SELECT translations_left FROM translations_left WHERE (user_id = ?); `,

      getUserLoginByUsername: `SELECT * from users WHERE username = ?;`,

      getUserLoginByEmail: `SELECT * from users WHERE email = ?;`,

    },

    addNewUser: {

      USERS: `INSERT INTO "users" VALUES (?, ?, ?, ?);`, //id, username, email, password_hash
      USER_DETAILS: `INSERT INTO "user_details" VALUES (?, ?, ?, ?);`, //username, user_id, last_logged_in, premium
      USER_SETTINGS: `INSERT INTO "user_settings" VALUES (?, ?, ?, ?, ?, ?);`, //user_id, timer_on, slider_val, target_lang, output_lang, default_project
      TRANSLATIONS_LEFT: `INSERT INTO "translations_left" VALUES (?, ?);`,//user_id, translations_left
      PLAYS_LEFT: `INSERT INTO "plays_left" VALUES (?, ?);`, //user_id, plays_left
      NEXT_PLAYS_REFRESH: `INSERT INTO "next_plays_refresh" VALUES (?, ?);`, //user_id, next_plays_refresh
      NEXT_TRANSLATIONS_REFRESH: `INSERT INTO "next_translations_refresh" VALUES (?, ?);`// user_id, next_translations_regresh

    },

    refreshStatements: {

      getPlaysRefreshTimeLeft: `SELECT game_refresh from "next_plays_refresh" WHERE (user_id = ?);`,
      updatePlaysRefresh: `UPDATE "next_plays_refresh SET games_refresh = NULL WHERE (user_id = ?)";`,
      updatePlaysRemaining: `UPDATE "plays_left SET plays_left = 10 WHERE (user_id = ?)";`,

      getTranslationsRefreshTimeLeft: `SELECT translations_refresh from "next_translations_refresh" WHERE (user_id = ?);`,
      updateTranslationsRefreshPremium: `UPDATE next_translations_refresh SET translations_refresh = NULL WHERE (user_id = ?);`,
      updateTranslationsRemainingPremium: `UPDATE translations_left SET translations_left = 250 WHERE (user_id = ?);`,

      updateTranslationsRefreshFree: `UPDATE next_translations_refresh SET translations_refresh = NULL WHERE (user_id = ?);`,
      updateTranslationsRemainingFree: `UPDATE translations_left SET translations_left = 100 WHERE (user_id = ?);`,

      setTranslationRefreshTime: `UPDATE next_translations_refresh SET translations_refresh = ? WHERE (user_id = ?);`,
      setPlaysRefreshTime: `UPDATE next_plays_refresh SET game_refresh = ? WHERE (user_id = ?);`

    },

    updateStatements: {

      updateLastLoggedIn: `UPDATE user_details SET last_logged_in = CURRENT_TIMESTAMP WHERE (user_id= ?);`,
      updateNoOfTurns: `UPDATE user_settings SET slider_val = ? WHERE (user_id = ?);`,
      updateTimerOn: `UPDATE user_settings SET timer_on = ? WHERE (user_id = ?);`,

      updateDefaultTargetLang: `UPDATE user_settings SET target_lang = ? WHERE (user_id = ?);`,
      updateDefaultOutputLang: `UPDATE user_settings SET output_lang = ? WHERE (user_id = ?);`,

      updateTranslationsLeft: `UPDATE translations_left SET translations_left = ? WHERE user_id = ?;`,
      updatePlaysLeft: `UPDATE plays_left SET plays_left = ? WHERE user_id = ?;`,

      updateUserPassword: `UPDATE users SET password_hash = ? WHERE username = ?;`,
      updateUserEntry: `UPDATE "user_entries" SET 
        
          "target_language_text" = ?,
          "output_language_text" = ?,
          "target_language" = ?,
          "output_language" = ?
        
        WHERE (entry_id = ?)
        AND (user_id = ?);`,

      syncUserEntry: `UPDATE "user_entries" SET 
        
        "target_language_text" = ?,
        "output_language_text" = ?,
        "target_language" = ?,
        "output_language" = ?,
        "updated_at" = ?,
        "tags" = ?
      
      WHERE (entry_id = ?)
      AND (user_id = ?);`,
      
      syncUserSettings: `
      UPDATE user_settings
      SET
        "timer_on" = ?,
        "slider_val" = ?,
        "target_lang" = ?,
        "output_lang" = ?,
        "default_project" = ?
      WHERE
        "user_id" = ?
      ;`,

      syncPremiumStatus: `
      UPDATE user_details
      SET
        "premium" = ?
      WHERE
        "user_id" = ?
      ;`

    },

    deleteStatements: {

      deleteProject: `DELETE FROM "projects" 
                      WHERE (user_id = ?) AND
                      (project = ?);`,
      
      deleteUser: `DELETE FROM users WHERE (username = ?);`,
      deleteUserById: `DELETE FROM users WHERE (id = ?);`,
      deleteEntry: `DELETE FROM user_entries WHERE (entry_id = ?) AND (user_id = ?);`

    },

    addStatements: {
      addProject: `INSERT INTO projects VALUES (?, ?, ?, ?);`, 
      addUserEntry: `INSERT INTO "user_entries" (
        "user_id",
        "username",
        "entry_id",
        "target_language_text",
        "target_language",
        "output_language_text",
        "output_language",
        "tags",
        "project"
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,

      syncUserEntry: `INSERT INTO "user_entries" (
        "user_id",
        "username",
        "entry_id",
        "target_language_text",
        "target_language",
        "output_language_text",
        "output_language",
        "tags",
        "created_at",
        "project"
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
    },

    getStatements: {

      getAllProjectEntries: `SELECT * FROM user_entries WHERE (user_id = ?) AND (project = ?);`,
      getAllEntries: `SELECT * FROM user_entries WHERE (user_id = ?);`,
      getEntries: ` SELECT * FROM user_entries 
      WHERE user_id = ? 
      AND (
        target_language LIKE '%' || ? || '%' 
        OR target_language_text LIKE '%' || ? 
        OR target_language_text LIKE  ? || '%' 
        OR output_language_text LIKE  ? || '%' 
        OR output_language_text LIKE '%' || ? || '%' 
        OR output_language_text LIKE '%' || ?
      );
    `,
    getEntryById: `
      SELECT * FROM user_entries WHERE (user_id = ?) AND (entry_id = ?)
    ;`

    },

    testStatements: {
      
    }
};

export default SQLStatements; 

