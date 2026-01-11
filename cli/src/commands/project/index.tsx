import React from 'react';
import { useProjectLogic } from './project.logic.js';
import { ProjectScreen } from './project.screen.js';

interface ProjectProps {
    action?: 'list' | 'create' | 'view' | 'apply' | 'accept';
    id?: string;
    extraArg?: string;
}

export const Project: React.FC<ProjectProps> = (props) => {
    const logic = useProjectLogic(props);
    return <ProjectScreen {...logic} />;
};
