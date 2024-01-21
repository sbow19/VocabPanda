/* eslint-disable */

import {
    createContext
} from 'react'

const fulltext = {
    visible: false,
    setFullTextVisible: ()=>{},
    resultTextObject: {
        target_language: "",
        target_language_lang: "",
        output_language: "",
        output_language_lang: ""
    }
}

const FullTextContext = createContext(fulltext)


export default FullTextContext

