const {
    WebhookClient,
    MessageEmbed
} = require("discord.js")

module.exports = async (bot, id, events) => {
    const wb = new WebhookClient(bot.config.webhook.status.id, bot.config.webhook.status.password)
    let e = new MessageEmbed()
        .setColor("#008080")
        .setTitle(`Shard ${bot.shard.ids[0] + 1}/${bot.shard.count}`)
        .setDescription(`Resumed (${events} resumed events)`)
        .setTimestamp();
    wb.send(e);
}