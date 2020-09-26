const { WebhookClient, MessageEmbed } = require("discord.js")

module.exports = async (bot, id) => {
    const wb = new WebhookClient(bot.config.webhook.joinleaves.id, bot.config.webhook.joinleaves.password)
    let e = new MessageEmbed()
    .setColor("#FF0000")
        .setTitle(`:warning: Shard ${bot.shard.ids[0] + 1} is disconnected !`);
    wb.send(e);
}