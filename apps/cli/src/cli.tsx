#!/usr/bin/env node
import React from 'react';
import { render, Text, Box } from 'ink';
import { Command } from 'commander';
import { AppProvider } from './context/index.js';

// Commands
import { Login, Signup } from './commands/auth/index.js';
import { Admin } from './commands/admin/index.js';
import { Network } from './commands/network/index.js'; // Mapping to Social/Match
import { Project } from './commands/project/index.js';
import { Group } from './commands/group/index.js';
import { Notification } from './commands/notification/index.js';
import { ProfileView, ProfileEdit } from './commands/profile/index.js';
import { Chat } from './commands/chat/index.js';
import { Discover } from './commands/Discover.js';
// import { ComingSoon } from './commands/ComingSoon.js'; // REMOVED
import { Logout } from './commands/auth/Logout.js';
import { Verify } from './commands/auth/Verify.js';
import { StatsStub, MatchStub, BotStub, ConfigStub, DataStub, PresenceStub } from './commands/stubs/index.js';

const program = new Command();

program
    .name('hackmate')
    .description('The Terminal Social Network and Dating CLI for Hackers and Developers')
    .version('0.0.1')
    .option('--json', 'Output formatted JSON')
    .option('--debug', 'Enable debug mode')
    .option('--config <path>', 'Path to custom config file')
    .option('--no-color', 'Disable colored output'); // Commander/Ink handle this internally usually, but explicit docs help

// --- AUTH ---
const auth = program.command('auth').description('Authentication & Identity');

auth.command('login')
    .description('Login to HackMate')
    .action(() => { render(<AppProvider><Login /></AppProvider>); });

auth.command('signup')
    .description('Create a new account')
    .action(() => { render(<AppProvider><Signup /></AppProvider>); });

auth.command('logout')
    .description('Logout of session')
    .action(() => { render(<AppProvider><Logout /></AppProvider>); });

auth.command('verify')
    .description('Verify email with OTP')
    .action(() => { render(<AppProvider><Verify /></AppProvider>); });

auth.command('whoami')
    .description('Current user status')
    .action(() => { render(<AppProvider><ProfileView /></AppProvider>); }); // Reuse profile view

// --- PROFILE ---
const profile = program.command('profile').description('Manage your profile');

profile.command('view [username]')
    .description('View profile')
    .action((username) => {
        // TODO: Pass username to ProfileView if it supports it, currently mostly self
        render(<AppProvider><ProfileView /></AppProvider>);
    });

profile.command('edit')
    .description('Edit profile details')
    .action(() => { render(<AppProvider><ProfileEdit /></AppProvider>); });

// --- DISCOVERY ---
const discover = program.command('discover').description('Find developers');

discover.action(() => { render(<AppProvider><Discover /></AppProvider>); });
discover.command('smart').action(() => { render(<AppProvider><Discover /></AppProvider>); }); // Alias
discover.command('nearby').action(() => { render(<AppProvider><Discover /></AppProvider>); }); // Reuse discover for now

// --- MATCHING ---
const match = program.command('match').description('Matching system');

match.action(() => { render(<AppProvider><MatchStub /></AppProvider>); });
match.command('list')
    .description('List matches')
    .action(() => { render(<AppProvider><MatchStub /></AppProvider>); });

// --- SOCIAL (Was Network) ---
const social = program.command('social').description('Social Graph (Friends/Followers)');

social.command('list') // Friends list
    .description('List friends/following')
    .action(() => { render(<AppProvider><Network action="list" /></AppProvider>); });

social.command('requests')
    .description('View pending requests')
    .action(() => { render(<AppProvider><Network action="requests" /></AppProvider>); });

social.command('follow <username>') // "Add Friend"
    .description('Follow/Add user')
    .action((username) => { render(<AppProvider><Network action="add" target={username} /></AppProvider>); });

social.command('unfollow <username>')
    .description('Unfollow user')
    .action((username) => { render(<AppProvider><MatchStub /></AppProvider>); }); // TODO: Unfollow logic stub

social.command('block <username>')
    .description('Block user')
    .action((username) => { render(<AppProvider><Network action="block" target={username} /></AppProvider>); });

