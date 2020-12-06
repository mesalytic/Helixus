const {
    Client,
    Collection
} = require("discord.js");
const {
    readdirSync,
    readdir
} = require("fs");
const {
    resolve,
    join
} = require("path");
const mysql = require('mysql');

module.exports = class Bot extends Client {
    constructor(config, options = {}) {
        super(options);

        this.db = mysql.createConnection({
            host: config.database.host,
            user: "root",
            password: config.database.password,
            database: "HelixusV2",
        });
        this.db.connect((err) => {
            if (err) throw err;
            this.logger.log("info", "Connected to database");
        });

        this.logger = require('./Logger');

        this.commands = new Collection();
        this.aliases = new Collection();

        this.queue = new Map();

        this.config = require('../config.json');
        this.token = this.config.token;



        this.types = {
            ADMINISTRATION: 'administration',
            ECONOMY: 'economy',
            GENERAL: 'general',
            INFO: 'info',
            LEVELS: 'levels',
            MUSIC: 'music',
            OWNER: 'owner'
        };
    }

    loadCommands(path) {
        readdirSync(path).filter(f => !f.endsWith('.js')).forEach(dir => {
            const commands = readdirSync(resolve(__basedir, join(path, dir))).filter(f => f.endsWith('js'));
            commands.forEach(f => {
                const Command = require(resolve(__basedir, join(path, dir, f)));
                const command = new Command(this);
                if (command.name && !command.disabled) {
                    this.commands.set(command.name, command);
                    this.logger.info(`Loading command: ${command.name}`)

                    let aliases = '';
                    if (command.aliases) {
                        command.aliases.forEach(alias => {
                            this.aliases.set(alias, command);
                        });
                        aliases = command.aliases.join(', ');
                    };
                }
            })
        })
    }

    loadEvents(path) {
        readdir(path, (err, files) => {
            if (err) this.logger.error(err);
            files = files.filter(f => f.split('.').pop() === "js");
            if (files.length <= 0) return this.logger.warn("No events found!");
            this.logger.info(`${files.length} events found.`);
            files.forEach(f => {
                const eventName = f.substring(0, f.indexOf('.'));
                const event = require(resolve(__basedir, join(path, f)));
                super.on(eventName, event.bind(null, this));
                delete require.cache[require.resolve(resolve(__basedir, join(path, f)))];
                this.logger.info(`Loading event: ${eventName}`)
            })
        })
        return this;
    }
}