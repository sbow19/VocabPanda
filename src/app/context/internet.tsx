/* eslint-disable */

import {
    createContext
} from 'react'

type InternetStatusArray = [boolean, React.Dispatch<React.SetStateAction<boolean>>]

const internetStatusArray: internetStatusArray = []

const InternetStatus = createContext(internetStatusArray);

export default InternetStatus;
