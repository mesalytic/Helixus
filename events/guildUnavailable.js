module.exports = (bot, guild) => {
    bot.logger.log(`[Unavailable Guild] ${guild.name} (${guild.id})`);
}