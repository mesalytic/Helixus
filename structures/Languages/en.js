module.exports = {
    COMMANDS: {
        AUTOROLE: {
            description: 'Allows you to configure a role which will be given to new members.',
            OFF: {
                noRoleConfigured: '[❌] - No role has been configured.',
                removed: '[✅] - The role has been removed from the autorole.'
            },
            added: (role) => `[✅] - The role ${role} will now be given to new members.`,
            notFound: '[❌] - The role has not been found.'
        },
        BALANCE: {
            description: "Displays your current balance.",
            output: (bal) => `You have <a:coin:784930553748520961> **${bal}** coins!`
        },
        DAILY: {
            description: "Gives you coins daily!",
            notReady: (time) => `You already collected your daily bonus! Come back in ${time.hours}:${time.minutes}:${time.seconds} !`,
            success: (amount) => `You've collected your daily reward of ${amount} coins!`
        },
        IGNORE: {
            description: "Configure in which channel commands should be executed.",
            noChanSpecified: "[❌] - You haven\'t specified a channel to ignore.",
            noRowsIgnored: (chan) => `[✅] - ${chan} will now be ignored for commands.`,
            notIgnored: (chan) => `[✅] - ${chan} will now be listened for commands again.`,
            ignored: (chan) => `[✅] - ${chan} will now be ignored for commands.`
        },
        JOINMESSAGE: {
            description: "Configure the message that will display when a user joins the server",
            notes: 'Here is the list of tags you can use:\n\n{user} - mentions the user\n{username} displays the username of the member\n{server} - displays the server name\n\nYou can use channel and role mentions like you would on an ordinary message.',
            ON: {
                enabled: `[✅] - Join messages have been enabled. If you haven't already, check \`am!help joinmessage\` to see how to configure the join message.`
            },
            OFF: {
                notEnabled: '[❌] - Join messages are currently not enabled.',
                disabled: `[✅] - Join messages have been disabled.`
            },
            CHANNEL: {
                noChanSpecified: '[❌] - Please specify a channel name, ID, or mention!',
                noValidChan: '[❌] - You haven\'t specified a valid channel.',
                notEnabled: '[❌] - Join messages are currently not enabled.',
                success: (chan) => `[✅] - Join messages will be sent to ${chan}.`
            },
            noContent: '[❌] - Please specify the join message content. Check the `am!help joinmessage` page to see what tags you can use.',
            notEnabled: '[❌] - Join messages are currently not enabled.',
            success: `[✅] - The join message content has successfully been set.`
        },
        LANG: {
            description: 'Changes the bot\'s language on the server.',
            success: `[V] - The server language has been updated to **English**!`
        },
        LEAVEMESSAGE: {
            description: "Configure the message that will display when a user leaves the server",
            notes: 'Here is the list of tags you can use:\n\n{username} displays the username of the member\n{server} - displays the server name\n\nYou can use channel and role mentions like you would on an ordinary message.',
            ON: {
                enabled: `[✅] - Leave messages have been enabled. If you haven't already, check \`am!help leavemessage\` to see how to configure the leave message.`
            },
            OFF: {
                notEnabled: '[❌] - Leave messages are currently not enabled.',
                disabled: `[✅] - Leave messages have been disabled.`
            },
            CHANNEL: {
                noChanSpecified: '[❌] - Please specify a channel name, ID, or mention!',
                noValidChan: '[❌] - You haven\'t specified a valid channel.',
                notEnabled: '[❌] - Leave messages are currently not enabled.',
                success: (chan) => `[✅] - Leave messages will be sent to ${chan}.`
            },
            noContent: '[❌] - Please specify the leave message content. Check the `am!help leavemessage` page to see what tags you can use.',
            notEnabled: '[❌] - Leave messages are currently not enabled.',
            success: `[✅] - The leave message content has successfully been set.`
        },
        LOGS: {
            description: 'Lets you configure the logging system.',
            ON: {
                alreadyEnabled: '[❌] - Logs are already activated in this server!',
                enabled: `✅ - Logs are now enabled in this server.`
            },
            CHANNEL: {
                noChanSpecified: '[❌] - Please specify a channel name, ID, or mention!',
                notEnabled: `[❌] - Logs are not activated in this server.`,
                success: (channel) => `✅ - Logs will now be sent to ${channel}`
            },
            IGNORE: {
                noChanSpecified: '[❌] - Please specify a channel name, ID, or mention!',
                ignored: '[✅] - This channel will now be ignored for logging.',
                notIgnored: '[✅] - This channel will now stop being ignored for logging.'
            },
            TOGGLE: {
                notValidEvent: (logsEventList) => `[❌] - Please provide a valid event.\nValid events: \`${logsEventList}\``,
                notEnabled: `[❌] - Logs are not activated in this server.`,
                eventEnabled: '[✅] - This event will now be logged in this server.',
                eventDisabled: '[✅] - This event will stop being logged in this server.'
            },
            noChanSpecified: "[❌] - Please mention a channel.",
        },
        TRANSLATE: {
            description: 'Allows you to translate text.',
            embedAuthor: "Translate",
            embedTranslatedFrom: (translatedFrom) => `Translated from ${translatedFrom}`,
            embedTranslatedTo: (target) => `to ${target}`
        }
    }
}