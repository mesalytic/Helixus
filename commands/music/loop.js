const {
    MessageEmbed
} = require("discord.js");
const Command = require("../../structures/Command");
const { canModifyQueue } = require("../../structures/Utils");

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
        if (!queue) return message.reply("There is nothing playing.").catch(console.error);
        if (!canModifyQueue(message.member)) return;

        queue.loop = !queue.loop;
        message.channel.send(`✅ - The loop is now ${queue.loop ? "**on**" : "**off**"}!`);
    }
}