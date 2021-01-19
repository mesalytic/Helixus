const request = require('node-superfetch')
const Command = require("../../structures/Command");

module.exports = class RobotCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'robot',
            usage: 'robot [string]',
            description: 'Displays a robot based on you (or on any specified text).',
            type: 'images'
        });
    }

    async run(message, args) {
        let string;
        if (!args[0]) string = message.author.tag;
        else string = args.join(" ");

        const m = await message.channel.send(message.guild.lang.COMMANDS.ROBOT.pleaseWait);
        
        const { body } = await request.get(`https://robohash.org/${encodeURIComponent(string)}/`);

        await m.delete();
        return message.channel.send({ files: [{ attachment: body, name: "robot.png" }] });
    }
}