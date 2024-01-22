/* eslint-disable */

import { createContext } from "react";

export const lastActivityObject = {
    lastActivity: true,
    lastActivitySummary: {
        projects: [],
        noOfAdditions: []
    },
    lastActivityResultArrays: [
        {
            project: "",
            resultArray: []

        },
        {
            project: "",
            resultArray: []
        }
    ]
}

const LastActivity = createContext([lastActivityObject])

export default LastActivity;