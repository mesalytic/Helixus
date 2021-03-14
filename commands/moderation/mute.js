const {
    ReactionCollector
} = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class MuteCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'mute',
            usage: 'mute <@user>',
            description: 'Mutes the specified user.',
            notes: "It will remove the actual roles of the member and adding the Muted role. You MUST use `am!unmute` to unmute someone, as it will give back their roles prior to the mute.",
            type: 'moderation',
            userPermissions: ["KICK_MEMBERS"],
            clientPermissions: ["KICK_MEMBERS"]
        });
    }

    async run(message, args) {
        let member = message.mentions.members.first();
        if (!member) return this.bot.commands.get("help").run(message, ["mute"]);

        if (member.permissions.has("MANAGE_ROLES")) return message.reply(message.guild.lang.COMMANDS.MUTE.cantMute);

        this.bot.db.query(`SELECT * FROM MuteConfig WHERE guildID='${message.guild.id}'`, async (err, rows) => {
            let muteRole;

            if (!rows[0] || !message.guild.roles.cache.get(rows[0].muteRoleID)) {
                message.guild.roles.create({
                    data: {
                        name: 'Muted',
                        permissions: 0
                    }
                }).then(role => {
                    message.guild.channels.cache.forEach(chan => {
                        if (chan.type === 'voice') chan.createOverwrite(role.id, {
                            SPEAK: false
                        })
                        if (chan.type === 'text') chan.createOverwrite(role.id, {
                            SEND_MESSAGES: false
                        });
                    })

                    muteRole = role;
                })
            } else muteRole = message.guild.roles.cache.get(rows[0].muteRoleID);

            let m = await message.channel.send(message.guild.lang.COMMANDS.MUTE.confirmation(member));

            m.react("✅").then(() => {
                m.react("❌").then(() => {
                    const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                    const reactionCollector = new ReactionCollector(m, filter, {
                        time: 60000
                    })

                    reactionCollector.on('collect', reaction => {
                        switch (reaction.emoji.name) {
                            case '✅':
                                let roleArray = [];
                                member.roles.cache.map(role => {
                                    if (role.managed || role.id === message.guild.id) return;
                                    roleArray.push(role.id);
                                    this.bot.db.query(`SELECT * FROM MuteRoles WHERE mutedID='${member.id}' AND roleID='${role.id}' AND guildID='${message.guild.id}'`, (err, rows) => {
                                        if (!rows[0]) this.bot.db.query(`INSERT INTO MuteRoles (roleID, mutedID, guildID) VALUES ('${role.id}', '${member.id}', '${message.guild.id}')`);
                                    })
                                });
                                member.roles.remove(roleArray).then(() => {
                                    member.roles.add(muteRole.id);
                                    message.channel.send(message.guild.lang.COMMANDS.MUTE.muted);
                                })
                            case '❌':
                                reactionCollector.stop("cancelled");
                        }
                    })

                    reactionCollector.on('end', (collected, reason) => {
                        if (!collected.first() || (collected.first().emoji.name === "❌" && reason === "cancelled")) m.edit(message.guild.lang.COMMANDS.MUTE.cancelled);
                    })
                })
            })
        })
    }
}