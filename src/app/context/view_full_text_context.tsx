/* eslint-disable */

import {
    createContext
} from 'react'
import * as types from '@customTypes/types.d'

const fulltext: types.FullTextOverlay = {}

const FullTextContext = createContext(fulltext);


export default FullTextContext

