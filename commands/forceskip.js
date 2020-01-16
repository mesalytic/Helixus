module.exports.run = async (bot, message, args, con) =>
{
	const queue = bot.queue;
    const serverQueue = queue.get(message.guild.id);
	
    if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.reply(bot.lang.musique.forceskip.noperms);
	if (!message.member.voice.channel) return message.channel.send(bot.lang.musique.forceskip.nochannel);
	if (!serverQueue) return message.channel.send(bot.lang.musique.forceskip.noskip);
    
    message.channel.send(bot.lang.musique.forceskip.skipped);
    
    await serverQueue.connection.dispatcher.end();
};
module.exports.help = {
	name: "forceskip",
	catégorie: "Musique",
	helpcaté: "musique"
};