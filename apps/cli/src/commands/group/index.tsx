import React from 'react';
import { useGroupLogic } from './group.logic.js';
import { GroupScreen } from './group.screen.js';

interface GroupProps {
    action?: 'list' | 'create' | 'view' | 'join' | 'accept';
    id?: string;
    extraArg?: string;
}

export const Group: React.FC<GroupProps> = (props) => {
    const logic = useGroupLogic(props);
    return <GroupScreen {...logic} />;
};
