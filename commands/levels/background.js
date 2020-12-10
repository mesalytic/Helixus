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
            console.log()
            if (!bgBuy) return message.reply('[❌] - Please specify a background to buy! To see the list of available backgrounds, check the `am!background list` command!')
            if (!Object.keys(backgroundColor).includes(bgBuy)) return message.reply('[❌] - Please specify a valid background to buy! To see the list of available backgrounds, check the `am!background list` command!')

            this.bot.db.query(`SELECT * FROM Backgrounds WHERE userID='${message.author.id}'`, (err, rows) => {
                this.bot.db.query(`SELECT * FROM Economy WHERE userID='${message.author.id}'`, (err, eRows) => {
                    let coins;
                    if (!rows[0]) this.bot.db.query(`INSERT INTO Backgrounds (userID, activeBg) VALUES ('${message.author.id}', 'Moonlit Asteroid')`)
                    if (!eRows[0]) {
                        this.bot.db.query(`INSERT INTO Economy (userID, balance, dailyCooldown) VALUES ('${message.author.id}', '${amount}', '${Date.now()}')`)
                        coins = 0;
                    } else coins = eRows[0].balance;
                    if (coins < 5000) return message.reply('[❌] You don\'t have **5000** coins! Come back later...');
                    else {
                        if (rows[0][bgBuy] === "true") return message.reply('[❌] - You already have this background!')
                        this.bot.db.query(`UPDATE Economy SET balance = '${coins - 5000}' WHERE userID='${message.author.id}'`);
                        this.bot.db.query(`UPDATE Backgrounds SET \`${bgBuy}\` = 'true' WHERE userID='${message.author.id}'`);
                        return message.channel.send(`[✅] - You have bought the **${bgBuy}** background!`)
                    }
                })
            })
        }
        if (args[0] === "set") {
            this.bot.db.query(`SELECT * FROM Backgrounds WHERE userID='${message.author.id}'`, (err, rows) => {
                if (!rows[0]) {
                    this.bot.db.query(`INSERT INTO Backgrounds (userID, activeBg) VALUES ('${message.author.id}', 'Moonlit Asteroid')`)
                    return message.channel.send('You don\'t have any background...')
                } else {
                    let bgSet = args.slice(1).join(" ");
                    if (!bgSet) return message.reply('[❌] - Please specify a background to set! To see the list of available backgrounds, check the `am!background list` command!')
                    if (!Object.keys(backgroundColor).includes(bgSet)) return message.reply('[❌] - Please specify a valid background to set! To see the list of available backgrounds, check the `am!background list` command!')
                    this.bot.db.query(`UPDATE Backgrounds SET activeBg = '${bgSet}' WHERE userID='${message.author.id}'`)
                    return message.channel.send(`[✅] - You successfully set the **${bgSet}** background!`)
                }
            })
        }
        if (args[0] === "list") {
            let page = 0
            const pages = Math.ceil(Number(Object.keys(backgroundColor).length) / 10) - 1
            let m = await message.channel.send("Please wait...");
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
                                            console.log(`page (${page}) > pages (${pages})`)
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
                                    m.edit("Paginator closed...", {
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
                        output += `[${rows[0][bg] === "true" ? '✅' : '❌'}] ${bg} - 5000 coins\n`
                    })

                    const embed = new MessageEmbed()
                        .setColor("RANDOM")
                        .setAuthor("Rank Background List")
                        .setTitle(`The ❌ sign means you don't have the background.\nBuy it with \`am!background buy <background>\` !`)
                        .setDescription(output)
                    await m.edit(embed);
                })
            }

        }
    }
}