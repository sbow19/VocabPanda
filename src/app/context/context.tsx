/* eslint-disable */

import {
    createContext
} from 'react'

type WindowContext = {
    height: number
    width: number
}

const windowDimensions: WindowContext = {
    height: 0,
    width: 0
}

const WindowDimensions = createContext(windowDimensions)

export default WindowDimensions;