const jimp = require('jimp');
const Command = require("../../structures/Command");

module.exports = class ConvoluteCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'convolute',
            usage: 'convolute [url]',
            description: 'Convolutes the image.',
            type: 'images'
        });
    }

    async run(message, args) {
        let url;
        if (message.attachments.first()) { url = message.attachments.first().url; } else if (message.mentions.users.first()) { url = message.mentions.users.first().avatarURL({ format: "png", size: 2048 }); } else { url = args[0] ? args[0] : message.author.avatarURL({ format: "png", size: 2048 }); }

        const m = await message.channel.send(message.guild.lang.COMMANDS.CONVOLUTE.pleaseWait);
        
        jimp.read(url).then(img => {
            img.convolute([[-2, -1, 0], [-1, 1, 1], [0, 1, 2]])
            .getBuffer(jimp.MIME_PNG, (err, res) => {
                m.delete();
                message.channel.send({ files: [{ attachment: new Buffer(res, 'base64'), name: "convolute.png" }] });
            })
        })        
    }
}