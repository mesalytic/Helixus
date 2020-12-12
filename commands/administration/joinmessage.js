const {
    MessageEmbed
} = require("discord.js");
const ms = require('parse-ms');
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
            switch(args[0]) {
                case "on":
                    if (!rows[0]) this.bot.db.query(`INSERT INTO JoinMessages (guildID, activated) VALUES ('${message.guild.id}', 'true')`)
                    else this.bot.db.query(`UPDATE JoinMessages SET activated = 'true' WHERE guildID='${message.guild.id}'`)
                    message.channel.send(`[✅] - Join messages have been enabled. If you haven't already, check \`am!help joinmessage\` to see how to configure the join message.`)
                    break;
                case "off":
                    if (!rows[0]) return message.reply('[❌] - Join messages are currently not enabled.')
                    else this.bot.db.query(`UPDATE JoinMessages SET activated = 'false' WHERE guildID='${message.guild.id}'`)
                    message.channel.send(`[✅] - Join messages have been disabled.`)
                    break;
                case "channel":
                    let chanName = args.slice(1);
                    if (!chanName) return message.reply('[❌] - Please specify a channel name, ID, or mention!')
                    let chan = message.guild.channels.cache.find(chan => (chan.name === chanName.toString()) || (chan.id === chanName.toString().replace(/[^\w\s]/gi, '')));
                    if (!chan) return message.reply('[❌] - You haven\'t specified a valid channel.')

                    if (!rows[0]) return message.reply('[❌] - Join messages are currently not enabled.')
                    else this.bot.db.query(`UPDATE JoinMessages SET channelID = '${chan.id}' WHERE guildID='${message.guild.id}'`)
                    message.channel.send(`[✅] - Join messages will be sent to ${chan}.`)
                    break;
                default:
                    let content = args.join(" ");
                    if (!content) return message.reply('[❌] - Please specify the join message content. Check the `am!help joinmessage` page to see what tags you can use.')

                    if (!rows[0]) return message.reply('[❌] - Join messages are currently not enabled.')
                    else this.bot.db.query(`UPDATE JoinMessages SET joinmsg = '${content}' WHERE guildID='${message.guild.id}'`)

                    message.channel.send(`[✅] - The join message content has successfully been set.`)
                    break;
            }
        })
    }
}