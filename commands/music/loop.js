const {
    MessageEmbed
} = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class LoopCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'loop',
            description: 'Loops the music queue',
            usage: 'loop',
            type: 'music'
        });
    }

    async run(message) {
        const queue = this.bot.queue.get(message.guild.id);
        if (!queue) return message.reply(message.guild.lang.COMMANDS.LOOP.noQueue).catch(console.error);

        if (queue && message.member.voice.channel !== message.guild.me.voice.channel) return message.reply(message.guild.lang.COMMANDS.PLAY.notSameVoiceChannel)

        queue.loop = !queue.loop;
        message.channel.send(message.guild.lang.COMMANDS.LOOP.success(queue.loop ? true : false));
    }
}