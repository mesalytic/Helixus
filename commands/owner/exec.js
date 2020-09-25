const Command = require('../../structures/Command');
const config = require('../../config.json')

module.exports = class ExecCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'exec',
            usage: 'exec <code>',
            description: 'Executing code with Shell.',
            type: 'owner'
        })
    }

    async run(message, args) {
        const exec = require("child_process").exec;

        if (message.author.id !== config.ownerid) return message.reply("non");
        message.delete();
        exec(`${args.join(" ")}`, (error, stdout) => {
            const response = error || stdout;
            message.channel.send(`Executé: ${args.join(" ")}\n${response}`, {
                code: "asciidoc",
                plit: "\n",
            })
            .catch(console.error);
        });
    }
} 
