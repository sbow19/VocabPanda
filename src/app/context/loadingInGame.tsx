/* eslint-disable*/

import { createContext } from "react";
import * as types from '@customTypes/types.d'

type LoadingInGameArray = [boolean, React.Dispatch<React.SetStateAction<boolean>>]

const loadingInGameArray: LoadingInGameArray = []

const LoadingStatusInGame = createContext(loadingInGameArray);

export default LoadingStatusInGame;