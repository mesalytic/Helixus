const { Client, Collection } = require('discord.js');
const Utils = require('../util/Util')
const Loader = require('../structures/Loader')

module.exports = class Helixus extends Client {
    constructor(options = {}) {
        super({
            disableMentions: 'everyone' // probably not for the future
        });
        this.validate(options);
        
        this.commands = new Collection();
        this.aliases = new Collection();
        this.events = new Collection();
        this.loaders = new Loader(this);
        // this.utils = new Util(this);
    }

    validate(options) {
        if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

        if (!options.token) throw new Error('No token has been provided.');
        this.token = options.token;
    }

    async launch(token = this.token) {
        this.loaders.loadCommands();
        this.loaders.loadEvents();
        super.login(token);
    }
}