/* eslint-disable */

import * as types from '@customTypes/types.d'

import React from 'react';
import {
    View
} from 'react-native';
import CoreStyles from '@styles/core_styles';
import SignInButton from '@screens/account/singin_button';
import SignOutButton from '@screens/account/signout_button';
import CreateAccountButton from '@screens/account/createaccountbutton';

const Account: React.FC = props=>{

    return (
        <View style={CoreStyles.defaultScreen}>
            <SignInButton {...props}/>
            <SignOutButton {...props}/>
            <CreateAccountButton {...props}/>

        </View>
    )
}

export default Account;