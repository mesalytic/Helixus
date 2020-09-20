module.exports = async (bot) => {
    bot.user.setPresence({ status: 'online', activity: { name: "am!help", type: "LISTENING" } });

    bot.logger.info(`Helixus is now running [Shard ${bot.shard.ids[0]}]`)
}