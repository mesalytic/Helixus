const {
    WebhookClient,
    MessageEmbed
} = require("discord.js")
const moment = require('moment');

module.exports = async (bot, oldMember, newMember) => {
    bot.db.query(`SELECT * FROM Logs WHERE guildID='${oldMember.guild.id}'`, async (err, rows) => {
        if (rows[0]) {
            if (rows[0].channelID) {
                if (rows[0].activated === "true") {
                    if (rows[0].guildmemberupdate === "true") {
                        if (rows[0].webhookID && rows[0].webhookToken) {
                            const wb = new WebhookClient(rows[0].webhookID, rows[0].webhookToken);
                            if (oldMember.nickname !== newMember.nickname) {
                                let oMemberNick;
                                if (oldMember.nickname === null) {
                                    oMemberNick = "No old nickname";
                                } else {
                                    oMemberNick = oldMember.nickname;
                                }
                                let nMemberNick;
                                if (newMember.nickname === null) {
                                    nMemberNick = "No new nickname.";
                                } else {
                                    nMemberNick = newMember.nickname;
                                }
                                const entry = await newMember.guild.fetchAuditLogs({
                                        type: "MEMBER_UPDATE",
                                    })
                                    .then((audit) => {
                                        const str = "**${newMember.user.tag}**'s nickname in the server has changed.";
                                        const res = str.replace("${newMember.user.tag}", newMember.user.tag);
                                        const nickEmbed = new MessageEmbed()
                                            .setAuthor(newMember.user.tag, newMember.user.avatarURL())
                                            .setDescription(res)
                                            .addField("Old nickname", oMemberNick)
                                            .addField("New nickname", nMemberNick)
                                            .addField("Changed by", audit.entries.first().executor.tag)
                                            .setColor("RANDOM");
                                        wb.send(nickEmbed);
                                    });
                            }
                            var newrole = "`" + newMember.roles.cache.filter((r) => oldMember.roles.cache.map((r) => r.id).join(", ").indexOf(r.id) == -1).map((r) => r.name) + "`";
                            var oldrole = "`" + oldMember.roles.cache.filter((r) => newMember.roles.cache.map((r) => r.id).indexOf(r.id) == -1).map((r) => r.name) + "`";

                            if (newrole !== "``") {
                                const entry = await newMember.guild.fetchAuditLogs({
                                        type: "MEMBER_ROLE_UPDATE",
                                    })
                                    .then((audit) => {
                                        const str = "**${newMember.user.tag}** got a new role.";
                                        const res = str.replace("${newMember.user.tag}", newMember.user.tag);
                                        const nickEmbed = new MessageEmbed()
                                            .setAuthor(newMember.user.username, newMember.user.avatarURL())
                                            .setDescription(res)
                                            .addField("Role Obtained", newrole)
                                            .addField("Given by", audit.entries.first().executor.tag)
                                            .setColor("RANDOM");
                                        wb.send(nickEmbed);
                                    });
                            }
                            if (oldrole !== "``") {
                                const entry = await newMember.guild.fetchAuditLogs({
                                    type: "MEMBER_ROLE_UPDATE",
                                }).then((audit) => {
                                    const str = "**${newMember.user.tag}** lost a role.";
                                    const res = str.replace("${newMember.user.tag}", newMember.user.tag);
                                    const nickEmbed = new MessageEmbed()
                                        .setAuthor(newMember.user.tag, newMember.user.avatarURL())
                                        .setDescription(res)
                                        .addField("Lost Role", oldrole)
                                        .addField("Removed by", audit.entries.first().executor.tag)
                                        .setColor("RANDOM");
                                    wb.send(nickEmbed);
                                });
                            }
                        }
                    }
                }
            }
        }
    });
}
