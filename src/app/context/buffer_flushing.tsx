/* eslint-disable*/

import { createContext } from "react";

type BufferFlushingStatusArray = [boolean, React.Dispatch<React.SetStateAction<boolean>>]

const bufferFlushingStatusArray: BufferFlushingStatusArray = []

const BufferFlushingContext = createContext(bufferFlushingStatusArray);


export default BufferFlushingContext;