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
import LoadingStatusInitial from 'app/context/loadingInitial';
import LoadingStatusInGame from 'app/context/loadingInGame';
import ActivityIndicatorStatus from 'app/context/activity_indicator_context';

function App () {

  SQLite.enablePromise(true)

  

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = React.useState(true); //Loading initial triggers initial loading screen
  const [isLoadingInGame, setIsLoadingInGame] = React.useState(false);  //Loading within app triggers activity indicator
  const [activityIndicator, setActivityIndicator] = React.useState(false); //Activity indicator

  const loggedInState = [isLoggedIn, setIsLoggedIn];
  const loadingStateInitial = [isLoadingInitial, setIsLoadingInitial];
  const loadingStateInGame = [isLoadingInGame, setIsLoadingInGame]; 
  const activityIndicatorSet = [activityIndicator, setActivityIndicator]

  return(


    <ActivityIndicatorStatus.Provider value={activityIndicatorSet}>
    <LoadingStatusInGame.Provider value={loadingStateInGame}>
    <LoadingStatusInitial.Provider value={loadingStateInitial}>

      <LoggedInStatus.Provider value={loggedInState}>
        <VocabPandaApp/>
      </LoggedInStatus.Provider>

    </LoadingStatusInitial.Provider>
    </LoadingStatusInGame.Provider>
    </ActivityIndicatorStatus.Provider>

  )
};


export default App;
