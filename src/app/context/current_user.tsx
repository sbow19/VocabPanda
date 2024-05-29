/* eslint-disable */

import * as types from '@customTypes/types.d'
import React from 'react'
import typescript from 'react-native-encrypted-storage';

//Set current user context array 

type CurrentUserArray = [
    types.CurrentUser,
    React.Dispatch<React.SetStateAction<types.CurrentUser>>
]

const currentUserArray:CurrentUserArray = []

const CurrentUserContext = React.createContext(currentUserArray);

export default CurrentUserContext