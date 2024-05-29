/* eslint-disable */

import React, {createContext} from 'react'



type OptionsOverlayContext = {
    visible: boolean //State of edit text overlay
    setOptionsOverlayVisible: React.Dispatch<React.SetStateAction<boolean>> //Set state of edit textoverlay
    currentEntryId: string //Current entry id
    setCurrentEntryId: React.Dispatch<React.SetStateAction<string>>
}

const optionsOverlayObject: OptionsOverlayContext = {
}

const OptionsOverlay = createContext(optionsOverlayObject)

export default OptionsOverlay