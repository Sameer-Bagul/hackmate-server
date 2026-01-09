#!/usr/bin/env node
import React from 'react';
import { render, Text, Box } from 'ink';
import { Command } from 'commander';

const program = new Command();
import { Login } from './commands/Login.js';
import { ProfileView } from './commands/ProfileView.js';
import { ProfileEdit } from './commands/ProfileEdit.js';
import { Chat } from './commands/Chat.js';

program
    .name('hackmate')
    .description('The Terminal Social Network for Hackers')
    .version('0.0.1');

program
    .command('auth')
    .description('Authentication commands')
    .command('login')
    .description('Login to HackMate')
    .action(() => {
        render(<Login />);
    });

program
    .command('profile')
    .description('Profile commands')
    .command('view')
    .description('View your profile')
    .action(() => {
        render(<ProfileView />);
    });

program
    .command('profile')
    .command('edit')
    .description('Edit your profile')
    .action(() => {
        render(<ProfileEdit />);
    });

import { Discover } from './commands/Discover.js';

program
    .command('discover')
    .description('Find matching developers')
    .action(() => {
        render(<Discover />);
    });

program
    .command('chat [username]')
    .description('Chat with a user')
    .action((username) => {
        render(<Chat targetUsername={username} />);
    });

program.action(() => {
    render(
        <Box borderStyle="round" borderColor="green" padding={1} flexDirection="column">
            <Text color="green" bold>Welcome to HackMate CLI</Text>
            <Text>Run <Text color="cyan">hackmate --help</Text> to see available commands.</Text>
        </Box>
    );
});

program.parse(process.argv);
