const {
    WebhookClient,
    MessageEmbed
} = require("discord.js");

module.exports = async (bot, oldChannel, newChannel) => {
    if (newChannel.type === "dm") return;

    bot.db.query(`SELECT * FROM Logs WHERE guildID='${newChannel.guild.id}'`, async (err, logsSettings) => {
        bot.db.query(`SELECT * FROM Langs WHERE guildID='${newChannel.guild.id}'`, async (err, rows) => {
            let {
                CHANNELUPDATE: lang
            } = require(`../structures/Languages/${rows[0] ? rows[0].lang : "en"}.js`).EVENTS;
            if (logsSettings[0]) {
                if (logsSettings[0].channelID) {
                    if (logsSettings[0].activated === "true") {
                        if (logsSettings[0].channelupdate === "true") {
                            if (logsSettings[0].webhookID && logsSettings[0].webhookToken) {
                                const webhook = new WebhookClient(logsSettings[0].webhookID, logsSettings[0].webhookToken);


                                if (oldChannel.name != newChannel.name) {
                                    let embed = new MessageEmbed()
                                        .setDescription(lang.changedName(newChannel))
                                        .setColor("RANDOM")
                                        .setFooter(`ID: ${newChannel.id}`)
                                        .setAuthor(newChannel.guild.name, newChannel.guild.iconURL())
                                        .addFields({
                                            name: lang.old,
                                            value: `${oldChannel.name}`,
                                            inline: true
                                        }, {
                                            name: lang.new,
                                            value: `${newChannel.name}`,
                                            inline: true
                                        })
                                        .setTimestamp();
                                    webhook.send(embed);
                                }
                                if (oldChannel.topic != newChannel.topic) {
                                    let embed = new MessageEmbed()
                                        .setDescription(lang.changedTopic(newChannel))
                                        .setColor("RANDOM")
                                        .setFooter(`ID: ${newChannel.id}`)
                                        .setAuthor(newChannel.guild.name, newChannel.guild.iconURL())
                                        .addFields({
                                            name: lang.old,
                                            value: `${oldChannel.topic ? oldChannel.topic : lang.none}`,
                                            inline: true
                                        }, {
                                            name: lang.new,
                                            value: `${newChannel.topic ? newChannel.topic : lang.none}`,
                                            inline: true
                                        })
                                        .setTimestamp();
                                    webhook.send(embed);
                                }

                                const permDiff = oldChannel.permissionOverwrites.filter(x => {
                                    if (newChannel.permissionOverwrites.find(y => y.allow.bitfield == x.allow.bitfield) && newChannel.permissionOverwrites.find(y => y.deny.bitfield == x.deny.bitfield)) {
                                        return false;
                                    }
                                }).concat(newChannel.permissionOverwrites.filter(x => {
                                    if (oldChannel.permissionOverwrites.find(y => y.allow.bitfield == x.allow.bitfield) && oldChannel.permissionOverwrites.find(y => y.deny.bitfield == x.deny.bitfield)) {
                                        return false;
                                    }
                                    return true;
                                }));
                                if (permDiff.size) {
                                    let embed = new MessageEmbed()
                                        .setDescription(lang.changedPermissions(newChannel))
                                        .setColor(15105570)
                                        .setFooter(`ID: ${newChannel.id}`)
                                        .setAuthor(newChannel.guild.name, newChannel.guild.iconURL())
                                        .setTimestamp();
                                    for (const permID of permDiff.keys()) {
                                        const oldPerm = oldChannel.permissionOverwrites.get(permID) || {};
                                        const newPerm = newChannel.permissionOverwrites.get(permID) || {};
                                        const oldBitfields = {
                                            allowed: oldPerm.allow ? oldPerm.allow.bitfield : 0,
                                            denied: oldPerm.deny ? oldPerm.deny.bitfield : 0
                                        };
                                        const newBitfields = {
                                            allowed: newPerm.allow ? newPerm.allow.bitfield : 0,
                                            denied: newPerm.deny ? newPerm.deny.bitfield : 0,
                                        };
                                        let role;
                                        let member;
                                        if (oldPerm.type == 'role' || newPerm.type == 'role') {
                                            role = newChannel.guild.roles.cache.get(newPerm.id || oldPerm.id);
                                        }
                                        if (oldPerm.type == 'member' || newPerm.type == 'member') {
                                            member = await newChannel.guild.fetchMember(newPerm.id || oldPerm.id);
                                        }
                                        let value = '';
                                        if (oldBitfields.allowed !== newBitfields.allowed) {
                                            value += lang.allowed(oldBitfields.allowed, newBitfields.allowed);
                                        }
                                        if (oldBitfields.denied !== newBitfields.denied) {
                                            value += lang.denied(oldBitfields.denied, newBitfields.denied);
                                        }
                                        if (!value.length) value = lang.deleted;
                                        embed.fields.push({
                                            'name': role ? role.name + ` (ID: ${role.id}):` : member.user.username + ` (ID: ${member.id}):`,
                                            'value': value,
                                        })
                                    }
                                    webhook.send(embed);
                                }
                            }
                        }
                    }
                }
            }
        })
    })
}