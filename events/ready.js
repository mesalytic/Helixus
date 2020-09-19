const Event = require('../structures/Event');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            once: true
        });
    }

    run() {
        console.log([
			`Logged in as ${this.bot.user.tag} [Shard ${this.bot.shard.ids[0]}]`,
			`Loaded ${this.bot.commands.size} commands!`,
			`Loaded ${this.bot.events.size} events!`
        ].join('\n'));

        this.bot.user.setActivity(`am!help`, { type: 'WATCHING' });
    }
}