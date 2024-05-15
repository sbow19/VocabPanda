/* eslint-disable */

import {
    createContext
} from 'react'

const edittext = {
    visible: false,
    setEditTextVisible: ()=>{},
    entryToEdit: {},
    setEntryToEdit: ()=>{}
}

const EditTextContext = createContext(edittext)


export default EditTextContext
