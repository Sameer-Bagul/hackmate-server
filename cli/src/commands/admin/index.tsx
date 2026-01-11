import React from 'react';
import { useAdminLogic } from './admin.logic.js';
import { AdminScreen } from './admin.screen.js';

interface AdminProps {
    action: 'list' | 'view' | 'delete';
    id?: string;
}

export const Admin: React.FC<AdminProps> = (props) => {
    const logic = useAdminLogic(props);
    return <AdminScreen {...logic} />;
};
