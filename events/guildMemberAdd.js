const {
    WebhookClient,
    MessageEmbed
} = require("discord.js")

const moment = require('moment');
const message = require("./message");

module.exports = async (bot, member) => {
    bot.db.query(`SELECT * FROM JoinMessages WHERE guildID='${member.guild.id}'`, (err, rows) => {
        if (err) throw err;
        if (rows[0]) {
            let chan = member.guild.channels.cache.get(rows[0].channelID);
            chan.send(rows[0].joinmsg.replace(/{user}/g, member).replace(/{username}/g, member.user.username).replace(/{server}/g, member.guild.name));
        }
    })

    bot.db.query(`SELECT * FROM Autorole WHERE guildId=${member.guild.id}`, (err, rows) => {
        if (err) throw err;
        if (rows[0]) {
            const role = member.guild.roles.resolve(rows[0].roleID);

            member.roles.add(role).catch((err) => {
                throw new Error(err);
            });
        }
    });

    bot.db.query(`SELECT * FROM Logs WHERE guildID='${member.guild.id}'`, async (err, logsSettings) => {
        if (err) throw err;
        if (logsSettings[0]) {
            if (logsSettings[0].channelID) {
                if (logsSettings[0].activated = "true") {
                    if (logsSettings[0].guildmemberadd === "true") {
                        if (logsSettings[0].webhookID && logsSettings[0].webhookToken) {
                            const webhook = new WebhookClient(logsSettings[0].webhookID, logsSettings[0].webhookToken);

                            let embed = new MessageEmbed()
                                .setAuthor(`${member.user.username}#${member.user.discriminator}`, `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png?size=512`)
                                .setDescription(`${member} joined! We are now **${member.guild.memberCount}** members !`)
                                .addField("Joined at", moment(member.joinedAt).format("dddd Do MMMM Y H[:]mm[:]ss "), true)
                                .addField("Account age", `**${Math.floor((new Date() - member.user.createdAt) / 86400000)}** days`, true)
                                .addField("User ID", member.id)
                                .setColor("RANDOM")

                            webhook.send(embed);
                        }
                    }
                }
            }
        }
    })
}