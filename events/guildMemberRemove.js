const {
    WebhookClient,
    MessageEmbed
} = require("discord.js")

const moment = require('moment');

module.exports = async (bot, member) => {
    bot.db.query(`SELECT * FROM Logs WHERE guildID='${member.guild.id}'`, async (err, logsSettings) => {
        if (logsSettings[0]) {
            if (logsSettings[0].channelID) {
                if (logsSettings[0].activated = "true") {
                    if (logsSettings[0].guildmemberremove === "true") {
                        if (logsSettings[0].webhookID && logsSettings[0].webhookToken) {
                            const webhook = new WebhookClient(logsSettings[0].webhookID, logsSettings[0].webhookToken);

                            if (!member.createdAt) {
                                member.id = 'Unknown';
                                member.username = 'Unknown';
                                member.discriminator = 'Unknown'
                            }

                            let roles = [];
                            if (member.roles) {
                                member.roles.cache.forEach(roleID => {
                                    const role = member.guild.roles.cache.find(r => r.id === roleID)
                                    if (role) roles.push(role);
                                })
                            }

                            const rolesField = {
                                name: 'Roles',
                                value: roles.length === 0 ? 'None' : roles.map(r => r.name).join(', ')
                            }

                            if (!rolesField.value) rolesField.value = 'None';
                            if (!member.username) {
                                let embed = new MessageEmbed()
                                    .setColor("RANDOM")
                                    .setAuthor("Lurker", 'https://images.emojiterra.com/twitter/512px/1f440.png')
                                    .setDescription(`A lurker has left the server.`)
                            }

                            await setTimeout(async () => {
                                let logs = await member.guild.fetchAuditLogs({
                                    limit: 5,
                                    type: 20
                                }).catch(() => {})
                                if (!logs) return;

                                let log = logs.entries.first();

                                if (log && new Date().getTime() - new Date((log.id / 4194304) + 1420070400000).getTime() < 3000) {
                                    console.log(logs);
                                    let executor = member.guild.members.cache.get(log.executor.id);
                                    console.log(executor.user);

                                    let embed = new MessageEmbed()
                                        .setColor("RANDOM")
                                        .setAuthor(`${member.user.username}#${member.user.discriminator}`, `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=512`)
                                        .setDescription(`${member.user.username}#${member.user.discriminator} has been kicked.`)
                                        .addField('User infos', `ID: **${member.id}**${member.bot ? '\nIs a bot' : ''}`)
                                        .addField(rolesField.name, rolesField.value)
                                        .addField('Reason', log.reason ? log.reason : "None provided.")
                                        .setFooter(`${executor.user.username}#${executor.user.discriminator}`, `https://cdn.discordapp.com/avatars/${executor.user.id}/${executor.user.avatar}.png?size=512`)
                                        .setTimestamp();

                                    webhook.send(embed);
                                } else {
                                    let embed = new MessageEmbed()
                                        .setColor("RANDOM")
                                        .setAuthor(`${member.user.username}#${member.user.discriminator}`, `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png?size=512`)
                                        .setDescription(`${member.user.username}#${member.user.discriminator} has left the server.`)
                                        .addField('User infos', `ID: **${member.id}**${member.bot ? '\nIs a bot' : ''}`)
                                        .addField(rolesField.name, rolesField.value)
                                        .setFooter(`${member.user.username}#${member.user.discriminator}`, `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png?size=512`)
                                        .setTimestamp();

                                    webhook.send(embed);
                                }
                            })
                        }
                    }
                }
            }
        }
    })
}