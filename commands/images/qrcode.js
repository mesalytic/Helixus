const request = require('node-superfetch')
const Command = require("../../structures/Command");

module.exports = class QRCodeCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'qrcode',
            usage: 'qrcode <string>',
            description: 'Converts the specified string to a QRCode.',
            type: 'images'
        });
    }

    async run(message, args) {
        if (!args[0]) return message.reply(message.guild.lang.COMMANDS.QRCODE.noArgs)

        const m = await message.channel.send(message.guild.lang.COMMANDS.QRCODE.pleaseWait);
        
        const { body } = await request.get("https://api.qrserver.com/v1/create-qr-code/").query({
            data: args.join(" ")
        });
        await m.delete();
        return message.channel.send({ files: [{ attachment: body, name: "qr-code.png" }] });
    }
}