const Command = require("../../structures/Command");

module.exports = class UnmuteCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'unmute',
            usage: 'unmute <@user>',
            description: 'Unmutes the specified user.',
            type: 'moderation',
            userPermissions: ["KICK_MEMBERS"],
            clientPermissions: ["KICK_MEMBERS"]
        });
    }

    async run(message, args) {
        let member = message.mentions.members.first();
        if (!member) return this.bot.commands.get("help").run(message, ["unmute"]);

        this.bot.db.query(`SELECT * FROM MuteConfig WHERE guildID='${message.guild.id}'`, async (err, rows) => {
            let muteRole;

            if (!rows[0] || !message.guild.roles.cache.get(rows[0].muteRoleID)) {
                return message.reply(message.guild.lang.COMMANDS.UNMUTE.roleNotFound)
            } else muteRole = message.guild.roles.cache.get(rows[0].muteRoleID);

            if (!member.roles.cache.get(muteRole.id)) {
                return message.reply(message.guild.lang.COMMANDS.UNMUTE.notMuted);
            }
            let roleArray = [];
            this.bot.db.query(`SELECT * FROM MuteRoles WHERE mutedID='${member.id}' AND guildID='${message.guild.id}'`, (err, rows) => {
                if (!rows[0]) return message.reply(message.guild.lang.COMMANDS.UNMUTE.notMuted);
                rows.forEach(r => roleArray.push(r.roleID));

                member.roles.remove(muteRole).then(() => {
                    member.roles.add(roleArray);
                    return message.channel.send(message.guild.lang.COMMANDS.UNMUTE.unmuted)
                })
            })
        })
    }
}