/* eslint-disable */

import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: "vocabpanda.db",
  location: "default" },
  () => {
    console.log('Database opened successfully');
  },
  (error) => {
    console.error('Error opening database:', error);
  }
);

//Execute code to allow foreign keys
db.executeSql('PRAGMA foreign_keys = ON');

export default db;