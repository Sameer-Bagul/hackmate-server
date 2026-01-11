import React from 'react';
import { useProfileViewLogic, useProfileEditLogic } from '../hooks/useProfile.js';
import { ProfileViewScreen } from './profile-view.screen.js';
import { ProfileEditScreen } from './profile-edit.screen.js';

export const ProfileView: React.FC<{ username?: string }> = ({ username }) => {
    const logic = useProfileViewLogic(username);
    return <ProfileViewScreen {...logic} />;
};

export const ProfileEdit = () => {
    const logic = useProfileEditLogic();
    return <ProfileEditScreen {...logic} />;
};
