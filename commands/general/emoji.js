const Command = require("../../structures/Command");
const moment = require('moment');
const {
    unicodeRegex
} = require("../../structures/Constants");
const {
    parseEmoji
} = require("../../structures/Utils");
const {
    MessageEmbed
} = require("discord.js");

module.exports = class EmojiCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'emoji',
            type: 'general',
            description: 'Displays informations about specified emote.\nModerators can use this command to add, rename and remove emojis from the server.',
            usage: 'emoji <name/emote/id>\nam!emoji add <name> <emote/attached image or gif>\nam!emoji rename <name/emote/id> <new name>\nam!emoji remove <name/emoji/id>',
        });
    }

    async run(message, args) {
        moment.locale(message.guild.lang.code);

        let momentDur;
        switch(message.guild.lang.code) {
            case 'en': momentDur = "MMMM Do YYYY [at] h:mm:ss A"; break;
            case 'fr': momentDur = "DD MMMM YYYY [a] HH:mm:ss"; break;
        }

        if (!args[0]) return this.bot.commands.get("help").run(message, ["emoji"]);

        if (args[0] === "add") {
            if (!message.channel.permissionsFor(message.author).has("MANAGE_EMOJIS")) return message.reply(message.guild.lang.COMMANDS.EMOJI.noPermission);
            if (!args[1]) return message.reply(message.guild.lang.COMMANDS.EMOJI.ADD.noArgs)

            if (message.attachments.first()) {
                if (message.attachments.first() && args[2]) return message.reply(message.guild.lang.COMMANDS.EMOJI.ADD.tooMuch);

                let emote = await message.guild.emojis.create(message.attachments.first().url, args[1]);
                message.channel.send(message.guild.lang.COMMANDS.EMOJI.ADD.created(emote));
            } else {
                if (message.attachments.first() && args[2]) return message.reply(message.guild.lang.COMMANDS.EMOJI.ADD.tooMuch);
                if (unicodeRegex.test(args[2]) === true) return message.reply(message.guild.lang.COMMANDS.EMOJI.ADD.unicode);

                if (message.guild.emojis.resolve(parseEmoji(args[2]).id)) return message.reply(message.guild.lang.COMMANDS.EMOJI.ADD.alreadyInServer)

                let emote = await message.guild.emojis.create(`https://cdn.discordapp.com/emojis/${parseEmoji(args[2]).id}${parseEmoji(args[2]).animated ? ".gif" : ".png"}`, args[1]);
                message.channel.send(message.guild.lang.COMMANDS.EMOJI.ADD.created(emote));
            }
        } else if (args[0] === "remove") {
            if (!message.channel.permissionsFor(message.author).has("MANAGE_EMOJIS")) return message.reply(message.guild.lang.COMMANDS.EMOJI.noPermission);
            if (!args[1]) return message.reply(message.guild.lang.COMMANDS.EMOJI.REMOVE.noArgs);

            if (args[1].match("<")) {
                let emote = message.guild.emojis.cache.find(u => u.name === parseEmoji(args[1]).name);
                if (!emote) return message.reply(message.guild.lang.COMMANDS.EMOJI.REMOVE.notInServer)

                await message.guild.emojis.resolve(emote).delete()
                message.channel.send(message.guild.lang.COMMANDS.EMOJI.REMOVE.removed(emote))
            } else if (message.guild.emojis.cache.get(args[1])) {
                let emote = message.guild.emojis.cache.get(args[1]);
                if (!emote) return message.reply(message.guild.lang.COMMANDS.EMOJI.REMOVE.notInServer)

                await message.guild.emojis.resolve(emote).delete()
                message.channel.send(message.guild.lang.COMMANDS.EMOJI.REMOVE.removed(emote))
            } else if (message.guild.emojis.cache.find(u => u.name === args[1])) {
                let emote = message.guild.emojis.cache.find(u => u.name === args[1]);
                if (!emote) return message.reply(message.guild.lang.COMMANDS.EMOJI.REMOVE.notInServer)

                await message.guild.emojis.resolve(emote).delete()
                message.channel.send(message.guild.lang.COMMANDS.EMOJI.REMOVE.removed(emote))
            }
        } else if (args[0] === "rename") {
            if (!message.channel.permissionsFor(message.author).has("MANAGE_EMOJIS")) return message.reply(message.guild.lang.COMMANDS.EMOJI.noPermission);
            if (!args[1]) return message.reply(message.guild.lang.COMMANDS.EMOJI.RENAME.noArgs);
            if (!args[2]) return message.reply(message.guild.lang.COMMANDS.EMOJI.RENAME.noNewName)

            if (args[1].match("<")) {
                let emote = message.guild.emojis.cache.find(u => u.name === parseEmoji(args[1]).name);
                if (!emote) return message.reply(message.guild.lang.COMMANDS.EMOJI.RENAME.notInServer);

                await emote.edit({
                    name: args[2]
                });
                return message.channel.send(message.guild.lang.COMMANDS.EMOJI.RENAME.renamed(emote, args[2]))
            } else if (message.guild.emojis.cache.find(u => u.name === args[1])) {
                let emote = message.guild.emojis.cache.find(u => u.name === args[1]);
                if (!emote) return message.reply(message.guild.lang.COMMANDS.EMOJI.RENAME.notInServer);

                await emote.edit({
                    name: args[2]
                });
                return message.channel.send(message.guild.lang.COMMANDS.EMOJI.RENAME.renamed(emote, args[2]))
            } else if (message.guild.emojis.cache.get(args[1])) {
                let emote = message.guild.emojis.cache.get(args[1]);
                if (!emote) return message.reply(message.guild.lang.COMMANDS.EMOJI.RENAME.notInServer);

                await emote.edit({
                    name: args[2]
                });
                return message.channel.send(message.guild.lang.COMMANDS.EMOJI.RENAME.renamed(emote, args[2]))
            }
        } else {
            if (args[0].match("<")) {
                let emote = message.guild.emojis.cache.find(u => u.name === parseEmoji(args[0]).name);
                if (emote) {
                    let preview;
                    let extension;

                    if (emote.animated === true) {
                        preview = `<a:${emote.name}:${emote.id}>`;
                        extension = `.gif`;
                    } else {
                        preview = `<:${emote.name}:${emote.id}>`;
                        extension = `.png`;
                    }

                    let embed = new MessageEmbed()
                        .setColor("RANDOM")
                        .setDescription(message.guild.lang.COMMANDS.EMOJI.informations(parseEmoji(args[0]).name, preview, emote.id, moment(emote.createdAt.getTime()).format(momentDur)))
                        .setImage(`https://cdn.discordapp.com/emojis/${emote.id}${extension}`)
                        .setTimestamp();
                    message.channel.send(embed);
                } else {
                    let extension;

                    if (parseEmoji(args[0]).animated === true) extension = `.gif`;
                    else extension = `.png`;

                    message.channel.send({
                        files: [{
                            attachment: `https://cdn.discordapp.com/emojis/${parseEmoji(args[0]).id}${extension}`,
                            name: `${parseEmoji(args[0]).id}-${parseEmoji(args[0]).name}${extension}`
                        }]
                    })
                }
            } else if (message.guild.emojis.cache.find(u => u.name === args[0])) {
                let emote = message.guild.emojis.cache.find(u => u.name === args[0]);
                
                    let preview;
                    let extension;

                    if (emote.animated === true) {
                        preview = `<a:${emote.name}:${emote.id}>`;
                        extension = `.gif`;
                    } else {
                        preview = `<:${emote.name}:${emote.id}>`;
                        extension = `.png`;
                    }

                    let embed = new MessageEmbed()
                        .setColor("RANDOM")
                        .setDescription(message.guild.lang.COMMANDS.EMOJI.informations(emote.name, preview, emote.id, moment(emote.createdAt.getTime()).format(momentDur)))
                        .setImage(`https://cdn.discordapp.com/emojis/${emote.id}${extension}`)
                        .setTimestamp();
                    message.channel.send(embed);
            } else if (message.guild.emojis.cache.get(args[0])) {
                let emote = message.guild.emojis.cache.get(args[0]);
                
                    let preview;
                    let extension;

                    if (emote.animated === true) {
                        preview = `<a:${emote.name}:${emote.id}>`;
                        extension = `.gif`;
                    } else {
                        preview = `<:${emote.name}:${emote.id}>`;
                        extension = `.png`;
                    }

                    let embed = new MessageEmbed()
                        .setColor("RANDOM")
                        .setDescription(message.guild.lang.COMMANDS.EMOJI.informations(emote.name, preview, emote.id, moment(emote.createdAt.getTime()).format(momentDur)))
                        .setImage(`https://cdn.discordapp.com/emojis/${emote.id}${extension}`)
                        .setTimestamp();
                    message.channel.send(embed);
            }
        }
    }
}