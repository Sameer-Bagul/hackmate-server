import React, { useState, useEffect } from 'react';
import { Text, Box, useApp } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import api from '../api.js';
import { getUser } from '../config.js';

const INTENT_ITEMS = [
    { label: 'Startup', value: 'startup' },
    { label: 'Collab', value: 'collab' },
    { label: 'Friends', value: 'friends' },
    { label: 'Mentorship', value: 'mentorship' },
];

export const ProfileEdit = () => {
    const { exit } = useApp();
    const [step, setStep] = useState(0);
    const [profile, setProfile] = useState({
        bio: '',
        intent: 'collab',
        stack: '',
        location: '',
        github: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch existing profile to populate defaults (optional, skipping for speed MVp)
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.put('/profile', {
                ...profile,
                stack: profile.stack.split(',').map((s) => s.trim()),
            });
            console.log('✅ Profile updated!');
            exit();
        } catch (err: any) {
            console.error('❌ Update failed:', err.response?.data?.message || err.message);
            exit();
        }
    };

    if (loading) return <Text>Saving...</Text>;

    const steps = [
        {
            label: 'Main Intent',
            component: (
                <SelectInput
                    items={INTENT_ITEMS}
                    onSelect={(item) => {
                        setProfile({ ...profile, intent: item.value });
                        setStep(step + 1);
                    }}
                />
            ),
        },
        {
            label: 'Bio (One liner)',
            component: (
                <TextInput
                    value={profile.bio}
                    onChange={(val) => setProfile({ ...profile, bio: val })}
                    onSubmit={() => setStep(step + 1)}
                />
            ),
        },
        {
            label: 'Tech Stack (comma separated)',
            component: (
                <TextInput
                    value={profile.stack}
                    onChange={(val) => setProfile({ ...profile, stack: val })}
                    onSubmit={() => setStep(step + 1)}
                />
            ),
        },
        {
            label: 'Location',
            component: (
                <TextInput
                    value={profile.location}
                    onChange={(val) => setProfile({ ...profile, location: val })}
                    onSubmit={() => setStep(step + 1)}
                />
            ),
        },
        {
            label: 'GitHub Username',
            component: (
                <TextInput
                    value={profile.github}
                    onChange={(val) => setProfile({ ...profile, github: val })}
                    onSubmit={handleSubmit}
                />
            ),
        },
    ];

    const currentStep = steps[step];

    return (
        <Box flexDirection="column" padding={1}>
            <Text color="yellow" bold> Edit Profile </Text>
            <Box marginY={1}>
                <Text bold> {currentStep.label}: </Text>
                {currentStep.component}
            </Box>
            <Text color="gray">Step {step + 1} of {steps.length}</Text>
        </Box>
    );
};
