const util = require('util');

const Command = require('../../structures/Command');

module.exports = class EvalCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'eval',
            usage: 'eval <code>',
            description: 'Executing code.',
            type: 'owner',
            ownerOnly: true
        })
    }

    async run(message, args) {
        try {
            const returned = eval(args.join(" "));
            let str = util.inspect(returned, {
                depth: 1
            })
            if (str.length > 1900) {
                str = `${str.substr(0, 1897)}...`
            }
            if (str.includes(this.bot.config.token)) {
                str = str.replace(this.bot.config.token, "( ͡° ͜ʖ ͡°)");
            }
            message.channel.send('```xl\n' + str + '\n```').then(ms => {
                if (returned != undefined && returned !== null && typeof returned.then === 'function') {
                    returned.then(() => {
                        str = util.inspect(returned, {
                            depth: 1
                        })
                        if (str.length > 1900) {
                            str = str.substr(0, 1897)
                            str = str + '...';
                        }
                        ms.edit('```xl\n' + str + '\n```')
                    }, e => {
                        str = util.inspect(e, {
                            depth: 1
                        })
                        if (str.length > 1900) {
                            str = str.substr(0, 1897)
                            str = str + '...';
                        }
                        ms.edit('```xl\n' + str + '\n```')
                    })
                }
            }).catch(() => {})
        } catch (e) {
            message.channel.send('```xl\n' + e + '\n```').catch(() => {})
        }
    }
}