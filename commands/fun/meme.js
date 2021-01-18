const Command = require("../../structures/Command");

const fetch = require('node-fetch');
const { MessageEmbed } = require("discord.js");

let subreddits = ["dankmemes", "memes", "programmerhumor", "crappyoffbrands", "MemeEconomy", "me_irl"]
module.exports = class MemeCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'meme',
            usage: 'meme',
            description: 'Displays a random meme from the r/dankmemes subreddit.',
            type: 'fun',
        });
    }

    async run(message, args) {
        const m = await message.channel.send(message.guild.lang.COMMANDS.MEME.loading);

        let subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
        const { data: { children }} = await fetch(`https://www.reddit.com/r/${subreddit}/top.json?sort=top&t=day&limit=500`)
        .then((res) => res.json());
        const meme = children[Math.floor(Math.random() * children.length)];

        const embed = new MessageEmbed()
        .setTitle(meme.data.title)
        .setImage(meme.data.url)
        .setColor(0x9590EE)
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 64 }))
        .setFooter(`👍 ${meme.data.ups} | 👎 ${meme.data.downs} | r/${meme.data.subreddit}`)
        .setURL(`https://reddit.com${meme.data.permalink}`)
        m.edit(null, { embed: embed })
    }
}