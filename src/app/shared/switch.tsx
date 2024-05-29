/* eslint-disable */

import * as types from '@customTypes/types.d';

import React from 'react'
import { Switch } from 'react-native-switch';
import appColours from '@styles/app_colours';
import DefaultAppSettingsContext from 'app/context/default_app_settings_context';

const parseProps = props=>{

    customProps = {

        onPress: ()=>{},
        defaultValue: 0,
        setsDefault: false,
        switchType: ""

    };

    if(props.onPress){

        customProps.onPress = props.onPress
        
    }

    if(props.defaultValue === true || props.defaultValue === false){

        customProps.defaultValue = props.defaultValue;
    }

    if(props.setsDefault === true || props.setsDefault === false){

        customProps.setsDefault = props.setsDefault; 
    }

    if(props.switchType){

        customProps.switchType = props.switchType;
    }

    return customProps

}

const AppSwitch:React.FC = props =>{

    const [appSettings, setAppSettingsHandler] = React.useContext(DefaultAppSettingsContext)

    const [myLocalSetting, setMyLocalSetting] = React.useState<boolean>(false);


    const customProps = parseProps(props);

    React.useEffect(()=>{

        let switchVal;

        if(appSettings.userSettings.gameTimerOn === 0){

            switchVal = false;

        }else if (appSettings.userSettings.gameTimerOn === 1){

            switchVal = true;
        } 
        setMyLocalSetting(switchVal);

    }, [])
  
    return(
    
    <>
        <Switch
            value={myLocalSetting}
            onValueChange={
                (val)=>{

                    if(customProps.setsDefault == true){

                        setAppSettingsHandler(val, customProps.switchType); //Sets default switch value in database

                        setMyLocalSetting(val);
                        

                    } else {

                        setMyLocalSetting(val);

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