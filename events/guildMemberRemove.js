const {
    WebhookClient,
    MessageEmbed
} = require("discord.js")

const moment = require('moment');

module.exports = async (bot, guild, member) => {
    bot.db.query(`SELECT * FROM Logs WHERE guildID='${guild.id}'`, async (err, logsSettings) => {
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
                                    const role = guild.roles.cache.find(r => r.id === roleID)
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
                                let logs = await guild.fetchAuditLogs({ limit:5, type:20 }).catch(() => {})
                                if (!logs) return;

                                let log = logs.entries.first();

                                if (new Date().getTime() - new Date((log.id / 4194304) + 1420070400000).getTime() < 3000) {
                                    let user = logs.users.find(u => u.id !== member.id);
                                    
                                    let embed = new MessageEmbed()
                                        .setColor("RANDOM")
                                        .setAuthor(`${member.username}#${member.discriminator}`, `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png?size=512`)
                                        .setDescription(`${member.username}#${member.discriminator} has been kicked.`)
                                        .addField('User infos', `ID: **${member.id}**${member.bot ? '\nIs a bot' : ''}`)
                                        .addField(rolesField.name, rolesField.value)
                                        .addField('Reason', log.reason ? log.reason : "None provided.")
                                        .setFooter(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${user.id}/${user.user.avatar}.png?size=512`)
                                        .setTimestamp();
                                        
                                        webhook.send(embed);
                                } else {
                                    let embed = new MessageEmbed()
                                        .setColor("RANDOM")
                                        .setAuthor(`${member.username}#${member.discriminator}`, `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png?size=512`)
                                        .setDescription(`${member.username}#${member.discriminator} has left the server.`)
                                        .addField('User infos', `ID: **${member.id}**${member.bot ? '\nIs a bot' : ''}`)
                                        .addField(rolesField.name, rolesField.value)
                                        .setFooter(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${user.id}/${user.user.avatar}.png?size=512`)
                                        .setTimestamp();
                                }
                            })
                        }
                    }
                }
            }
        }
    })
}