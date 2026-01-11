import React from 'react';
import { useLoginLogic, useSignupLogic } from './auth.logic.js';
import { LoginScreen } from './login.screen.js';
import { SignupScreen } from './signup.screen.js';
import { ProfileEdit } from '../../features/profile/index.js';

export const Login = () => {
    const logic = useLoginLogic();
    return <LoginScreen {...logic} />;
};

export const Signup = () => {
    const logic = useSignupLogic();

    if (logic.step === 'profile_setup') {
        return <ProfileEdit />;
    }

    return <SignupScreen {...logic} />;
};
