const config = require('./config.json');
const Client = require('./structures/Client');
const { initWebhook } = require('./structures/TopGGWebhook');


global.__basedir = __dirname;

const bot = new Client(config);

function init() {
    bot.loadEvents('./events');
    bot.loadCommands('./commands');
    bot.login(bot.token);
}

module.exports = bot;
initWebhook(bot);

init();
process.on('unhandledRejection', err => bot.logger.error(err));