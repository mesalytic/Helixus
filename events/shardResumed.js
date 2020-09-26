const { WebhookClient, MessageEmbed } = require("discord.js")

module.exports = async (bot, id, events) => {
    const wb = new WebhookClient(bot.config.webhook.joinleaves.id, bot.config.webhook.joinleaves.password)
    let e = new MessageEmbed()
    .setColor("#008080")
        .setTitle(`:warning: Shard ${bot.shard.ids[0] + 1} has resumed with ${events} resumed events!`);
    wb.send(e);
}