/* eslint-disable */

import React, {createContext} from 'react'

export const optionsOverlayObject = {
    visible: false,
    setOptionsOverlayVisible: ()=>{
    }
}

const OptionsOverlay = createContext(optionsOverlayObject)

export default OptionsOverlay