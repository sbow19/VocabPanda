/* eslint-disable */

import React, {useState} from 'react'

import { appColours } from '../shared_styles/core_styles';

import { Switch } from 'react-native-switch';



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