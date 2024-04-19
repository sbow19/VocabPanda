/* eslint-disable */

import {
    createContext
} from 'react'

const internetStatusObject = {
    visible: false,
    setEditTextVisible: ()=>{}
}

const InternetStatus = createContext(internetStatusObject);

export default InternetStatus;
