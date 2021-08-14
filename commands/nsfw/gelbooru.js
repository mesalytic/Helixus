const Command = require("../../structures/Command");

const request = require('node-superfetch');
const moment = require('moment');
const { MessageEmbed } = require("discord.js");

module.exports = class GelbooruCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'gelbooru',
            description: 'Displays a (potential) NSFW image from Gelbooru with your specified tags.',
            type: 'nsfw',
            cooldown: 10
        });
    }

    async run(message, args) {
        let m = await message.channel.send(message.guild.lang.COMMANDS.GELBOORU.pleaseWait);

        const query = args.join(" ");
        const random = str => Math.floor(Math.random() * str.length);

        const { body } = await request.get("https://gelbooru.com/index.php").query({
            page: 'dapi',
            s: "post",
            q: "index",
            json: 1,
            tags: query,
            limit: 200
        })

        if (!body) return message.reply(message.guild.lang.COMMANDS.GELBOORU.notFound);
    let data = body[random(body)];

    let rank = data.rating;

    const duration = moment(new Date(data.created_at).getTime()).format("D/MM/YYYY[,] HH:mm:ss");
    

        let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(message.guild.lang.COMMANDS.GELBOORU.requestedBy(message.author.tag), message.author.displayAvatarURL())
            .setDescription(message.guild.lang.COMMANDS.GELBOORU.embedDescription(data, duration, message.guild.lang.COMMANDS.GELBOORU[data.rating], message.guild.lang.COMMANDS.GELBOORU.notDisplaying))
            .setImage(data.file_url)
            .setFooter(message.guild.lang.COMMANDS.GELBOORU.providedBy)
        
        m.edit(null, {embed:embed});
    }
}