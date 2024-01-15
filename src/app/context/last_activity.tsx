/* eslint-disable */

import { createContext } from "react";

export const lastActivityObject = {
    lastActivity: false,
    lastActivityData: {
        projects: [],
        noOfAdditions: []
    }
}

const LastActivity = createContext(lastActivityObject)

export default LastActivity;