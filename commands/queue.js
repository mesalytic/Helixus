module.exports.run = async (bot, message, args, con) =>
{
    const queue = bot.queue;
	const serverQueue = queue.get(message.guild.id);
	if (!serverQueue) return message.channel.send(bot.lang.musique.queue.nomusic);
    
    const
	{
		oneLine,
		stripIndents
	} = require('common-tags');
	const currentSong = serverQueue.songs[0];
	const currentTime = serverQueue.connection.dispatcher ? serverQueue.connection.dispatcher.streamTime / 1000 : 0;
	const paginated = paginate(serverQueue.songs, args[0], 10);
	var totalTime = 0;
	for (let i = 0; i < serverQueue.songs.length; i++)
	{
		let q = serverQueue.songs[i];
		totalTime += q.duration_unformated;
	}
	let embedtitle = bot.lang.musique.queue.embedtitle.replace("${paginated.page}", paginated.page).replace("${paginated.maxPage}", paginated.maxPage);
	return message.channel.send(
	{
		embed:
		{
			color: 0xcd6e57,
			title: embedtitle,
			author:
			{
				name: message.author.tag,
				iconURL: message.author.displayAvatarURL
			},
			description: stripIndents `
            ${paginated.items.map(song => `**-** ${!isNaN(song.id) ? `${song.title} (${song.duration_length})` : `[${song.title}](${`https://www.youtube.com/watch?v=${song.id}`})`} (${song.duration_length})`).join('\n')}
            ${paginated.maxPage > 1 ? `\n${bot.lang.musique.queue.usage}` : ''}
            ${bot.lang.musique.queue.progress} ${!isNaN(currentSong.id) ? `${currentSong.title}` : `[${currentSong.title}](${`https://www.youtube.com/watch?v=${currentSong.id}`})`}
            ${oneLine`
				${bot.lang.musique.queue.progression}
                ${timeString(currentTime)} /
                ${currentSong.duration_length}
				(${timeLeft(currentTime)} ${bot.lang.musique.queue.left})
			`}
			${bot.lang.musique.queue.totaltime} ${timeString(totalTime - currentTime)}
        `
		}
	});
	
	function timeString(seconds, forceHours = false)
	{
		const hours = Math.floor(seconds / 3600),
			minutes = Math.floor(seconds % 3600 / 60);
		return `${forceHours || hours >= 1 ? `${hours}:` : ''}${hours >= 1 ? `0${minutes}`.slice(-2) : minutes}:${`0${Math.floor(seconds % 60)}`.slice(-2)}`;
	}

	function timeLeft(currentTime)
	{
		return timeString(serverQueue.songs[0].duration_unformated - currentTime);
	}
};

function paginate(items, page = 1, pageLength = 10)
{
	const maxPage = Math.ceil(items.length / pageLength);
	if (page < 1) page = 1;
	if (page > maxPage) page = maxPage;
	const startIndex = (page - 1) * pageLength;
	return {
		items: items.length > pageLength ? items.slice(startIndex, startIndex + pageLength) : items,
		page,
		maxPage,
		pageLength
	};
}
module.exports.help = {
	name: "queue",
	catégorie: "Musique",
	helpcaté: "musique"
};