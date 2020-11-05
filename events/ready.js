const {
    WebhookClient,
    MessageEmbed
} = require("discord.js");

module.exports = async (bot) => {
    bot.user.setPresence({
        status: 'online',
        activity: {
            name: "am!help",
            type: "LISTENING"
        }
    });

    bot.logger.info(`Helixus is now running [Shard ${bot.shard.ids[0] + 1}]`)

    const wb = new WebhookClient(bot.config.webhook.status.id, bot.config.webhook.status.password)

    const embed = new MessageEmbed()
        .setColor("#008000")
        .setTitle(`Shard ${bot.shard.ids[0] + 1}/${bot.shard.count}`)
        .setDescription(`Connected`)
        .setTimestamp();

    wb.send(embed);
}