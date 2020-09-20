const config = require('./config.json');
const Client = require('./structures/Client');

global.__basedir = __dirname;

const bot = new Client(config);

function init() {
    bot.loadEvents('./events');
    bot.loadCommands('./commands');
    bot.login(bot.token);
}

init();

process.on('unhandledRejection', err => bot.logger.error(err));