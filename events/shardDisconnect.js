const {
    WebhookClient,
    MessageEmbed
} = require("discord.js")

module.exports = async (bot, id) => {
    const wb = new WebhookClient(bot.config.webhook.status.id, bot.config.webhook.status.password)
    let e = new MessageEmbed()
        .setTitle(`Shard ${bot.shard.ids[0] + 1}/${bot.shard.count}`)
        .setColor("#FF0000")
        .setDescription(`Disconnected.`)
        .setTimestamp();
    wb.send(e);
}