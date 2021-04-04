const {
    WebhookClient
} = require("discord.js");
const Command = require("../../structures/Command");
const {
    loggingEventsList
} = require("../../structures/Constants");

module.exports = class LogsCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'logs',
            description: 'Lets you configure the logging system.',
            type: 'administration',
            usage: 'logs <on/channel/ignore/toggle> <channel/mods>',
            examples: ["logs on #channel", "logs channel #channel", "logs ignore #channel", "logs toggle channelupdate"],
            userPermissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"]
        });
    }

    async run(message, args) {
        if (!args[0]) return this.bot.commands.get("help").run(message, ["logs"])

        if (args[0] === "on") {
            if (!message.mentions.channels.first()) return message.reply(message.guild.lang.COMMANDS.LOGS.noChanSpecified);

            let channel = message.mentions.channels.first()

            this.bot.db.query(`SELECT * FROM Logs WHERE guildID='${message.guild.id}'`, (err, rows) => {
                if (rows[0]) return message.reply(message.guild.lang.COMMANDS.LOGS.ON.alreadyEnabled)
                else {
                    channel.createWebhook('Helixus Logger', {
                        reason: "Logging activation.",
                    }).then(wb => {
                        this.bot.db.query(`INSERT INTO Logs (guildID, channelID, webhookID, webhookToken) VALUES ('${message.guild.id}', '${channel.id}', '${wb.id}', '${wb.token}')`)
                        return message.channel.send(message.guild.lang.COMMANDS.LOGS.ON.enabled)
                    })
                }
            })
        }

        if (args[0] === "off") {
            this.bot.db.query(`SELECT * FROM Logs WHERE guildID='${message.guild.id}'`, (err, rows) => {
                if (!rows[0] || rows[0].activated === "false") return message.reply(message.guild.lang.COMMANDS.LOGS.OFF.alreadyDisabled)
                else {
                        this.bot.db.query(`UPDATE Logs SET activated='false' WHERE guildID='${message.guild.id}'`)
                        return message.channel.send(message.guild.lang.COMMANDS.LOGS.OFF.disabled)
                }
            })
        }

        if (args[0] === "channel") {
            if (!message.mentions.channels.first()) return message.reply(message.guild.lang.COMMANDS.LOGS.CHANNEL.noChanSpecified);

            let channel = message.mentions.channels.first()

            this.bot.db.query(`SELECT * FROM Logs WHERE guildID='${message.guild.id}'`, (err, rows) => {
                if (!rows[0]) return message.reply(message.guild.lang.COMMANDS.LOGS.CHANNEL.notEnabled)
                else {
                    let wb = new WebhookClient(rows[0].webhookID, rows[0].webhookToken);

                    wb.delete()
                    channel.createWebhook('Helixus Logger', {
                        reason: "Logging activation.",
                    }).then(wb => {
                        this.bot.db.query(`UPDATE Logs SET channelID='${channel.id}', webhookID='${wb.id}', webhookToken='${wb.token}' WHERE guildID='${message.guild.id}'`)
                        return message.channel.send(message.guild.lang.COMMANDS.LOGS.CHANNEL.success)
                    })
                }
            })
        }

        if (args[0] === "ignore") {
            if (!message.mentions.channels.first()) return message.reply(message.guild.lang.COMMANDS.LOGS.IGNORE.noChanSpecified);

            let channel = message.mentions.channels.first()
            this.bot.db.query(`SELECT * FROM LogsIgnore WHERE channelID='${channel.id}'`, (err, rows) => {
                if (!rows[0]) {
                    this.bot.db.query(`INSERT INTO LogsIgnore (guildID, channelID, ignored) VALUES ('${message.guild.id}', '${channel.id}', 'true')`);
                    return message.channel.send(message.guild.lang.COMMANDS.LOGS.IGNORE.ignored)
                } else {
                    if (rows[0].ignored === "false") {
                        this.bot.db.query(`UPDATE LogsIgnore SET ignored='true' WHERE channelID='${channel.id}'`)
                        return message.channel.send(message.guild.lang.COMMANDS.LOGS.IGNORE.ignored)
                    } else {
                        this.bot.db.query(`UPDATE LogsIgnore SET ignored='false' WHERE channelID='${channel.id}'`)
                        return message.channel.send(message.guild.lang.COMMANDS.LOGS.IGNORE.notIgnored)
                    }
                }
            })
        }
        if (args[0] === "toggle") {
            if (!args[1] || !loggingEventsList.includes(args[1].toLowerCase())) return message.reply(message.guild.lang.COMMANDS.LOGS.TOGGLE.notValidEvent(loggingEventsList.join(', ')));

            this.bot.db.query(`SELECT * FROM Logs WHERE guildID='${message.guild.id}'`, (err, rows) => {
                if (!rows[0]) return message.reply(message.guild.lang.COMMANDS.LOGS.TOGGLE.notEnabled);
                else {
                    if (rows[0][args[1].toLowerCase()] === "false") {
                        this.bot.db.query(`UPDATE Logs SET ${args[1].toLowerCase()} = 'true' WHERE guildID='${message.guild.id}'`);
                        return message.channel.send(message.guild.lang.COMMANDS.LOGS.TOGGLE.eventEnabled);
                    } else {
                        this.bot.db.query(`UPDATE Logs SET ${args[1].toLowerCase()} = 'false' WHERE guildID='${message.guild.id}'`);
                        return message.channel.send(message.guild.lang.COMMANDS.LOGS.TOGGLE.eventDisabled);
                    }
                }
            })
        }
    }
}