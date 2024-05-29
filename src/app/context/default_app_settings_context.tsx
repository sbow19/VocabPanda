/* eslint-disable */

import React from 'react'
import * as types from '@customTypes/types.d'

type AppSettingsContext = [types.AppSettingsObject, React.Dispatch<React.SetStateAction<types.AppSettingsObject>>]

const defaultAppSettings: AppSettingsContext = []

const DefaultAppSettingsContext = React.createContext(defaultAppSettings)

export default DefaultAppSettingsContext