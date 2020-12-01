const {
    commaListsOr
} = require("common-tags");
const {
    WebhookClient,
    MessageEmbed
} = require("discord.js");
const {
    compareArrays
} = require("../structures/Utils");

module.exports = async (bot, oldMember, newMember) => {
    bot.db.query(`SELECT * FROM Logs WHERE guildID='${oldMember.guild.id}'`, async (err, logsSettings) => {
        if (logsSettings[0]) {
            if (logsSettings[0].channelID) {
                if (logsSettings[0].activated = "true") {
                    if (logsSettings[0].guildmemberupdate === "true") {
                        if (logsSettings[0].webhookID && logsSettings[0].webhookToken) {
                            const webhook = new WebhookClient(logsSettings[0].webhookID, logsSettings[0].webhookToken);


                            const embed = new MessageEmbed()
                                .setAuthor(`${newMember.user.username}#${newMember.user.discriminator}`, newMember.user.avatarURL())
                                .setDescription(`**${newMember.user.username}#${newMember.user.discriminator}** (${newMember} ${newMember.nickname ? `/ **${newMember.nickname}**)` : ')'} was updated.`)
                                .addField("Unknown Changes", "For a weird reason, this is empty... check the footer to see who updated the member.")

                            if (oldMember && newMember.nickname !== oldMember.nickname) {
                                embed.fields[0] = ({
                                    name: 'New nickname',
                                    value: `${newMember.nickname ? newMember.nickname : "None"}`
                                })
                                embed.fields.push({
                                    name: 'Old name',
                                    value: `${oldMember.nickname ? oldMember.nickname : "None"}`
                                })
                                embed.fields.push({
                                    name: 'ID',
                                    value: `${newMember.id}`,
                                    inline: true
                                })
                                webhook.send(embed);
                            }
                            if (oldMember && compareArrays(newMember.roles.cache.array(), oldMember.roles.cache.array())) return;
                            else {
                                newMember.guild.fetchAuditLogs({
                                    limit: 5,
                                    type: 25
                                }).then(async log => {
                                    if (!log.entries.first()) return;
                                    const pLogs = log.entries.filter(e => e.target.id == newMember.id)
                                    if (pLogs.length !== 0) log = pLogs.first();
                                    else return;
                                    if (log && Date.now() - ((log.id / 4194304) + 1420070400000) < 3000) {
                                        log.guild = []
                                        const executor = log.executor;

                                        const added = [];
                                        const removed = [];
                                        let color;
                                        if (log.changes[0].key === '$add') {
                                            if (log.changes[0].new.length !== 0) log.changes[0].new.forEach(r => added.push(r));
                                        }
                                        if (log.changes[0].key === '$remove') {
                                            if (log.changes[0].new.length !== 0) log.changes[0].new.forEach(r => removed.push(r));
                                        }
                                        console.log(newMember.guild.roles);
                                        if (added.length !== 0) roleColor = newMember.guild.roles.cache.find(r => r.id === added[0].id).color;
                                        if (removed.length !== 0) roleColor = newMember.guild.roles.cache.find(r => r.id === removed[0].id).color;
                                        embed.fields[0].name = `Roles`
                                        embed.fields[0].value = `${added.map(role => `<:plus:782417740525994017> **${role.name}**`).join('\n')}${removed.map((role, i) => `${i === 0 && added.length !== 0 ? '\n' : ''}\n:x: **${role.name}**`).join('\n')}`;
                                        embed.color = color;
                                        embed.footer = {
                                            text: `${executor.username}#${executor.discriminator}`,
                                            icon_url: `https://cdn.discordapp.com/avatars/${executor.id}/${executor.avatar}.png?size=512`
                                        }
                                        embed.fields.push({
                                            name: 'ID',
                                            value: `Member ID = ${newMember.id}\nExecutor = ${executor.id}`
                                        })
                                        webhook.send(embed);
                                    }
                                })
                            }
                        }
                    }
                }
            }
        }
    })
}