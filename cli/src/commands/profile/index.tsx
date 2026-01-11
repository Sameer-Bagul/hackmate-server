import React from 'react';
import { useProfileViewLogic, useProfileEditLogic } from './profile.logic.js';
import { ProfileViewScreen } from './profile-view.screen.js';
import { ProfileEditScreen } from './profile-edit.screen.js';

export const ProfileView: React.FC<{ username?: string }> = ({ username }) => {
    // Logic needs to be updated to accept username too, but let's pass it for now
    const logic = useProfileViewLogic(username);
    return <ProfileViewScreen {...logic} />;
};

export const ProfileEdit = () => {
    const logic = useProfileEditLogic();
    return <ProfileEditScreen {...logic} />;
};
