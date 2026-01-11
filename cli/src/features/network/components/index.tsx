import React from 'react';
import { useNetworkLogic } from '../hooks/useNetwork.js';
import { NetworkScreen } from './network.screen.js';

interface NetworkProps {
    action?: 'list' | 'requests' | 'add' | 'accept' | 'block';
    target?: string;
}

export const Network: React.FC<NetworkProps> = (props) => {
    const logic = useNetworkLogic(props);
    return <NetworkScreen {...logic} />;
};
