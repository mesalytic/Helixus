module.exports.run = async (bot, message, args, con) =>
{
	const axios = require("axios");
    const ms = require('ms');
    
	if (!message.channel.permissionsFor(message.author).has("MANAGE_CHANNELS"))
	{
		return message.channel.send(bot.lang.mods.slowmode.unotperm);
    }
    
    const msg = await message.channel.send(bot.lang.mods.slowmode.changing);
    
    function slowmode(s, m)
	{
		axios(
			{
				method: 'patch',
				url: `https://discordapp.com/api/v6/channels/${message.channel.id}`,
				headers:
				{
					'Authorization': `Bot ${bot.token}`
				},
				data:
				{
					rate_limit_per_user: s,
					reason: args.slice(1).join(' ')
				}
			}).then(msg.edit(m))
			.catch(() =>
			{
				msg.edit('permissions not required or invalid ID');
			});
	}
	if (args[0] === "off")
	{
		message.delete();
		slowmode(0, bot.lang.mods.slowmode.deactivate);
	}
	else if (!args[0] || parseInt(ms(args[0]) / 1000) > 21600 || parseInt(ms(args[0]) / 1000) < 1) return msg.edit(bot.lang.mods.slowmode.noargs);
	else
	{
		let str = bot.lang.mods.slowmode.change.replace("${args[0]}", args[0]);
		slowmode(ms(args[0]) / 1000, str);
	}
};
module.exports.help = {
	name: "slowmode",
	catégorie: "Modération",
	helpcaté: "mods"
};