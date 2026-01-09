#!/usr/bin/env node
import React from 'react';
import { render, Text, Box } from 'ink';
import { Command } from 'commander';

const program = new Command();
import { Login, Signup } from './commands/auth/index.js';
import { Admin } from './commands/admin/index.js';
import { Network } from './commands/network/index.js';
import { Project } from './commands/project/index.js';
import { Group } from './commands/group/index.js';
import { Notification } from './commands/notification/index.js';
import { ProfileView, ProfileEdit } from './commands/profile/index.js';
import { Chat } from './commands/chat/index.js';

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
    .command('auth')
    .command('signup')
    .description('Create a new account')
    .action(() => {
        render(<Signup />);
    });

program
    .command('admin')
    .description('Admin commands')
    .command('users')
    .description('User management')
    .command('list')
    .description('List all users')
    .action(() => {
        render(<Admin action="list" />);
    });

program
    .command('admin')
    .command('users')
    .command('view <id>')
    .description('View user details')
    .action((id) => {
        render(<Admin action="view" id={id} />);
    });

program
    .command('admin')
    .command('users')
    .command('delete <id>')
    .description('Delete a user')
    .action((id) => {
        render(<Admin action="delete" id={id} />);
    });

program
    .command('network')
    .description('Manage your network')
    .command('list')
    .description('List friends')
    .action(() => {
        render(<Network action="list" />);
    });

program
    .command('network')
    .command('requests')
    .description('List pending requests')
    .action(() => {
        render(<Network action="requests" />);
    });

program
    .command('network')
    .command('add <username>')
    .description('Send friend request')
    .action((username) => {
        render(<Network action="add" target={username} />);
    });

program
    .command('network')
    .command('accept <username>')
    .description('Accept friend request')
    .action((username) => {
        render(<Network action="accept" target={username} />);
    });

program
    .command('network')
    .command('block <username>')
    .description('Block a user')
    .action((username) => {
        render(<Network action="block" target={username} />);
    });

program
    .command('project')
    .description('Manage projects')
    .command('list')
    .description('List open projects')
    .action(() => {
        render(<Project action="list" />);
    });

program
    .command('project')
    .command('create')
    .description('Create a new project')
    .action(() => {
        render(<Project action="create" />);
    });

program
    .command('project')
    .command('view <id>')
    .description('View project details')
    .action((id) => {
        render(<Project action="view" id={id} />);
    });

program
    .command('project')
    .command('apply <id>')
    .description('Apply to a project')
    .action((id) => {
        render(<Project action="apply" id={id} />);
    });

program
    .command('project')
    .command('accept <id> <userId>')
    .description('Accept an applicant')
    .action((id, userId) => {
        render(<Project action="accept" id={id} extraArg={userId} />);
    });

program
    .command('group')
    .description('Manage groups')
    .command('list')
    .description('List groups')
    .action(() => {
        render(<Group action="list" />);
    });

program
    .command('group')
    .command('create')
    .description('Create group')
    .action(() => {
        render(<Group action="create" />);
    });

program
    .command('group')
    .command('view <id>')
    .description('View group')
    .action((id) => {
        render(<Group action="view" id={id} />);
    });

program
    .command('group')
    .command('join <id>')
    .description('Join group')
    .action((id) => {
        render(<Group action="join" id={id} />);
    });

program
    .command('group')
    .command('accept <id> <userId>')
    .description('Accept join request (Admin)')
    .action((id, userId) => {
        render(<Group action="accept" id={id} extraArg={userId} />);
    });

program
    .command('notification')
    .description('View notifications')
    .command('list')
    .action(() => {
        render(<Notification action="list" />);
    });

program
    .command('chat <username>')
    .description('Chat with a user')
    .action((username) => {
        render(<Chat targetUsername={username} />);
    });

program
    .command('groupchat <groupname>')
    .description('Chat in a group')
    .action((groupname) => {
        render(<Chat groupName={groupname} />);
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
