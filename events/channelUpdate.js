const {
    WebhookClient,
    MessageEmbed
} = require("discord.js");
const CHANNEL_TYPES = {
    'text': 'Text Channel',
    'voice': 'Voice Channel',
    'category': 'Category'
}

module.exports = async (bot, oldChannel, newChannel) => {
    if (newChannel.type === "dm") return;

    bot.db.query(`SELECT * FROM Logs WHERE guildID='${newChannel.guild.id}'`, async (err, logsSettings) => {
        if (logsSettings[0]) {
            if (logsSettings[0].channelID) {
                if (logsSettings[0].activated === "true") {
                    if (logsSettings[0].channelupdate === "true") {
                        if (logsSettings[0].webhookID && logsSettings[0].webhookToken) {
                            const webhook = new WebhookClient(logsSettings[0].webhookID, logsSettings[0].webhookToken);


                            if (oldChannel.name != newChannel.name) {
                                let embed = new MessageEmbed()
                                    .setDescription(`**${CHANNEL_TYPES[newChannel.type]} name changed ${newChannel.toString()}**`)
                                    .setColor("RANDOM")
                                    .setFooter(`ID: ${newChannel.id}`)
                                    .setAuthor(newChannel.guild.name, newChannel.guild.iconURL())
                                    .addFields({
                                        name: 'Old:',
                                        value: `${oldChannel.name}`,
                                        inline: true
                                    }, {
                                        name: 'New:',
                                        value: `${newChannel.name}`,
                                        inline: true
                                    })
                                    .setTimestamp();
                                webhook.send(embed);
                            }
                            if (oldChannel.topic != newChannel.topic) {
                                let embed = new MessageEmbed()
                                    .setDescription(`**${CHANNEL_TYPES[newChannel.type]} topic changed to ${newChannel.toString()}**`)
                                    .setColor("RANDOM")
                                    .setFooter(`ID: ${newChannel.id}`)
                                    .setAuthor(newChannel.guild.name, newChannel.guild.iconURL())
                                    .addFields({
                                        name: 'Old:',
                                        value: `${oldChannel.topic ? oldChannel.topic : "No topic"}`,
                                        inline: true
                                    }, {
                                        name: 'New:',
                                        value: `${newChannel.topic ? newChannel.topic : "No topic"}`,
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
                                    .setDescription(`**${CHANNEL_TYPES[newChannel.type]} permissions changed of ${newChannel.toString()}**\n*note:* check [docs](https://discordapp.com/developers/docs/topics/permissions) to see what the numbers mean`)
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
                                        value += `Allowed Perms: \`${oldBitfields.allowed}\` to \`${newBitfields.allowed}\`\n`;
                                    }
                                    if (oldBitfields.denied !== newBitfields.denied) {
                                        value += `Denied Perms: \`${oldBitfields.denied}\` to \`${newBitfields.denied}\``;
                                    }
                                    if (!value.length) value = 'Overwrite got deleted';
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
}