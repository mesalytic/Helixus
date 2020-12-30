const ms = require('parse-ms');
const Command = require("../../structures/Command");

module.exports = class LeaveMessageCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'leavemessage',
            description: "Configure the message that will display when a user leaves the server",
            usage: 'leavemessage <message>\nam!leavemessage <on/off>\nam!leavemessage channel <#channel>',
            examples: ['leavemessage channel #channel', 'leavemessage on', 'leavemessage off', 'leavemessage Welcome {user} to {server}.'],
            notes: 'Here is the list of tags you can use:\n\n{username} displays the username of the member\n{server} - displays the server name\n\nYou can use channel and role mentions like you would on an ordinary message.',
            aliases: ['leavemsg'],
            type: 'administration',
            userPermissions: ["MANAGE_CHANNELS"]
        });
    }

    async run(message, args) {
        if (!args[0]) return this.bot.commands.get("help").run(message, ["leavemessage"]);

        this.bot.db.query(`SELECT * FROM LeaveMessages WHERE guildID='${message.guild.id}'`, (err, rows) => {
            switch (args[0]) {
                case "on":
                    if (!rows[0]) this.bot.db.query(`INSERT INTO LeaveMessages (guildID, activated) VALUES ('${message.guild.id}', 'true')`)
                    else this.bot.db.query(`UPDATE LeaveMessages SET activated = 'true' WHERE guildID='${message.guild.id}'`)
                    message.channel.send(message.guild.lang.COMMANDS.LEAVEMESSAGE.ON.enabled)
                    break;
                case "off":
                    if (!rows[0]) return message.reply(message.guild.lang.COMMANDS.LEAVEMESSAGE.OFF.notEnabled)
                    else this.bot.db.query(`UPDATE LeaveMessages SET activated = 'false' WHERE guildID='${message.guild.id}'`)
                    message.channel.send(message.guild.lang.COMMANDS.LEAVEMESSAGE.OFF.disabled)
                    break;
                case "channel":
                    let chanName = args.slice(1);
                    if (!chanName) return message.reply(message.guild.lang.COMMANDS.LEAVEMESSAGE.channel.noChanSpecified)
                    let chan = message.guild.channels.cache.find(chan => (chan.name === chanName.toString()) || (chan.id === chanName.toString().replace(/[^\w\s]/gi, '')));
                    if (!chan) return message.reply(message.guild.lang.COMMANDS.LEAVEMESSAGE.CHANNEL.noValidChan)

                    if (!rows[0]) return message.reply(message.guild.lang.COMMANDS.LEAVEMESSAGE.CHANNEL.notEnabled)
                    else this.bot.db.query(`UPDATE LeaveMessages SET channelID = '${chan.id}' WHERE guildID='${message.guild.id}'`)
                    message.channel.send(message.guild.lang.COMMANDS.LEAVEMESSAGE.CHANNEL.success(chan))
                    break;
                default:
                    let content = args.leave(" ");
                    if (!content) return message.reply(message.guild.lang.COMMANDS.LEAVEMESSAGE.noContent)

                    if (!rows[0]) return message.reply(message.guild.lang.COMMANDS.LEAVEMESSAGE.notEnabled)
                    else this.bot.db.query(`UPDATE LeaveMessages SET leavemsg = '${content}' WHERE guildID='${message.guild.id}'`)

                    message.channel.send(message.guild.lang.COMMANDS.LEAVEMESSAGE.success)
                    break;
            }
        })
    }
}