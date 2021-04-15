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
            name: 'leaderboard',
            description: 'Displays a leaderboard of monthly votes.',
            notes: 'Prizes awaits the top 3!',
            type: 'levels'
        });
    }

    async run(message) {
        this.bot.db.query(`SELECT * FROM Economy WHERE monthlyVotes > 0 ORDER BY monthlyVotes DESC`, async (err, rows) => {
            let count
            if (err) throw err
            count = rows.length


            let page = 0
            const pages = Math.ceil(Number(Number(count) / 10)) - 1
            let m = await message.channel.send(message.guild.lang.COMMANDS.LEADERBOARD.loading)

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
                                                if (page < 0) page = 0
                                                else page = page - 1
                                                await gen(page)
                                                break
                                            case '➡️':
                                                console.log(page)
                                                console.log(pages);
                                                if (page > pages || page === pages) page = page;
                                                else page = page + 1
                                                await gen(page)
                                                break
                                            case '⏭️':
                                                page = pages
                                                await gen(page)
                                                break
                                            case '📄':
                                                let hasteOutput = "";
                                                for (let i = 0; i < rows.length; i++) {
                                                    
                                                    const u = this.bot.users.cache.get(rows[i].userID)
                            
                                                    if (u) hasteOutput += `[${(i + 1)}] ${Util.escapeMarkdown(u.tag)} - ${rows[i].monthlyVotes} votes\n`
                                                    else hasteOutput += `[${(i + 1)}] ${u.id} - ${rows[i].monthlyVotes} votes\n`
                                                }
                                                message.channel.send(message.guild.lang.COMMANDS.LEADERBOARD.fullTop(await hastebin(hasteOutput, { url: "https://paste.aliceraina.moe", extension: "txt" })));
                                                reactionCollector.stop();
                                            case '❌':
                                                reactionCollector.stop()
                                        }
                                    })
                                    reactionCollector.on('end', () => {
                                        m.edit(message.guild.lang.COMMANDS.LEADERBOARD.closed, {
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
                message.client.db.query(`SELECT * FROM Economy WHERE monthlyVotes > 0 ORDER BY monthlyVotes DESC LIMIT ${page * 10},10`, async (err, rows) => {
                    var output = ""
                    for (let i = 0; i < rows.length; i++) {
                        const u = message.client.users.cache.get(rows[i].userID)
                            
                        if (u) output += `[${(i + 1) + (page * 10)}] **${Util.escapeMarkdown(u.tag)}** - ${rows[i].monthlyVotes} votes\n`
                        else output += `[${(i + 1) + (page * 10)}] **${rows[i].userID}** - ${rows[i].monthlyVotes} votes\n`
                    }

                    const embed = new MessageEmbed()
                        .setColor("RANDOM")
                        .setAuthor(message.guild.lang.COMMANDS.LEADERBOARD.title, message.guild.iconURL())
                        .setTitle(`Page ${page + 1}/${pages + 1}\n${message.guild.lang.COMMANDS.LEADERBOARD.notes}`)
                        .setDescription(output)
                        .setFooter(message.guild.lang.COMMANDS.LEADERBOARD.footer)
                    await m.edit("", {
                        embed: embed
                    })
                })
            }
        })
    }
}