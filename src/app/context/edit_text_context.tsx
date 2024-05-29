/* eslint-disable */

import {
    createContext
} from 'react'

import * as types from '@customTypes/types.d'
import React from 'react'


const edittext: types.EditTextOverlay = {}

const EditTextContext = createContext(edittext);


export default EditTextContext
