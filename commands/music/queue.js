const {
    MessageEmbed
} = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class QueueCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'queue',
            description: 'Displays the whole music queue. Use the reactions to navigate.',
            usage: 'queue',
            type: 'music',
            clientPermissions: ["MANAGE_MESSAGES", "ADD_REACTIONS"]
        });
    }

    async run(message) {
        const queue = this.bot.queue.get(message.guild.id);
        if (!queue) return message.channel.send(message.guild.lang.COMMANDS.QUEUE.noQueue);

        let currentPage = 0;
        const embeds = generateQueueEmbed(message, queue.songs);

        const queueEmbed = await message.channel.send(`**Page ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);

        try {
            await queueEmbed.react("⬅️");
            await queueEmbed.react("➡️");
        } catch (error) {
            console.error(error);
            message.channel.send(error.message).catch(console.error);
        }

        const filter = (reaction, user) => ["⬅️", "➡️"].includes(reaction.emoji.name) && message.author.id === user.id;
        const collector = queueEmbed.createReactionCollector(filter, {
            time: 60000
        });

        collector.on("collect", async (reaction, user) => {
            try {
                if (reaction.emoji.name === "➡️") {
                    if (currentPage < embeds.length - 1) {
                        currentPage++;
                        queueEmbed.edit(`**Page ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                    }
                } else if (reaction.emoji.name === "⬅️") {
                    if (currentPage !== 0) {
                        --currentPage;
                        queueEmbed.edit(`**Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                    }
                } else {
                    collector.stop();
                    reaction.message.reactions.removeAll();
                }
                await reaction.users.remove(message.author.id);
            } catch (error) {
                console.error(error);
                return message.channel.send(error.message).catch(console.error);
            }
        });


        function generateQueueEmbed(msg, queue) {
            let embeds = [];
            let k = 10;

            for (let i = 0; i < queue.length; i += 10) {
                const current = queue.slice(i, k);
                let j = i;
                k += 10;

                const info = current.map((track) => `${++j} - [${track.title}](${track.url})`).join("\n");

                const embed = new MessageEmbed()
                    .setTitle(message.guild.lang.COMMANDS.QUEUE.embedTitle)
                    .setThumbnail(message.guild.iconURL())
                    .setColor("RANDOM")
                    .setDescription(message.guild.lang.COMMANDS.QUEUE.embedDescription(queue[0].title, queue[0].url, info))
                    .setTimestamp();
                embeds.push(embed);
            }

            return embeds;
        }
    }
}