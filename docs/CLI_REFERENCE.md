# HackMate CLI Command Reference

This document lists all available commands in the HackMate CLI.

Usage: `hackmate [command] [options]`

## Authentication
*   `hackmate auth login`: Login to your account.
*   `hackmate auth signup`: Create a new account.

## Profile
*   `hackmate profile view`: View your own profile.
*   `hackmate profile edit`: Edit your profile details (Bio, Skills, Socials).

## Network (Friends)
*   `hackmate network list`: List your friends.
*   `hackmate network requests`: View pending friend requests.
*   `hackmate network add <username>`: Send a friend request to a user.
*   `hackmate network accept <username>`: Accept a friend request from a user.
*   `hackmate network block <username>`: Block a user.

## Chat
*   `hackmate chat <username>`: Start or continue a direct message chat with a user.
*   `hackmate groupchat <groupname>`: Join a group chat channel.

## Projects
*   `hackmate project list`: Browse all open projects.
*   `hackmate project create`: Post a new project.
*   `hackmate project view <id>`: View details of a specific project.
*   `hackmate project apply <id>`: Apply to collaborate on a project.
*   `hackmate project accept <id> <userId>`: Accept an applicant for your project.

## Groups (Communities)
*   `hackmate group list`: Browse all groups.
*   `hackmate group create`: Create a new community group.
*   `hackmate group view <id>`: View group details and members.
*   `hackmate group join <id>`: Request to join a group.
*   `hackmate group accept <id> <userId>`: Accept a user's request to join your group (Admin only).

## Notifications
*   `hackmate notification list`: View your recent system notifications.

## Discovery
*   `hackmate discover`: Find developers matching your criteria (Coming Soon).

## Admin (God Mode)
*   `hackmate admin users list`: List all users in the system.
*   `hackmate admin users view <id>`: View full details of any user.
*   `hackmate admin users delete <id>`: Delete a user account.
