const Command = require("../../structures/Command");
const {
    Rank
} = require('canvacord');
const { MessageAttachment } = require("discord.js");

module.exports = class RankCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'rank',
            description: 'Displays your level stats.',
            aliases: ['level'],
            type: 'levels'
        });
    }

    async run(message) {
        let xp, lvl;
        this.bot.db.query(
            `SELECT * FROM Levels WHERE user='${message.author.id}' AND guild='${message.guild.id}'`,
            (err, rows) => {
                this.bot.db.query(`SELECT * FROM Levels WHERE guild='${message.guild.id}' ORDER BY level DESC, points DESC `, async (err, rRows) => {
                    if (!rows[0].points) xp = 0;
                    else xp = rows[0].points;
                    if (!rows[0].level) lvl = 1;
                    else lvl = rows[0].level;

                    const xpNextLvl = (5 * (rows[0].level ^ 2) + 50 * rows[0].level + 100) * 1.20;
                    
                    const rankPos = await rRows.findIndex(function cmpFunction(item) {
                        return item.user == message.author.id;
                    })
                    
                    const rank = new Rank()
                        .setAvatar(message.author.avatarURL( { format: "png" }))
                        .setCurrentXP(rows[0].points)
                        .setRequiredXP(xpNextLvl)
                        .setLevel(rows[0].level)
                        .setRank(rankPos + 1, "RANK")
                        .setStatus("online")
                        .setProgressBar(["#ff0061", "#5d1f91"], "GRADIENT")
                        .setUsername(message.author.username)
                        .renderEmojis(true)
                        .setDiscriminator(message.author.discriminator);
    
                    rank.build()
                        .then(data => {
                            const attachment = new MessageAttachment(data, `${message.author.id}-rank.png`);
                            message.channel.send(attachment);
                        });
    
                })
            })
    }
}