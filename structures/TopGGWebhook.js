const { WebhookClient } = require('discord.js');

const initWebhook = async(bot) => {

    const { Webhook } = require('@top-gg/sdk');
    const express = require('express');
    const config = require('../config.json')

    const app = express();
    const webhook = new Webhook(config.topggWebhook);

    app.post('/dblwebhook', webhook.middleware(), (req, res) => {
        let wb = new WebhookClient(config.webhook.topGG.id, config.webhook.topGG.password)
        let user = bot.users.cache.get(req.vote.user);


        wb.send(`__**${user.tag}**__ (\`${user.id}\`) has voted for Helixus, thank you!`)
        user.send(`Thank you for voting for **Helixus**. You have been rewarded __**450 coins**__, come back in 12 hours!`);

        bot.db.query(`SELECT * FROM Economy WHERE userID='${req.vote.user}'`, (err, rows) => {
            if (!rows[0]) bot.db.query(`INSERT INTO Economy (userID, balance, voteCooldown) VALUES ('${req.vote.user}', '450', '${Date.now()}')`)
            else bot.db.query(`UPDATE Economy SET balance='${Number(rows[0].balance) + 450}', voteCooldown='${Date.now()}' WHERE userID='${req.vote.user}'`)
        })
    });

    app.listen(25569);
}

module.exports.initWebhook = initWebhook;