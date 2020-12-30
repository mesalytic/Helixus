const Command = require("../../structures/Command");

module.exports = class IgnoreCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'ignore',
            description: "Configure in which channel commands should be executed.",
            usage: 'ignore <channel>',
            examples: ['ignore #channel', 'ignore channel', 'ignore 264244524204202454'],
            type: 'administration',
            userPermissions: ["MANAGE_CHANNELS"]
        });
    }

    async run(message, args) {
        let chan = message.guild.channels.cache.find(chan => (chan.name === args.join(" ").toString()) || (chan.id === args.join(" ").toString().replace(/[^\w\s]/gi, '')));
        if (!chan) return message.reply(message.guild.lang.COMMANDS.IGNORE.noChanSpecified)
        this.bot.db.query(`SELECT * FROM IgnoreChannels WHERE channelID='${chan.id}'`, (err, rows) => {
            if (!rows[0]) {
                this.bot.db.query(`INSERT INTO IgnoreChannels (guildID, channelID, ignored) VALUES ('${message.guild.id}', '${chan.id}', "true")`);
                return message.channel.send(message.guild.lang.COMMANDS.IGNORE.noRowsIgnored(chan));
            } else {
                switch (rows[0].ignored) {
                    case "true":
                        this.bot.db.query(`UPDATE IgnoreChannels SET ignored = "false" WHERE channelID = '${chan.id}'`);
                        message.channel.send(message.guild.lang.COMMANDS.IGNORE.notIgnored)
                        break;
                    case "false":
                        this.bot.db.query(`UPDATE IgnoreChannels SET ignored = "true" WHERE channelID = '${chan.id}'`);
                        message.channel.send(message.guild.lang.COMMANDS.IGNORE.ignored)
                        break;
                }
            }
        })
    }
}