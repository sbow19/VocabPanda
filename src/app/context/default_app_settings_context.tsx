/* eslint-disable */

import React from 'react'
import * as types from '@customTypes/types.d'

type AppSettingsContext = [types.AppSettingsObject, React.Dispatch<React.SetStateAction<types.AppSettingsObject>>]

const defaultAppSettings: AppSettingsContext = [{

    gameSettings: {
        timerOn: false,
        noOfTurns: 10
    },

    projects: []

}]

const DefaultAppSettingsContext = React.createContext(defaultAppSettings)

export default DefaultAppSettingsContext