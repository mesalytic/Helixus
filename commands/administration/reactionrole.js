const Command = require("../../structures/Command");
const {
    unicodeRegex
} = require("../../structures/Constants");
const {
    base64,
    parseEmoji
} = require("../../structures/Utils");

module.exports = class ReactionRoleCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'reactionrole',
            type: 'administration',
            description: 'Lets you configure reaction roles.\nIf a user adds a reaction on a reaction role, the role linked to the reaction will be given to the user.',
            usage: 'reactionrole <channel tag/name/ID> <message ID> <role tag/name/ID> <emoji>\nam!reactionrole remove <channel tag/name/ID> <message ID> <emoji>',
            examples: ['reactionrole #channel 56465654654654654 @Role 😃', 'reactionrole remove #channel 56465654654654654 😃'],
            userPermissions: ['MANAGE_ROLES'],
            clientPermissions: ["MANAGE_ROLES"]
        });
    }
    async run(message, args) {
        try {
            if (args[0]) {
                if (args[0] === "remove") {
                    let chanName = args.slice(1);
                    if (!chanName) return message.reply(message.guild.lang.COMMANDS.REACTIONROLE.noChanSpecified)

                    let chan = message.guild.channels.cache.find(chan => (chan.name === chanName.toString()) || (chan.id === chanName.toString().replace(/[^\w\s]/gi, '')));
                    if (!chan) return message.reply(message.guild.lang.COMMANDS.REACTIONROLE.noValidChan);

                    let msg;
                    if (chan.messages.resolve(args[2])) msg = await chan.messages.resolve(args[2]);
                    else return message.reply(message.guild.lang.COMMANDS.REACTIONROLE.noMessageID)

                    let emote;
                    if (!args[3]) return message.reply(message.guild.lang.COMMANDS.REACTIONROLE.noEmoteSpecified);
                    if (unicodeRegex.test(args[3]) === true) emote = base64(args[3], "encode");
                    else if (message.guild.emojis.cache.get(parseEmoji(args[3]).id)) emote = parseEmoji(args[3]).id;
                    else return message.reply(message.guild.lang.COMMANDS.REACTIONROLE.noValidEmote);

                    message.client.db.query(`SELECT * FROM ReactionRole WHERE channelID='${chan.id}' AND messageID='${msg.id}' AND emojiID='${emote}'`, async (err, rows) => {
                        if (err) throw err;
                        if (rows[0]) {
                            let emoteDB = "";

                            if (isNaN(emote)) emoteDB = base64(emote, "decode");
                            if (typeof Number(emote) === "number") emoteDB = emote;

                            msg.reactions.resolve(emoteDB).users.remove();
                            con.query(`DELETE FROM ReactionRole WHERE channelID='${chan.id}' AND messageID='${msg.id}' AND emojiID='${emote}'`)
                            return message.reply(message.guild.lang.COMMANDS.REACTIONROLE.REMOVE.success);
                        } else return message.reply(message.guild.lang.COMMANDS.REACTIONROLE.REMOVE.notFound);
                    })
                }

                let chanName = args[0]
                if (!chanName) return message.reply(message.guild.lang.COMMANDS.REACTIONROLE.noChanSpecifed)
                let chan = message.guild.channels.cache.find(chan => (chan.name === chanName.toString()) || (chan.id === chanName.toString().replace(/[^\w\s]/gi, '')));
                if (!chan) return message.reply(message.guild.lang.COMMANDS.REACTIONROLE.noValidChan);

                let msg;
                if (chan.messages.fetch(args[1])) msg = await chan.messages.fetch(args[1]);
                else return message.reply(message.guild.lang.COMMANDS.REACTIONROLE.noMessageID)

                let role;
                if (message.mentions.roles.first()) role = message.mentions.roles.first();
                else if (message.guild.roles.resolve(args[2])) role = message.guild.roles.resolve(args[2]);
                else if (message.guild.roles.cache.find(u => u.name === args[2])) role = message.guild.roles.cache.find(u => u.name === args[2]);
                else return message.reply(message.guild.lang.COMMANDS.REACTIONROLE.noRole);

                let emote;
                if (!args[3]) return message.reply(message.guild.lang.COMMANDS.REACTIONROLE.noEmoteSpecified);
                if (unicodeRegex.test(args[3]) === true) emote = base64(args[3], "encode");
                else if (message.guild.emojis.cache.get(parseEmoji(args[3]).id)) emote = parseEmoji(args[3]).id;
                else return message.reply(message.guild.lang.COMMANDS.REACTIONROLE.noValidEmote);

                message.client.db.query(`SELECT * FROM ReactionRole WHERE messageID='${msg.id}' AND emojiID='${emote.id}'`, (err, rows) => {
                    if (rows[0]) return message.reply(message.guild.lang.COMMANDS.REACTIONROLE.emoteAlreadyUsed);
                    else {
                        message.client.db.query(`SELECT * FROM ReactionRole WHERE messageID='${msg.id}' AND roleID='${role.id}'`, (err, rRows) => {
                            if (rRows[0]) return message.reply(message.guild.lang.COMMANDS.REACTIONROLE.roleAlreadyUsed);
                            message.client.db.query(`INSERT INTO ReactionRole (guildID, channelID, messageID, roleID, emojiID) VALUES ('${message.guild.id}', '${chan.id}', '${msg.id}', '${role.id}', '${emote.toString()}')`);

                            if (isNaN(emote)) emote = base64(emote, "decode");

                            message.channel.send(message.guild.lang.COMMANDS.REACTIONROLE.success(emote))
                            msg.react(emote);
                        })
                    }
                })

            } else return message.client.commands.get("help").run(message, ["reactionrole"])
        } catch (e) {
            if (e.message.match("DiscordAPIError")) return;
        }
    }
}