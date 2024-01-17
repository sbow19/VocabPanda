/* eslint-disable */

import * as types from '@customTypes/types.d';

import React, {useState} from 'react'
import { Switch } from 'react-native-switch';
import appColours from '@styles/app_colours';
import DefaultGameSettingsContext from 'app/context/default_game_settings_context';
import CurrentUserContext from 'app/context/current_user';


const AppSwitch:React.FC = props =>{

    const [gameSettings, setGameSettingsHandler] = React.useContext(DefaultGameSettingsContext)

    const [myLocalSetting, setMyLocalSetting] = React.useState(false)

    React.useEffect(()=>{

        setMyLocalSetting(gameSettings.timerOn)

    }, [])


    return(
    
    <>
        <Switch
            value={props.setsDefault != true ? myLocalSetting : gameSettings.timerOn}
            onValueChange={
                (val)=>{

                    if(props.setsDefault == true){
                        setGameSettingsHandler(val, "", props.setsDefault)
                        setMyLocalSetting(!myLocalSetting)
                    } else {
                        setMyLocalSetting(!myLocalSetting)
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