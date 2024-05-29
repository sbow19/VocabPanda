/* eslint-disable*/

import { createContext } from "react";
import * as types from '@customTypes/types.d'

type ActivityStatusArray = [boolean, React.Dispatch<React.SetStateAction<boolean>>]

const activityStatusArray: ActivityStatusArray = []

const ActivityIndicatorStatus = createContext(activityStatusArray);

export default ActivityIndicatorStatus;