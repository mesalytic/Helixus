const {
    ReactionCollector,
    MessageEmbed
} = require("discord.js");
const moment = require('moment');
const Command = require("../../structures/Command");

module.exports = class WarnCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'warn',
            usage: 'warn <@user> [reason]',
            description: 'Warns the specified user.',
            type: 'moderation',
            userPermissions: ["KICK_MEMBERS"],
            clientPermissions: ["KICK_MEMBERS"]
        });
    }

    async run(message, args) {

        if (args[0] === "list") {
            let member = message.mentions.members.first();

            if (!member) return this.bot.commands.get("help").run(message, ["warn"]);

            this.bot.db.query(`SELECT * FROM Warns WHERE guildID='${message.guild.id}' AND memberID='${member.id}' ORDER BY date ASC`, async (err, rows) => {
                let count;
                if (err) throw err;
                count = rows.length;
                
                let page = 0
                const pages = Math.ceil(Number(Number(count) / 10)) - 1

                let m = await message.channel.send(message.guild.lang.COMMANDS.WARN.LIST.pleaseWait)

                m.react('⏮️').then(() => {
                    m.react('⬅️').then(() => {
                        m.react('➡️').then(() => {
                            m.react('⏭️').then(() => {
                                m.react('❌').then(async () => {
                                    await gen(page)

                                    const filter = (reaction, user) => ['⏮️', '⬅️', '➡️', '⏭️', '❌'].includes(reaction.emoji.name) && user.id === message.author.id
                                    const reactionCollector = new ReactionCollector(m, filter, {
                                        time: 600000
                                    })

                                    reactionCollector.on('collect', async reaction => {
                                        switch (reaction.emoji.name) {
                                            case '⏮️':
                                                page = 0
                                                await gen(page)
                                                break
                                            case '⬅️':
                                                if (page < 0) return page = 0
                                                page = page - 1
                                                await gen(page)
                                                break
                                            case '➡️':
                                                if (page > pages) return
                                                page = page + 1
                                                await gen(page)
                                                break
                                            case '⏭️':
                                                page = pages
                                                await gen(page)
                                                break
                                            case '❌':
                                                reactionCollector.stop()
                                        }
                                    })
                                    reactionCollector.on('end', () => {
                                        m.edit(message.guild.lang.COMMANDS.WARN.LIST.closed, {
                                            embed: null
                                        })
                                    })
                                })
                            })
                        })
                    })
                })

                async function gen(page) {
                    message.client.db.query(`SELECT * FROM Warns WHERE guildID='${message.guild.id}' AND memberID='${member.id}' ORDER BY date ASC LIMIT ${page * 5},5`, async (err, warns) => {
                        const embed = new MessageEmbed()
                            .setColor("RANDOM")
                            .setAuthor(message.guild.lang.COMMANDS.WARN.LIST.embedAuthor(member.user.tag), message.guild.iconURL())
                            .setTitle(message.guild.lang.COMMANDS.WARN.LIST.embedTitle(page + 1, count))
                            .setFooter(`${message.guild.lang.COMMANDS.WARN.LIST.embedFooter} | ID: ${member.id}`)
    
    
                        for (let i = 0; i < warns.length; i++) {
                            const mod = message.guild.members.resolve(warns[i].moderatorID);
                            
                            embed.addField(message.guild.lang.COMMANDS.WARN.LIST.embedFieldTitle(i, page), message.guild.lang.COMMANDS.WARN.LIST.embedFieldValue(warns[i].reason, mod.user.tag, mod.id, moment(warns[i].date).format("DD/MM/YYYY, HH:mm:ss")))
                        }
    
                        await m.edit("", {
                            embed: embed
                        })
                    })
                }
            })

            
        } else if (args[0] === "remove") {
            message.reply("❌ - This will be available at a later date.")
        } else {
            let member = message.mentions.members.first();

            if (!member) return message.reply(message.guild.lang.COMMANDS.WARN.noMention);

            let reason = message.content.split(" ").slice(2).join(" ");
            if (!reason) reason = message.guild.lang.COMMANDS.WARN.noReason;

            this.bot.db.query(`INSERT INTO Warns (guildID, memberID, reason, date, moderatorID) VALUES ('${message.guild.id}', '${member.id}', '${reason}', '${new Date().getTime()}', '${message.author.id}')`);

            message.channel.send(message.guild.lang.COMMANDS.WARN.warned(member.user.tag, message.author.tag, reason))
            member.send(message.guild.lang.COMMANDS.WARN.dmWarned(message.guild.name, message.author.tag, reason));
        }
    }
}