const {
    MessageEmbed
} = require("discord.js");
const ms = require("ms");
const Command = require("../../structures/Command");
const {
    badgesEmotes
} = require("../../structures/Constants");
const {
    timeZoneConvert
} = require("../../structures/Utils");

module.exports = class UserInfoCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'userinfo',
            aliases: ['ui'],
            usage: 'userinfo [user]',
            description: "Displays informations about a specific user __**in the server**__.",
            type: 'info',
            examples: ['userinfo', 'userinfo @user', 'userinfo 437190817195753472']
        });
    }

    async run(message, args) {
        const guildUsers = message.guild.users;
        let user;

        if (!args[0] || !message.content.match(/\d{17,19}/)) user = message.member.user;
        else user = await guildUsers.fetch(message.content.match(/\d{17,19}/)[0]);
        if (!user) return this.bot.commands.get("help").run(message, ["userinfo"])

        message.guild.members.fetch(user.id).then(member => {
            if (!member) return this.bot.commands.get("help").run(message, ["userinfo"])

            let embed = new MessageEmbed()
                .setColor(member && member.displayColor ? member.displayColor : "RANDOM")
                .setAuthor(user.tag, user.displayAvatarURL({
                    format: 'png',
                    size: 512
                }))
                .setThumbnail(user.displayAvatarURL({
                    format: 'png',
                    dynamic: true,
                    size: 1024
                }))
                .addField("Username", user.tag, true)
                .addField("Type", user.bot ? "Bot" : "User", true)
                .addField("Badges", user.flags ? user.flags.toArray().filter(b => b !== "VERIFIED_DEVELOPER").map(badge => `${badgesEmotes[badge]}`).join(" ") : "None")
                .addField("Current Status", user.presence.status.charAt(0).toUpperCase() + user.presence.status.slice(1), true)
                .addField("Account created", `${timeZoneConvert(user.createdAt).split(/ +/).splice(0, 3).join(' ')} | ${ms(new Date().getTime() - user.createdTimestamp, { long: true })} ago`)
                .addField("Joined", `${timeZoneConvert(member.joinedAt).split(/ +/).splice(0,3).join(' ')}, ${ms(new Date() - member.joinedTimestamp, { long: true })} ago`)
                .addField("Currently active on", Object.keys(user.presence.clientStatus || {}).map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(', ') || "Offline")
                .addField("Nitro Boost Status", `${member && member.premiumSince ? `${timeZoneConvert(member.premiumSince).split(/ +/).splice(0,3).join(' ')}, ${ms(new Date() - member.premiumSinceTimestamp, { long: true })} ago` : "No active Server Boost."}`)
                .addField("Roles", `${member.roles.cache.filter(role => role.id !== message.guild.id).map(role => `${role}\u2000`).splice(0, 25).join('•\u2000')} ${member.roles.cache.size > 26 ? `and ${member.roles.cache.size - 26} more.` : "\u200b"}`)

            message.channel.send(embed);
        })
    }
}