const Command = require("../../structures/Command");

module.exports = class AutoroleCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'autorole',
            type: 'administration',
            description: 'Allows you to configure a role which will be given to new members.',
            usage: 'autorole ["off" | Role]',
            examples: ['autorole off', 'autorole @Role', 'autorole Role', 'autorole 437191604370145283'],
            userPermissions: ['MANAGE_ROLES'],
            clientPermissions: ["MANAGE_ROLES"]
        });
    }

    async run(message, args) {
        if (!args[0]) return this.bot.commands.get("help").run(message, ["autorole"]);

        this.bot.db.query(`SELECT * FROM Autorole WHERE guildID='${message.guild.id}'`, (err, rows) => {

            if (args[0] === "off") {
                if (!rows[0] || !rows[0].roleID) return message.channel.send(message.guild.lang.COMMANDS.AUTOROLE.OFF.noRoleConfigured);

                this.bot.db.query(`DELETE FROM Autorole WHERE guildID='${message.guild.id}'`);
                return message.channel.send(message.guild.lang.COMMANDS.AUTOROLE.OFF.removed);
            }

            const role = message.guild.roles.resolve(args.join(" ")) || message.guild.roles.cache.find(r => r.name === args.join(" ")) || message.mentions.roles.first();
            if (role) {
                if (!rows[0]) this.bot.db.query(`INSERT INTO Autorole (roleID, guildID) VALUES ('${role.id}', '${message.guild.id}')`)
                else this.bot.db.query(`UPDATE Autorole SET roleID='${role.id}' WHERE guildID='${message.guild.id}'`);
                return message.channel.send(message.guild.lang.COMMANDS.AUTOROLE.added(role))
            } else {
                return message.channel.send(message.guild.lang.COMMANDS.AUTOROLE.notFound)
            }
        })
    }
}