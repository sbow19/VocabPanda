/* eslint-disable */

import * as types from '@customTypes/types.d';

import React, {useState} from 'react'
import { Switch } from 'react-native-switch';
import appColours from '@styles/app_colours';

const AppSwitch:React.FC = props =>{

    const [switchState, setSwitchState] = useState(false)

    return(
    
    <>
        <Switch
            value={switchState}
            onValueChange={
                (val)=>{
                    setSwitchState(val)
                    try{

                        /* Added logic here on switch, perhaps use context */

                    }catch(e){

                    }
                }
            }
            circleActiveColor={appColours.darkGreen}
            circleBorderInactiveColor={appColours.white}
            switchLeftPx={1.5}
            switchRightPx={1.5}
            activeText=''
            inActiveText=''
            switchWidthMultiplier={2.5}
            backgroundActive={appColours.lightGreen}
            circleBorderWidth={0.5}
        />
    
    </>
    )
}

export default AppSwitch;