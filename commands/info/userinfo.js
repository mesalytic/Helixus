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
                .addField(message.guild.lang.COMMANDS.USERINFO.username, user.tag, true)
                .addField("Type", user.bot ? message.guild.lang.COMMANDS.USERINFO.bot : message.guild.lang.COMMANDS.USERINFO.user, true)
                .addField("Badges", user.flags ? user.flags.toArray().filter(b => b !== "VERIFIED_DEVELOPER").map(badge => `${badgesEmotes[badge]}`).join(" ") : message.guild.lang.COMMANDS.USERINFO.none)
                .addField(message.guild.lang.COMMANDS.USERINFO.currentStatus, user.presence.status.charAt(0).toUpperCase() + user.presence.status.slice(1), true)
                .addField(message.guild.lang.COMMANDS.USERINFO.accountCreated, `${timeZoneConvert(user.createdAt).split(/ +/).splice(0, 3).join(' ')} | ${message.guild.lang.COMMANDS.USERINFO.accountCreatedAgo(ms(new Date().getTime() - user.createdTimestamp, { long: true }))}`)
                .addField(message.guild.lang.COMMANDS.USERINFO.joined, `${timeZoneConvert(member.joinedAt).split(/ +/).splice(0,3).join(' ')}, ${message.guild.lang.COMMANDS.USERINFO.joinedAgo(ms(new Date() - member.joinedTimestamp, { long: true }))}`)
                .addField(message.guild.lang.COMMANDS.USERINFO.currentlyActiveOn, Object.keys(user.presence.clientStatus || {}).map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(', ') || message.guild.lang.COMMANDS.USERINFO.offline)
                .addField(message.guild.lang.COMMANDS.USERINFO.nitroBoostStatus, `${member && member.premiumSince ? `${timeZoneConvert(member.premiumSince).split(/ +/).splice(0,3).join(' ')}, ${message.guild.lang.COMMANDS.USERINFO.nitroBoostStatusAgo(ms(new Date() - member.premiumSinceTimestamp, { long: true }))}` : message.guild.lang.COMMANDS.USERINFO.noNitroBoostStatus}`)
                .addField("Roles", `${member.roles.cache.filter(role => role.id !== message.guild.id).map(role => `${role}\u2000`).splice(0, 25).join('•\u2000')} ${member.roles.cache.size > 26 ? message.guild.lang.COMMANDS.USERINFO.moreRoles(member.roles.cache.size - 26) : "\u200b"}`)

            message.channel.send(embed);
        })
    }
}