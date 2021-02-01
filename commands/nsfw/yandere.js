const Command = require("../../structures/Command");

const request = require('node-superfetch');
const moment = require('moment');
const { MessageEmbed } = require("discord.js");

module.exports = class YandereCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'yandere',
            description: 'Displays a (potential) NSFW image from Yande.re with your specified tags.',
            type: 'nsfw'
        });
    }

    async run(message, args) {
        const random = str => Math.floor(Math.random() * str.length);

        let m = await message.channel.send(message.guild.lang.COMMANDS.YANDERE.pleaseWait);

        const bannedTags = ["child", "childs", "childporn", "children", "youngs", "young", "loli", "shota", "cub"];
  
        let url = "https://yande.re/post.json?limit=100&tags=";

        if (!args[0]) url = "https://yande.re/post.json?limit=100";
        else {
            for (let i = 0; i < args.length; i++) {
                if (bannedTags.indexOf(args[i].toLowerCase()) > -1) {
                    return message.reply(message.guild.lang.COMMANDS.YANDERE.banned(args[i].toLowerCase()))
                }
            }
            url += args.join('+');
        }

        let { body } = await request.get(url)

        console.log(body[0]);

        if (!body) return message.reply(message.guild.lang.COMMANDS.YANDERE.notFound);
    let data = body[random(body)];
    
    let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(message.guild.lang.COMMANDS.YANDERE.requestedBy(message.author.tag), message.author.displayAvatarURL())
            .setDescription(message.guild.lang.COMMANDS.YANDERE.embedDescription(data, message.guild.lang.COMMANDS.YANDERE.notDisplaying))
            .setImage(data.file_url)
            .setFooter(message.guild.lang.COMMANDS.YANDERE.providedBy)
        
        m.edit(null, {embed:embed});
    }
}