import React from 'react';
import { useProfileViewLogic, useProfileEditLogic } from './profile.logic.js';
import { ProfileViewScreen } from './profile-view.screen.js';
import { ProfileEditScreen } from './profile-edit.screen.js';

export const ProfileView = () => {
    const logic = useProfileViewLogic();
    return <ProfileViewScreen {...logic} />;
};

export const ProfileEdit = () => {
    const logic = useProfileEditLogic();
    return <ProfileEditScreen {...logic} />;
};
