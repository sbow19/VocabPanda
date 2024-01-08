/* eslint-disable */

import React from 'react';
import {
    View
} from 'react-native';
import CoreStyles from '../../shared_styles/core_styles';
import SignInButton from './singin_button';
import SignOutButton from './signout_button';
import CreateAccountButton from './createaccountbutton';

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