// --- CHAT ---
const chat = program.command('chat')
    .description('Messaging')
    .argument('[username]', 'Direct Message user')
    .action((username) => {
        if (username) render(<AppProvider><Chat targetUsername={username} /></AppProvider>);
        else render(<AppProvider><Chat /></AppProvider>);
    });

chat.command('dm <username>')
    .description('Direct Message')
    .action((username) => { render(<AppProvider><Chat targetUsername={username} /></AppProvider>); });


chat.command('group <groupname>')
    .description('Group Chat')
    .action((groupname) => { render(<AppProvider><Chat groupName={groupname} /></AppProvider>); });

// --- PROJECTS (Added from featuresTodo) ---
const project = program.command('project').description('Project Collaboration');

project.command('list')
    .description('List open projects')
    .action(() => { render(<AppProvider><Project action="list" /></AppProvider>); });

project.command('create')
    .description('Post a project')
    .action(() => { render(<AppProvider><Project action="create" /></AppProvider>); });

project.command('view <id>')
    .description('View project details')
    .action((id) => { render(<AppProvider><Project action="view" id={id} /></AppProvider>); });

project.command('apply <id>')
    .description('Apply to a project')
    .action((id) => { render(<AppProvider><Project action="apply" id={id} /></AppProvider>); });

project.command('accept <id> <userId>')
    .description('Accept applicant')
    .action((id, userId) => { render(<AppProvider><Project action="accept" id={id} extraArg={userId} /></AppProvider>); });

// --- GROUP (Communities) (Added from featuresTodo) ---
const group = program.command('group').description('Communities');

group.command('list')
    .description('List groups')
    .action(() => { render(<AppProvider><Group action="list" /></AppProvider>); });

group.command('create')
    .description('Create community')
    .action(() => { render(<AppProvider><Group action="create" /></AppProvider>); });

group.command('view <id>')
    .description('View group')
    .action((id) => { render(<AppProvider><Group action="view" id={id} /></AppProvider>); });

group.command('join <id>')
    .description('Join group')
    .action((id) => { render(<AppProvider><Group action="join" id={id} /></AppProvider>); });

group.command('accept <id> <userId>')
    .description('Accept member')
    .action((id, userId) => { render(<AppProvider><Group action="accept" id={id} extraArg={userId} /></AppProvider>); });

// --- NOTIFICATIONS ---
const notification = program.command('notification').description('System Alerts');

notification.command('list')
    .action(() => { render(<AppProvider><Notification action="list" /></AppProvider>); });

// --- ADMIN ---
const admin = program.command('admin').description('God Mode');

const users = admin.command('users').description('User Management');

users.command('list')
    .action(() => { render(<AppProvider><Admin action="list" /></AppProvider>); });

users.command('view <id>')
    .action((id) => { render(<AppProvider><Admin action="view" id={id} /></AppProvider>); });

users.command('delete <id>')
    .action((id) => { render(<AppProvider><Admin action="delete" id={id} /></AppProvider>); });


// --- COMING SOON SECTIONS -> NOW IMPLEMENTED ---
program.command('stats').action(() => { render(<AppProvider><StatsStub /></AppProvider>); });
program.command('privacy').action(() => { render(<AppProvider><ConfigStub /></AppProvider>); }); // Reuse config for privacy
program.command('settings').action(() => { render(<AppProvider><ConfigStub /></AppProvider>); });
program.command('ui').action(() => { render(<AppProvider><ConfigStub /></AppProvider>); }); // Show config for UI
program.command('data').action(() => { render(<AppProvider><DataStub /></AppProvider>); });
program.command('dev').action(() => { render(<AppProvider><ConfigStub /></AppProvider>); }); // Show config env
program.command('bot').action(() => { render(<AppProvider><BotStub /></AppProvider>); });

// Network Presence (from commands.md, distinct from 'social')
const net = program.command('network').description('Connection & Presence');
net.command('online').action(() => { render(<AppProvider><PresenceStub status="online" /></AppProvider>); });
net.command('offline').action(() => { render(<AppProvider><PresenceStub status="offline" /></AppProvider>); });


// Default
program.action(() => {
    render(
        <Box borderStyle="round" borderColor="green" padding={1} flexDirection="column">
            <Text color="green" bold>HackMate CLI 1.0</Text>
            <Text>Run <Text color="cyan">hackmate --help</Text> to see the new command tree.</Text>
        </Box>
    );
});

program.parse(process.argv);
