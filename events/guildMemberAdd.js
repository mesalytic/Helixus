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

        let roles = [];

        for (let i = 0; i < rows.length; i++) {
            const role = member.guild.roles.resolve(rows[i].roleID);

            roles.push(role);
        }

        member.roles.add(roles).catch((err) => {
            throw new Error(err);
        })
    });

    bot.db.query(`SELECT * FROM Logs WHERE guildID='${member.guild.id}'`, async (err, logsSettings) => {
        if (err) throw err;
        bot.db.query(`SELECT * FROM Langs WHERE guildID='${member.guild.id}'`, async (err, rows) => {
            let {
                GUILDMEMBERADD: lang
            } = require(`../structures/Languages/${rows[0] ? rows[0].lang : "en"}.js`).EVENTS;
            if (logsSettings[0]) {
                if (logsSettings[0].channelID) {
                    if (logsSettings[0].activated = "true") {
                        if (logsSettings[0].guildmemberadd === "true") {
                            if (logsSettings[0].webhookID && logsSettings[0].webhookToken) {
                                const webhook = new WebhookClient(logsSettings[0].webhookID, logsSettings[0].webhookToken);

                                let embed = new MessageEmbed()
                                    .setAuthor(`${member.user.username}#${member.user.discriminator}`, `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png?size=512`)
                                    .setDescription(lang.joined(member, member.guild.memberCount))
                                    .addField(lang.joinedAt, moment(member.joinedAt).format("dddd Do MMMM Y H[:]mm[:]ss "), true)
                                    .addField(lang.accountAge, lang.days(Math.floor((new Date() - member.user.createdAt) / 86400000)), true)
                                    .addField(lang.userID, member.id)
                                    .setColor("RANDOM")

                                webhook.send(embed);
                            }
                        }
                    }
                }
            }
        })
    })
}