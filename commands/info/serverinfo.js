const {
    MessageEmbed
} = require("discord.js");
const Command = require("../../structures/Command");
const moment = require('moment');


module.exports = class ServerInfoCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'serverinfo',
            aliases: ['si'],
            usage: 'serverinfo',
            description: "Displays informations about the server.",
            type: 'info',
        });
    }

    async run(message, args) {

        let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`📡 | ${message.guild.name}`)
            .setImage(message.guild.bannerURL({
                size: 2048,
                format: "png",
                dynamic: true
            }))
            .setThumbnail(message.guild.iconURL)
            .addField(message.guild.lang.COMMANDS.SERVERINFO.owner, `${message.guild.owner} \`${message.guild.owner.user.tag}\``, true)
            .addField(message.guild.lang.COMMANDS.SERVERINFO.members, message.guild.memberCount, true)
            .addField(message.guild.lang.COMMANDS.SERVERINFO.serverID, message.guild.id, true)
            .addField(message.guild.lang.COMMANDS.SERVERINFO.language, message.guild.preferredLocale, true)
            .addField(message.guild.lang.COMMANDS.SERVERINFO.region, message.guild.region, true)
            .addField(message.guild.lang.COMMANDS.SERVERINFO.channelCount, message.guild.lang.COMMANDS.SERVERINFO.channelCountValue(message.guild.channels.cache.size), true)
            .addField(message.guild.lang.COMMANDS.SERVERINFO.emojiCount, message.guild.lang.COMMANDS.SERVERINFO.emojiCountValue(message.guild.emojis.cache.size), true)
            .addField(message.guild.lang.COMMANDS.SERVERINFO.createdOn, moment(message.guild.createdAt).format("DD MMMM Y | HH:mm:ss"), true)
            .addField(message.guild.lang.COMMANDS.SERVERINFO.joinedOn, moment(message.guild.joinedAt).format("DD MMMM Y | HH:mm:ss"), true)
            .addField(message.guild.lang.COMMANDS.SERVERINFO.verificationLevel, message.guild.verificationLevel, true)
            .addField(message.guild.lang.COMMANDS.SERVERINFO.mfaLevel, message.guild.mfaLevel, true)
            .addField(message.guild.lang.COMMANDS.SERVERINFO.boostsCount, message.guild.premiumSubscriptionCount, true)
            .addField(message.guild.lang.COMMANDS.SERVERINFO.boostLevel, message.guild.premiumTier, true)
            .addField(message.guild.lang.COMMANDS.SERVERINFO.verifiedServer, message.guild.verified ?
                message.guild.lang.COMMANDS.SERVERINFO.verified :
                message.guild.lang.COMMANDS.SERVERINFO.notVerified, true)
            .addField(message.guild.lang.COMMANDS.SERVERINFO.partner, message.guild.partnered ?
                message.guild.lang.COMMANDS.SERVERINFO.partnered :
                message.guild.lang.COMMANDS.SERVERINFO.notPartnered, true)
            .setTimestamp();

        let guildRoles = [];
        let rolesLeft = 0;
        let amountOfRoles = 0;

        message.guild.roles.cache.forEach((role) => {
            amountOfRoles++;
            if (guildRoles.join(" ").length <= 400) guildRoles.push(role);
            else rolesLeft++;
        });
        embed.addField(`Roles (${amountOfRoles})`, `${guildRoles.join(" ")} ${rolesLeft !== 0 ? message.guild.lang.COMMANDS.SERVERINFO.moreRole(rolesLeft) : ""}`);

        let guildEmotes = [];
        let emotesLeft = 0;
        let amountOfEmotes = 0;

        message.guild.emojis.cache.forEach((emote) => {
            amountOfEmotes++;
            if (guildEmotes.join(" ").length <= 800) guildEmotes.push(emote);
            else emotesLeft++;
        });
        amountOfEmotes !== 0 ? embed.addField(`Emotes (${amountOfEmotes})`, `${guildEmotes.join(" ")} ${emotesLeft !== 0 ? message.guild.lang.COMMANDS.SERVERINFO.moreEmotes(emotesLeft) : ""}`) : "";

        message.channel.send(embed);
    }
}