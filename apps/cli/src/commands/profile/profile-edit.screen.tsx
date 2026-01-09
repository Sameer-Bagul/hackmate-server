import React from 'react';
import { Text, Box } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';

interface ProfileEditScreenProps {
    step: number;
    setStep: (step: number) => void;
    profile: any;
    setProfile: (profile: any) => void;
    loading: boolean;
    handleSubmit: () => void;
}

const INTENT_ITEMS = [
    { label: 'Startup', value: 'startup' },
    { label: 'Collab', value: 'collab' },
    { label: 'Friends', value: 'friends' },
    { label: 'Mentorship', value: 'mentorship' },
];

export const ProfileEditScreen: React.FC<ProfileEditScreenProps> = ({
    step, setStep,
    profile, setProfile,
    loading,
    handleSubmit
}) => {
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
            label: 'Age',
            component: (
                <TextInput
                    value={String(profile.age || '')}
                    onChange={(val) => setProfile({ ...profile, age: val ? parseInt(val) : undefined })}
                    onSubmit={() => setStep(step + 1)}
                />
            ),
        },
        {
            label: 'Gender (male/female/other)',
            component: (
                <TextInput
                    value={profile.gender || ''}
                    onChange={(val) => setProfile({ ...profile, gender: val as any })}
                    onSubmit={() => setStep(step + 1)}
                />
            ),
        },
        {
            label: 'Company / College',
            component: (
                <TextInput
                    value={profile.company || ''}
                    onChange={(val) => setProfile({ ...profile, company: val })}
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
            label: 'Interests (comma separated)',
            component: (
                <TextInput
                    value={profile.interests || ''}
                    onChange={(val) => setProfile({ ...profile, interests: val })}
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
                    onSubmit={() => setStep(step + 1)}
                />
            ),
        },
        {
            label: 'LinkedIn URL',
            component: (
                <TextInput
                    value={profile.linkedin || ''}
                    onChange={(val) => setProfile({ ...profile, linkedin: val })}
                    onSubmit={() => setStep(step + 1)}
                />
            ),
        },
        {
            label: 'Twitter URL',
            component: (
                <TextInput
                    value={profile.twitter || ''}
                    onChange={(val) => setProfile({ ...profile, twitter: val })}
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
