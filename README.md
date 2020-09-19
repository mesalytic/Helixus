# Helixus (v2)


Helixus is a multi-function Discord bot coded in Javascript using [discord.js](https://discord.js.org).

**This is the V2 branch of the bot. As the V3 is in the works, this repo will not be updated (unless major bugs needs fixing before V3 arrival). However, this is most stable version of the bot right now, so you're still encouraged in using this version of the bot.**


**Website** : _currently in rework_

[**Invite link**](https://is.gd/Helixus)

[**Server Invite**](https://is.gd/HelixusServer)
## Table of Contents

- [Permissions](#permissions)
- [Installation](#installation)
    - [Before you begin](#before-you-begin)
    - [Windows](#windows)
    - [Ubuntu/Debian based](#ubuntudebian-based)
- [Config File](#config-file)

## Permissions

Helixus needs several permissions. You might lose the ability to use commands if you don't have some of them.

- **Manage Roles [MANAGE_ROLES]**
- **Ban Members [BAN_MEMBERS]**
- **Kick Members [KICK_MEMBERS]**
- **Manage Emojis [MANAGE_EMOJIS]**
- **View Audit Logs [VIEW_AUDIT_LOGS]**
- **Manage Messages [MANAGE_MESSAGES]**
- **Manage Channels [MANAGE_CHANNELS]**
- **Attach Files [ATTACH_FILES] [EMBED_LINKS]**

If you want you have the ability to give the **Administrator [ADMINISTRATOR]** permissions to the bot, but is not recommended in case of any hacks or anything of some sorts.

## Installation
### Before you begin

- **You should have minimum knowledge about NodeJS. No technical support will be provided.**

- Please be aware that this version of the repository is a sharded version. A non sharded version will be available later.

- You will need [NodeJS (v12)](https://nodejs.org), [Git](https://git-scm.com/) and a database server using either [MariaDB](https://mariadb.org/) or [MySQL](https://www.mysql.com/).
- Clone this repository using `git clone https://github.com/chocololat/HelixusV2.git`
- Access the created folder using `cd HelixusV2` with either **PowerShell [recommended]** or the **Command Prompt**.
- Fill the config.json file. (See [Config File](#config-file).) 

### Windows

- Open an **ADMINISTRATOR** PowerShell or Command Prompt and run the command `npm i -g --production windows-build-tools`
- Follow these instructions to [install node-canvas](https://github.com/Automattic/node-canvas/wiki/Installation:-Windows)
- Follow these instructions to [install FFmpeg](https://www.wikihow.com/Install-FFmpeg-on-Windows)
- Run `npm i --save` to install the modules required by Helixus.
- Run `npm i -g pm2` to install PM2.
- Run `pm2 start manager.js` to run the bot.

### Ubuntu/Debian based

- Run `apt update`
- Run `apt upgrade`
- Run `apt install ffmpeg python` to install FFmpeg and Python.
- Run `sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev`
- Run `npm i --save` to install the modules required by Helixus.
- Run `npm i -g pm2` to install PM2.
- Run `pm2 start manager.js` to run the bot.

## Config File

In order for the bot to run properly, you need to fill a JSON config file.

- **token** : Bot's token. [_**required**_]
- **dbhost** : The IP address of the database server. (can be localhost) [_**required**_]
- **dbpassword**: The password of the Database Server. [_**required**_]
- **Discord Webhooks**:
    - **status**: Used to display status events (disconnections, restarts, connections) [_**optional**_]
    - **joinleaves**: Used to display if the bot has been added or removed from a server. [_**optional**_]
    - **errors**: Used to display errors if any. [_**required**_]
    -**commands**: Used to log commands. Recommended if spam abuse. [_**optional**_]
- **osu**: API used by the osu! command. Consult the [osu! website](https://osu.ppy.sh/p/api) and the [docs](https://github.com/ppy/osu-api/wiki). [_**optional**_]
- **googlekey**: API used for the YouTube search feature. [_**optional**_]
- **GitHub**: (if you have a public repository and want to use the changelog command)
    - **repo_username**: The username/group linked to your repository (case-sensitive) [_**optional**_]
    - **repo_name**: Your GitHub repository (case-sensitive) [_**optional**_]
    - **username**: Your GitHub username. (case-sensitive) [_**optional**_]
    - **password**: Your GitHub password. (case-sensitive) [_**optional**_]
