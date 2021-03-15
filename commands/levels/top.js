const Command = require("../../structures/Command");

const {
    MessageEmbed,
    Util,
    ReactionCollector
} = require("discord.js");

const hastebin = require('hastebin-gen');
module.exports = class TopCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'top',
            description: 'Displays a leaderboard of the guild\'s XP ranks.',
            aliases: ['leaderboard'],
            type: 'levels'
        });
    }

    async run(message) {
        this.bot.db.query(`SELECT * FROM Levels WHERE guild='${message.guild.id}'`, async (err, rows) => {
            let count
            if (err) throw err
            count = rows.length


            let page = 0
            const pages = Math.ceil(Number(Number(count) / 10)) - 1
            let m = await message.channel.send(message.guild.lang.COMMANDS.TOP.pleaseWait)

            m.react('⏮️').then(() => {
                m.react('⬅️').then(() => {
                    m.react('➡️').then(() => {
                        m.react('⏭️').then(() => {
                            m.react('📄').then(() => {
                                m.react('❌').then(async () => {
                                    await gen(page)

                                    const filter = (reaction, user) => ['⏮️', '⬅️', '➡️', '⏭️', '📄', '❌'].includes(reaction.emoji.name) && user.id === message.author.id
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
                                            case '📄':
                                                let hasteOutput = "";
                                                for (let i = 0; i < rows.length; i++) {
                                                    
                                                    const u = message.guild.members.resolve(rows[i].user)
                            
                                                    let diff = (5 * (rows[i].level ^ 2) + 50 * rows[i].level + 100) * 1.20
                            
                                                    if (u) hasteOutput += `[${(i + 1) + (page * 10)}] **${Util.escapeMarkdown(u.user.tag)}** - Level ${rows[i].level} | (${rows[i].points}/${diff} XP)\n`
                                                    else hasteOutput += `[${(i + 1) + (page * 10)}] **????** - Level ${rows[i].level} | (${rows[i].points}/${diff} XP)\n`
                                                }
                                                message.channel.send(message.guild.lang.COMMANDS.TOP.fullTop(await hastebin(hasteOutput, { extension: "txt" })))
                                                reactionCollector.stop();
                                            case '❌':
                                                reactionCollector.stop()
                                        }
                                    })
                                    reactionCollector.on('end', () => {
                                        m.edit(message.guild.lang.COMMANDS.TOP.closedPaginator, {
                                            embed: null
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })

            async function gen(page) {
                message.client.db.query(`SELECT * FROM Levels WHERE guild = '${message.guild.id}' ORDER BY level DESC, points DESC LIMIT ${page * 10},10`, async (err, rows) => {
                    var output = ""
                    for (let i = 0; i < rows.length; i++) {
                        const u = message.guild.members.resolve(rows[i].user)

                        let diff = (5 * (rows[i].level ^ 2) + 50 * rows[i].level + 100) * 1.20

                        if (u) output += `[${(i + 1) + (page * 10)}] **${Util.escapeMarkdown(u.user.tag)}** - Level ${rows[i].level} | (${rows[i].points}/${diff} XP)\n`
                        else output += `[${(i + 1) + (page * 10)}] **????** - Level ${rows[i].level} | (${rows[i].points}/${diff} XP)\n`
                    }

                    const embed = new MessageEmbed()
                        .setColor("RANDOM")
                        .setAuthor(message.guild.lang.COMMANDS.TOP.embedAuthor(message.guild.name), message.guild.iconURL())
                        .setTitle(`Page ${page + 1}/${pages + 1}`)
                        .setDescription(output)
                        .setFooter(message.guild.lang.COMMANDS.TOP.embedFooter)
                    await m.edit("", {
                        embed: embed
                    })
                })
            }
        })
    }
}