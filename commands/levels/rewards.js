const {
    ReactionCollector,
    MessageEmbed
} = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class RewardsCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'rewards',
            description: 'Lets you configure leveled role rewards.',
            type: 'levels',
            usage: 'rewards <add/remove/show> <level> <role>',
            examples: ["rewards add 1 @Role", "rewards add 1 Role", "rewards add 1 775884568112660512", "rewards remove 1", "rewards show"],
            userPermissions: ["MANAGE_GUILD", "MANAGE_ROLES"],
            clientPermissions: ["MANAGE_ROLES"]
        });
    }

    async run(message, args) {

        if (!args[0]) return this.bot.commands.get("help").run(message, ["rewards"]);

        const method = args[0];
        const lArgs = parseInt(args[1]);
        args.shift();
        args.shift();
        const roleName = args.join(' ');

        const role = message.guild.roles.cache.find(r => (r.name === roleName.toString()) || (r.id === roleName.toString().replace(/[^\w\s]/gi, '')));

        if (method === 'add') {
            if (isNaN(lArgs) && !lArgs || lArgs < 1) {
                return message.reply('[❌] - Please provide a level number for the role reward.');
            } else {
                if (!role) {
                    return message.reply('[❌] - Please provide a role for the role reward.');
                } else {
                    this.bot.db.query(`SELECT * FROM LevelsRewards WHERE guildID='${message.guild.id}' AND level='${lArgs}'`, (err, levelRows) => {
                        this.bot.db.query(`SELECT * FROM LevelsRewards WHERE guildID='${message.guild.id}' AND roleID='${role.id}'`, (err, roleRows) => {
                            if (err) throw err;

                            if (levelRows[0]) return message.reply('[❌] - This level has already been configured for another role!')
                            if (roleRows[0]) return message.reply('[❌] - This role has already been configured for another level!')

                            this.bot.db.query(`INSERT INTO LevelsRewards (guildID, roleID, level) VALUES ('${message.guild.id}', '${role.id}', '${lArgs}')`)
                            return message.channel.send(`[✅] - ${role} has been successfully set for level **${lArgs}**!`)
                        })
                    })
                }
            }
        }
        if (method === "remove") {
            if (isNaN(lArgs) && !lArgs || lArgs < 1) {
                return message.reply('[❌] - Please provide a level number for the role reward.');
            }
            this.bot.db.query(`SELECT * FROM LevelsRewards WHERE guildID='${message.guild.id}' AND roleID='${role.id}'`, (err, roleRows) => {
                if (rRows[0]) {
                    con.query(`DELETE FROM LevelsRewards WHERE guildID='${message.guild.id}' AND level='${lArgs}'`);
                    return message.channel.send(`[✅] - ${role} will no longer be given at level **${lArgs}**!`);
                } else {
                    return message.reply(`[❌] - No rewards were found at level **${lArgs}**.`);
                }
            })
        }
        if (method === "show") {
            this.bot.db.query(`SELECT * FROM LevelsRewards WHERE guildID='${message.guild.id}'`, async (err, rows) => {
                let count
                if (err) throw err
                count = rows.length

                let page = 0
                const pages = Math.ceil(Number(count) / 10) - 1
                let m = await message.channel.send("Please wait...");

                m.react('⏮️').then(() => {
                    m.react('⬅️').then(() => {
                        m.react('➡️').then(() => {
                            m.react('⏭️').then(() => {
                                m.react('❌').then(async () => {
                                    await gen(page, this.bot)

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
                                        m.edit("Paginator closed..", {
                                            embed: null
                                        })
                                    })
                                })
                            })
                        })
                    })
                })

                async function gen(page, bot) {
                    bot.db.query(`SELECT * FROM LevelsRewards WHERE guildID='${message.guild.id}' ORDER BY level ASC LIMIT ${page * 10},10`, async (err, rows) => {

                        var output = ""
                        for (let i = 0; i < rows.length; i++) {
                            output += `[**${rows[i].level}**] <@&${rows[i].roleID}>\n`
                        }
                        const embed = new MessageEmbed()
                            .setColor("RANDOM")
                            .setAuthor(`Role Rewards List (${page + 1}/${pages + 1})`, message.guild.iconURL())
                            .setDescription(output)
                            .setTimestamp();

                        await m.edit(embed);
                    })
                }
            })
        }
    }
}