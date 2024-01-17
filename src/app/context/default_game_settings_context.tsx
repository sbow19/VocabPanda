/* eslint-disable */

import React from 'react'

const DefaultGameSettingsContext = React.createContext({

    timerOn: false,
    setTimerOn: ()=>{},
    noOfTurns: 5,
    setNoOfTurns: ()=>{}

})

export default DefaultGameSettingsContext