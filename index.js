const Helixus = require('./structures/Client');
const config = require('./config.json');

const bot = new Helixus(config);

bot.launch();