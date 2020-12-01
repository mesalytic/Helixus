const {
    WebhookClient,
    MessageEmbed
} = require("discord.js")

const hastebin = require("hastebin-gen");

module.exports = async (bot, oldMessage, newMessage) => {
    bot.db.query(`SELECT * FROM Logs WHERE guildID='${newMessage.guild.id}'`, async (err, logsSettings) => {
        if (err) throw err;
        if (logsSettings[0]) {
            if (logsSettings[0].channelID) {
                if (logsSettings[0].activated = "true") {
                    if (logsSettings[0].messageupdate === "true") {
                        bot.db.query(`SELECT * FROM LogsIgnore WHERE guildID='${newMessage.guild.id}' AND channelID='${newMessage.channel.id}'`, async (err, ignore) => {
                            if (!ignore[0] || ignore[0].ignored === "false") {
                                if (logsSettings[0].webhookID && logsSettings[0].webhookToken) {
                                    const webhook = new WebhookClient(logsSettings[0].webhookID, logsSettings[0].webhookToken);
                                    if (oldMessage.content !== newMessage.content && oldMessage.content.length !== 0) {
                                        let embed = new MessageEmbed()
                                        .setAuthor(newMessage.author.tag, newMessage.author.avatarURL())
                                        .setDescription(`A message from ${newMessage.author} (${newMessage.author.tag}) has been updated.`)
                                        .addField("Old message", oldMessage.content.length > 1000 ? await hastebin(oldMessage.content) : oldMessage.content)
                                        .addField("New message", newMessage.content.length > 1000 ? await hastebin(newMessage.content) : newMessage.content)
                                        .setColor("RANDOM")
                                        .setTimestamp();

                                        webhook.send(embed);
                                    }
                                }
                            }
                        })
                    }
                }
            }
        }
    })
}