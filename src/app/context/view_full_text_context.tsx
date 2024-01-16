/* eslint-disable */

import {
    createContext
} from 'react'

const fulltext = {
    visible: false,
    setFullTextVisible: ()=>{}
}

const FullTextContext = createContext(fulltext)


export default FullTextContext

