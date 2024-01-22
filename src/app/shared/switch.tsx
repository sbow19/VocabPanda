/* eslint-disable */

import * as types from '@customTypes/types.d';

import React from 'react'
import { Switch } from 'react-native-switch';
import appColours from '@styles/app_colours';
import DefaultAppSettingsContext from 'app/context/default_app_settings_context';

const parseProps = props=>{

    customProps = {

        onPress: ()=>{}

    }

    if(props.onPress){

        customProps.onPress = props.onPress
        
    }

    return customProps

}

const AppSwitch:React.FC = props =>{

    const [appSettings, setAppSettingsHandler] = React.useContext(DefaultAppSettingsContext)

    const [myLocalSetting, setMyLocalSetting] = React.useState<boolean>(false)

    const customProps = parseProps(props)

    React.useEffect(()=>{

        setMyLocalSetting(appSettings.gameSettings.timerOn)

    }, [])
  
    return(
    
    <>
        <Switch
            value={props.setsDefault != true ? myLocalSetting : appSettings.gameSettings.timerOn}
            onValueChange={
                (val)=>{

                    if(props.setsDefault == true){

                        setAppSettingsHandler(val, "", props.setsDefault)

                        setMyLocalSetting(!myLocalSetting)

                    } else {

                        setMyLocalSetting(!myLocalSetting);

                    }

                    if(props.onPress){

                        customProps.onPress(val);

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