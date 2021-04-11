const { MessageEmbed, ReactionCollector } = require("discord.js");
const Command = require("../../structures/Command");
const {
    randomInt
} = require("../../structures/Utils");

const fishes = {
    "junk": {
        "symbol": "🔧",
        "max": 8,
        "min": 3
    },
    "common": {
        "symbol": "🐟",
        "max": 16,
        "min": 10
    },
    "uncommon": {
        "symbol": "🐠",
        "max": 25,
        "min": 20
    },
    "rare": {
        "symbol": "🐡",
        "max": 100,
        "min": 75
    }
}

module.exports = class FishCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'fish',
            description: "Lets go fishing!",
            usage: 'fish [sell / inventory]',
            type: 'economy',
            cooldown: 15
        });
    }

    async run(message, args) {
        this.bot.db.query(`SELECT * FROM Economy WHERE userID='${message.author.id}'`, async (err, rows) => {
            if (args[0] === "inventory") {
                let embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setAuthor(message.guild.lang.COMMANDS.FISH.INVENTORY.inventory, message.author.displayAvatarURL())
                    .setDescription(message.guild.lang.COMMANDS.FISH.INVENTORY.content(rows[0] ? rows[0].junkFish : 0, rows[0] ? rows[0].commonFish : 0, rows[0] ? rows[0].uncommonFish : 0, rows[0] ? rows[0].rareFish : 0))
                message.channel.send(embed);
            } else if (args[0] === "sell") {
                let embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setAuthor(message.guild.lang.COMMANDS.FISH.SELL.sellWhat, message.author.displayAvatarURL())
                    .setDescription(message.guild.lang.COMMANDS.FISH.SELL.content(rows[0] ? rows[0].junkFish : 0, rows[0] ? rows[0].commonFish : 0, rows[0] ? rows[0].uncommonFish : 0, rows[0] ? rows[0].rareFish : 0))

                let m = await message.channel.send(message.guild.lang.COMMANDS.FISH.SELL.pleaseWait);

                m.react('🔧').then(() => {
                    m.react('🐟').then(() => {
                        m.react('🐠').then(() => {
                            m.react('🐡').then(() => {
                                m.react('❌').then(() => {
                                    m.edit(null, embed);
                                    const filter = (reaction, user) => ['🔧', '🐟', '🐠', '🐡', '❌'].includes(reaction.emoji.name) && user.id === message.author.id
                                    const reactionCollector = new ReactionCollector(m, filter, {
                                        time: 600000
                                    })
                                
                                reactionCollector.on('collect', async reaction => {
                                    switch (reaction.emoji.name) {
                                        case '🔧': {
                                            if (!rows[0] || rows[0].junkFish === 0) {
                                                m.reactions.removeAll()
                                                return reactionCollector.stop(["failed", "junk"]);
                                            }
                                            else {
                                                m.reactions.removeAll()
                                                return reactionCollector.stop(["success", "junk"]);
                                            }
                                        }
                                        case '🐟': {
                                            if (!rows[0] || rows[0].commonFish === 0) {
                                                m.reactions.removeAll()
                                                return reactionCollector.stop(["failed", "common"]);
                                            }
                                            else {
                                                m.reactions.removeAll()
                                                return reactionCollector.stop(["success", "common"]);
                                            }
                                        }
                                        case '🐠': {
                                            if (!rows[0] || rows[0].uncommonFish === 0) {
                                                m.reactions.removeAll()
                                                return reactionCollector.stop(["failed", "uncommon"]);
                                            }
                                            else {
                                                m.reactions.removeAll()
                                                return reactionCollector.stop(["success", "uncommon"]);
                                            }
                                        }
                                        case '🐡': {
                                            if (!rows[0] || rows[0].rareFish === 0) {
                                                m.reactions.removeAll()
                                                return reactionCollector.stop(["failed", "rare"]);
                                            }
                                            else {
                                                m.reactions.removeAll()
                                                return reactionCollector.stop(["success", "rare"]);
                                            }
                                        }
                                        case '❌':
                                            m.reactions.removeAll();
                                            reactionCollector.stop(["cancelled"])
                                    }
                                })
                                reactionCollector.on('end', (collected, reason) => {
                                    if (reason[0] === "success") {
                                        let amountGiven = 0;
                                        for (let i = 0; i < Number(rows[0][`${reason[1]}Fish`]); i++) {
                                            amountGiven += randomInt(fishes[reason[1]].min, fishes[reason[1]].max);
                                        }
                                        this.bot.db.query(`UPDATE Economy SET balance='${Number(rows[0].balance) + Number(amountGiven)}', ${reason[1]}Fish='0' WHERE userID='${message.author.id}'`)
                                        embed.author.name = message.guild.lang.COMMANDS.FISH.SELL.sold
                                        embed.description = message.guild.lang.COMMANDS.FISH.SELL.soldContent(Number(rows[0][`${reason[1]}Fish`]), fishes[reason[1]].symbol, amountGiven)
                                        m.edit(embed);
                                    } else if (reason[0] === "failed") {
                                        embed.description = message.guild.lang.COMMANDS.FISH.SELL.failed(fishes[reason[1]].symbol)
                                        m.edit(embed);
                                    } else if (reason[0] === "cancelled") {
                                        embed.description = message.guild.lang.COMMANDS.FISH.SELL.cancelled
                                        m.edit(embed);
                                    }
                                })
                            })
                        })
                    })
                    })
                })
            } else {
                const rng = randomInt(0, 100)
                let rarity;
                if (rng < 50) rarity = 'junk';
                else if (rng < 80) rarity = 'common';
                else if (rng < 100) rarity = 'uncommon';
                else rarity = 'rare';
                const fish = fishes[rarity];

                if (!rows[0]) {
                    this.bot.db.query(`INSERT INTO Economy (userID) VALUES ('${message.author.id}')`);
                    return message.reply(message.guild.lang.COMMANDS.FISH.notEnoughCoins)
                } else if (rows[0] && rows[0].balance < 10) return message.reply(message.guild.lang.COMMANDS.FISH.notEnoughCoins)
                else {
                    this.bot.db.query(`UPDATE Economy SET ${rarity}Fish='${Number(rows[0][`${rarity}Fish`]) + 1}', balance='${Number(rows[0].balance - 10)}' WHERE userID='${message.author.id}'`)
                return message.channel.send(message.guild.lang.COMMANDS.FISH.caught(fish.symbol))
            }
        }
        })
    }
}