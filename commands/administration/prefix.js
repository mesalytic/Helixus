const Command = require("../../structures/Command");

module.exports = class PrefixCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'prefix',
            usage: 'prefix [prefix]',
            description: 'Changes the bot\'s prefix on the server.',
            type: 'administration',
            userPermissions: ["MANAGE_GUILD"]
        });
    }

    async run(message, args) {
        message.client.db.query(`SELECT * FROM Prefixes WHERE guildID='${message.guild.id}'`, (err, rows) => {
            if (!args[0]) return message.channel.send(message.guild.lang.COMMANDS.PREFIX.actualPrefix(rows[0] ? rows[0].prefix : "am!"));
            if (args[0].length > 5) return message.reply(message.guild.lang.COMMANDS.PREFIX.tooLong)

            if (!rows[0]) message.client.db.query(`INSERT INTO Prefixes (guildID, prefix) VALUES ('${message.guild.id}', '${args[0]}')`);
            else message.client.db.query(`UPDATE Prefixes SET prefix = '${args[0]}' WHERE guildID='${message.guild.id}'`);

            return message.channel.send(message.guild.lang.COMMANDS.PREFIX.success(args[0]))
        })
    }
}