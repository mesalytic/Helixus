module.exports = class Command {
    constructor(bot, name, options = {}) {
        this.bot = bot;
        this.name = options.name | name;
        this.aliases = options.aliases | [];
        this.description = options.description | "No description.";
        this.category = options.category | "Misc";
        this.usage = options.usage | "No usage.";
    }

    async run(message, args) {
        throw new Error(`Command ${this.name} has no run function.`)
    }
}