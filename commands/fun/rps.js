const {
    MessageEmbed,
    ReactionCollector
} = require("discord.js");
const Command = require("../../structures/Command");
const choices = ['✊', '📄', '✂️'];
const choicesEmotes = {
    '✊': 'Rock',
    '📄': 'Paper',
    '✂️': 'Scissors'
}

module.exports = class RpsCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'rps',
            description: 'Play Rock Paper Scissors against the AI!',
            usage: 'rps <choice>',
            examples: ["rps rock", "rps paper", "rps scissors"],
            type: 'fun'
        });
    }

    /**
     * TODO:
     * # Reaction Collector for User Choice
     */

    async run(message, args) {
        const response = choices[Math.floor(Math.random() * choices.length)];

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(message.author.tag, message.author.avatarURL({
                size: 512
            }))
            .setTitle(message.guild.lang.COMMANDS.RPS.whatChoice)
            .setDescription(message.guild.lang.COMMANDS.RPS.choiceList)
            .setTimestamp();

        let m = await message.channel.send(message.guild.lang.COMMANDS.RPS.loading);
        m.react('✊').then(() => {
            m.react('📄').then(() => {
                m.react('✂️').then(() => {
                    m.edit(null, {
                        embed: embed
                    });

                    const filter = (reaction, user) => ['✊', '📄', '✂️'].includes(reaction.emoji.name) && user.id === message.author.id;
                    const reactionCollector = new ReactionCollector(m, filter, {
                        time: 600000,
                        max: 1
                    })

                    reactionCollector.on('collect', async reaction => {
                        if (reaction.emoji.name === response) embed.setTitle(message.guild.lang.COMMANDS.RPS.tie)
                        else if ((reaction.emoji.name === '✊' && response === '📄') || (reaction.emoji.name === '📄' && response === '✂️') || (reaction.emoji.name === '✂️' && response === '✊')) embed.setTitle(message.guild.lang.COMMANDS.RPS.botWin)
                        else embed.setTitle(message.guild.lang.COMMANDS.RPS.userWin)
                        embed.setDescription(message.guild.lang.COMMANDS.RPS.choices(reaction.emoji.name, response))
                        m.edit(null, { embed: embed })
                    })
                })
            })
        })
    }
}