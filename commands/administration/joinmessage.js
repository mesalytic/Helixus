const Command = require("../../structures/Command");

module.exports = class JoinMessageCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'joinmessage',
            description: "Configure the message that will display when a user joins the server",
            usage: 'joinmessage <message>\nam!joinmessage <on/off>\nam!joinmessage channel <#channel>',
            examples: ['joinmessage channel #channel', 'joinmessage on', 'joinmessage off', 'joinmessage Welcome {user} to {server}.'],
            notes: 'Here is the list of tags you can use:\n\n{user} - mentions the user\n{username} displays the username of the member\n{server} - displays the server name\n\nYou can use channel and role mentions like you would on an ordinary message.',
            aliases: ['joinmsg'],
            type: 'administration',
            userPermissions: ["MANAGE_CHANNELS"]
        });
    }

    async run(message, args) {
        if (!args[0]) return this.bot.commands.get("help").run(message, ["joinmessage"]);

        this.bot.db.query(`SELECT * FROM JoinMessages WHERE guildID='${message.guild.id}'`, (err, rows) => {
            switch (args[0]) {
                case "on":
                    if (!rows[0]) this.bot.db.query(`INSERT INTO JoinMessages (guildID, activated) VALUES ('${message.guild.id}', 'true')`)
                    else this.bot.db.query(`UPDATE JoinMessages SET activated = 'true' WHERE guildID='${message.guild.id}'`)
                    message.channel.send(message.guild.lang.COMMANDS.JOINMESSAGE.ON.enabled)
                    break;
                case "off":
                    if (!rows[0]) return message.reply(message.guild.lang.COMMANDS.JOINMESSAGE.OFF.notEnabled)
                    else this.bot.db.query(`UPDATE JoinMessages SET activated = 'false' WHERE guildID='${message.guild.id}'`)
                    message.channel.send(message.guild.lang.COMMANDS.JOINMESSAGE.OFF.disabled);
                    break;
                case "channel":
                    let chanName = args.slice(1);
                    if (!chanName) return message.reply(message.guild.lang.COMMANDS.JOINMESSAGE.CHANNEL.noChanSpecified)
                    let chan = message.guild.channels.cache.find(channel => (channel.name === chanName.toString()) || (channel.id === chanName.toString().replace(/[^\w\s]/gi, '')));
                    if (!chan) return message.reply(message.guild.lang.COMMANDS.JOINMESSAGE.CHANNEL.noValidChan)

                    if (!rows[0]) return message.reply(message.guild.lang.COMMANDS.JOINMESSAGE.CHANNEL.notEnabled)
                    else this.bot.db.query(`UPDATE JoinMessages SET channelID = '${chan.id}' WHERE guildID='${message.guild.id}'`)
                    message.channel.send(message.guild.lang.COMMANDS.JOINMESSAGE.CHANNEL.success(chan))
                    break;
                default:
                    let content = args.join(" ");
                    if (!content) return message.reply(message.guild.lang.COMMANDS.JOINMESSAGE.noContent)

                    if (!rows[0]) return message.reply(message.guild.lang.COMMANDS.JOINMESSAGE.notEnabled)
                    else this.bot.db.query(`UPDATE JoinMessages SET joinmsg = '${content}' WHERE guildID='${message.guild.id}'`)

                    message.channel.send(message.guild.lang.COMMANDS.JOINMESSAGE.success)
                    break;
            }
        })
    }
}