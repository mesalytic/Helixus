const {
    MessageEmbed,
    ReactionCollector
} = require("discord.js");
const Command = require("../../structures/Command");
const {
    backgroundColor
} = require("../../structures/Constants");

module.exports = class BackgroundCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'background',
            description: 'Allows you to see the list of backgrounds, or to buy and set them.',
            aliases: ['bg'],
            usage: 'background <list/set/buy> <background>',
            examples: ['background list', 'background set Alive', 'background buy Amin'],
            type: 'levels'
        });
    }

    async run(message, args) {
        if (args[0] === "buy") {
            let bgBuy = args.slice(1).join(" ");
            if (!bgBuy) return message.reply(message.guild.lang.COMMANDS.BACKGROUND.BUY.noBackgroundSpecified)
            if (!Object.keys(backgroundColor).includes(bgBuy)) return message.reply(message.guild.lang.COMMANDS.BACKGROUND.BUY.invalidBackground)

            this.bot.db.query(`SELECT * FROM Backgrounds WHERE userID='${message.author.id}'`, (err, rows) => {
                this.bot.db.query(`SELECT * FROM Economy WHERE userID='${message.author.id}'`, (err, eRows) => {
                    let coins;
                    if (!rows[0]) this.bot.db.query(`INSERT INTO Backgrounds (userID, activeBg) VALUES ('${message.author.id}', 'Moonlit Asteroid')`)
                    if (!eRows[0]) {
                        this.bot.db.query(`INSERT INTO Economy (userID, balance, dailyCooldown) VALUES ('${message.author.id}', '${amount}', '${Date.now()}')`)
                        coins = 0;
                    } else coins = eRows[0].balance;
                    if (coins < 12500) return message.reply(message.guild.lang.COMMANDS.BACKGROUND.BUY.notEnoughCoins);
                    else {
                        if (rows[0][bgBuy] === "true") return message.reply(message.guild.lang.COMMANDS.BACKGROUND.BUY.alreadyBought)
                        this.bot.db.query(`UPDATE Economy SET balance = '${coins - 12500}' WHERE userID='${message.author.id}'`);
                        this.bot.db.query(`UPDATE Backgrounds SET \`${bgBuy}\` = 'true' WHERE userID='${message.author.id}'`);
                        return message.channel.send(message.guild.lang.COMMANDS.BACKGROUND.BUY.success(bgBuy))
                    }
                })
            })
        }
        if (args[0] === "set") {
            this.bot.db.query(`SELECT * FROM Backgrounds WHERE userID='${message.author.id}'`, (err, rows) => {
                if (!rows[0]) {
                    this.bot.db.query(`INSERT INTO Backgrounds (userID, activeBg) VALUES ('${message.author.id}', 'Moonlit Asteroid')`)
                    return message.channel.send(message.guild.lang.COMMANDS.BACKGROUND.SET.noBackgrounds)
                } else {
                    let bgSet = args.slice(1).join(" ");
                    if (!bgSet) return message.reply(message.guild.lang.COMMANDS.BACKGROUND.SET.noBackgroundSpecified)
                    if (!Object.keys(backgroundColor).includes(bgSet)) return message.reply(message.guild.lang.COMMANDS.BACKGROUND.SET.invalidBackground)
                    this.bot.db.query(`UPDATE Backgrounds SET activeBg = '${bgSet}' WHERE userID='${message.author.id}'`)
                    return message.channel.send(message.guild.lang.COMMANDS.BACKGROUND.SET.success(bgSet))
                }
            })
        }
        if (args[0] === "list") {
            let page = 0
            const pages = Math.ceil(Number(Object.keys(backgroundColor).length) / 10) - 1
            let m = await message.channel.send(message.guild.lang.COMMANDS.BACKGROUND.LIST.pleaseWait);
            m.react('⏮️').then(() => {
                m.react('⬅️').then(() => {
                    m.react('➡️').then(() => {
                        m.react('⏭️').then(() => {
                            m.react('❌').then(async () => {
                                await gen(page, this.bot);
                                const filter = (reaction, user) => ['⏮️', '⬅️', '➡️', '⏭️', '❌'].includes(reaction.emoji.name) && user.id === message.author.id
                                const reactionCollector = new ReactionCollector(m, filter, {
                                    time: 600000
                                })

                                reactionCollector.on('collect', async reaction => {
                                    switch (reaction.emoji.name) {
                                        case '⏮️':
                                            page = 0
                                            await gen(page, this.bot)
                                            break
                                        case '⬅️':
                                            if (page < 0) return page = 0
                                            page = page - 1
                                            await gen(page, this.bot)
                                            break
                                        case '➡️':
                                            if (page > pages) return
                                            page = page + 1
                                            await gen(page, this.bot)
                                            break
                                        case '⏭️':
                                            page = pages
                                            await gen(page, this.bot)
                                            break
                                        case '❌':
                                            reactionCollector.stop()
                                    }
                                })
                                reactionCollector.on('end', () => {
                                    m.edit(message.guild.lang.COMMANDS.BACKGROUND.LIST.closedPaginator, {
                                        embed: null
                                    })
                                })
                            })
                        })
                    })
                })
            })

            async function gen(page, bot) {
                bot.db.query(`SELECT * FROM Backgrounds WHERE userID='${message.author.id}'`, async (err, rows) => {

                    let output = "";
                    let array = Object.keys(backgroundColor).slice(page * 10, (page * 10) + 10)

                    array.forEach(bg => {
                        output += `[${rows[0][bg] === "true" ? '✅' : '❌'}] ${bg} - 12500 coins [${message.guild.lang.COMMANDS.BACKGROUND.LIST.preview}](https://aliceraina.moe/img/${bg.replace(/ /g, '_')}.png)\n`
                    })

                    const embed = new MessageEmbed()
                        .setColor("RANDOM")
                        .setAuthor(message.guild.lang.COMMANDS.BACKGROUND.LIST.embedAuthor)
                        .setTitle(message.guild.lang.COMMANDS.BACKGROUND.LIST.embedTitle)
                        .setDescription(output)
                    await m.edit(embed);
                })
            }

        }
    }
}