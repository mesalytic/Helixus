const { MessageEmbed } = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class AvatarCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'avatar',
            type: 'general',
            description: 'Displays your avatar or the avatar of the mentionned user.',
            usage: 'avatar [@mention]',
            examples: ["avatar @Helixus", "avatar"],
            aliases: ["pp"]
        });
    }

    async run(message, args) {
        let mentionned = message.mentions.users.first();
        let embed = new MessageEmbed()
            .setTitle(message.guild.lang.COMMANDS.AVATAR.avatar(mentionned ? mentionned.tag : message.author.tag))
            .setDescription(`[${message.guild.lang.COMMANDS.AVATAR.notShowing}](${mentionned ? mentionned.displayAvatarURL({ dynamic: true, size: 2048 }) : message.author.displayAvatarURL({ dynamic: true, size: 2048 })})`)
            .setImage(mentionned ? mentionned.displayAvatarURL({ dynamic: true, size: 2048 }) : message.author.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setColor("RANDOM")
            .setTimestamp();

        message.channel.send(embed);
    }
}