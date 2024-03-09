/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
/* eslint-disable */

import SQLite from 'react-native-sqlite-storage'
import 'react-native-gesture-handler';
import VocabPandaApp from './src/app/app';


import LoggedInStatus from 'app/context/loggedIn';
import React from 'react'
import LoadingStatus from 'app/context/loading';

function App () {

  SQLite.enablePromise(true)

  

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const loggedInState = [isLoggedIn, setIsLoggedIn]
  const loadingState = [isLoading, setIsLoading]

  return(

    <LoadingStatus.Provider value={loadingState}>

      <LoggedInStatus.Provider value={loggedInState}>
        <VocabPandaApp/>
      </LoggedInStatus.Provider>

    </LoadingStatus.Provider>

  )
};


export default App;
