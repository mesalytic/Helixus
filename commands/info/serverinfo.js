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
            .addField("👑 | Owner", `${message.guild.owner} \`${message.guild.owner.user.tag}\``, true)
            .addField("👥 | Members", message.guild.memberCount, true)
            .addField("🔑 | Server ID", message.guild.id, true)
            .addField("📙 | Language", message.guild.preferredLocale, true)
            .addField("🚩 | Region", message.guild.region, true)
            .addField("🗨️ | Channel Count", `**${message.guild.channels.cache.size}** channels`, true)
            .addField(`👀 | Emoji Count`, `**${message.guild.emojis.cache.size}** emojis`, true)
            .addField("⏱️ | Created On", moment(message.guild.createdAt).format("DD MMMM Y | HH:mm:ss"), true)
            .addField("🔗 | Joined On", moment(message.guild.joinedAt).format("DD MMMM Y | HH:mm:ss"), true)
            .addField("🚥 | Verification Level", message.guild.verificationLevel, true)
            .addField("🔒 | MFA Level", message.guild.mfaLevel, true)
            .addField(`🚀 | Boosts Count`, message.guild.premiumSubscriptionCount, true)
            .addField("🚀 | Boost Level", message.guild.premiumTier, true)
            .addField(`<:verified:786313097857335376> | Verified`, message.guild.verified ?
                "Verified" :
                "Not Verified", true)
            .addField("<:partnerowner:776628269356417036> | Partner", message.guild.partnered ?
                "Partnered" :
                "Not Partnered", true)
            .setTimestamp();

        let guildRoles = [];
        let rolesLeft = 0;
        let amountOfRoles = 0;

        message.guild.roles.cache.forEach((role) => {
            amountOfRoles++;
            if (guildRoles.join(" ").length <= 400) guildRoles.push(role);
            else rolesLeft++;
        });
        embed.addField(`Roles (${amountOfRoles})`, `${guildRoles.join(" ")} ${rolesLeft !== 0 ? `and ${rolesLeft} more` : ""}`);

        let guildEmotes = [];
        let emotesLeft = 0;
        let amountOfEmotes = 0;

        message.guild.emojis.cache.forEach((emote) => {
            amountOfEmotes++;
            if (guildEmotes.join(" ").length <= 800) guildEmotes.push(emote);
            else emotesLeft++;
        });
        amountOfEmotes !== 0 ? embed.addField(`Emotes (${amountOfEmotes})`, `${guildEmotes.join(" ")} ${emotesLeft !== 0 ? `and ${emotesLeft} more` : ""}`) : "";

        message.channel.send(embed);
    }
}