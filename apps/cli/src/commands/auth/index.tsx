import React from 'react';
import { useLoginLogic, useSignupLogic } from './auth.logic.js';
import { LoginScreen } from './login.screen.js';
import { SignupScreen } from './signup.screen.js';

export const Login = () => {
    const logic = useLoginLogic();
    return <LoginScreen {...logic} />;
};

export const Signup = () => {
    const logic = useSignupLogic();
    return <SignupScreen {...logic} />;
};
