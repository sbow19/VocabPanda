/* eslint-disable */

import { createContext } from "react";
import * as types from '@customTypes/types.d'

const lastActivityObject: types.LastActivityObject = {};

const LastActivity = createContext(lastActivityObject);

export default LastActivity;