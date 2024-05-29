/* eslint-disable */

import {
    createContext
} from 'react'

import * as types from '@customTypes/types.d'
import React from 'react'

type EditTextContext = {
    visible: boolean //State of edit text overlay
    setEditTextVisible: React.Dispatch<React.SetStateAction<boolean>> //Set state of edit textoverlay
    entryToEdit: types.EntryDetails
    setEntryToEdit: React.Dispatch<React.SetStateAction<types.EntryDetails>>
}
const edittext: EditTextContext = {
    visible: false,
    setEditTextVisible: ()=>{},
    entryToEdit: {},
    setEntryToEdit: ()=>{}
}

const EditTextContext = createContext(edittext);


export default EditTextContext
