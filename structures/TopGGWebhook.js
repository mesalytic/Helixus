const { WebhookClient } = require('discord.js');

const initWebhook = async(bot) => {

    const { Webhook } = require('@top-gg/sdk');
    const express = require('express');
    const config = require('../config.json')

    const app = express();
    const webhook = new Webhook(config.topggWebhook);

    app.post('/dblwebhook', webhook.middleware(), (req, res) => {
        bot.db.query(`SELECT * FROM Economy WHERE userID='${req.vote.user}'`, (err, rows) => {
            bot.db.query(`SELECT * FROM userPremiums WHERE premiumHolder='${req.vote.user}'`, (err, premiums) => {
                let wb = new WebhookClient(config.webhook.topGG.id, config.webhook.topGG.password)
                let user = bot.users.cache.get(req.vote.user);
    
                wb.send(`__**${user.tag}**__ (\`${user.id}\`) has voted for Helixus, thank you!`)
                if (premiums[0] && premiums[0].activated === "true") user.send(`Thank you for voting for **Helixus**. You have been rewarded __**675 coins**__ *(x1.5 premium)*, come back in 12 hours!`)
                else user.send(`Thank you for voting for **Helixus**. You have been rewarded __**450 coins**__, come back in 12 hours!`)
        
                if (err) throw err;
                if (!rows[0]) bot.db.query(`INSERT INTO Economy (userID, balance, voteCooldown, monthlyVotes) VALUES ('${req.vote.user}', '450', '${Date.now()}', '1')`)
                else {
                    if (premiums[0] && premiums[0].activated === "true") bot.db.query(`UPDATE Economy SET balance='${Number(rows[0].balance) + 675}', voteCooldown='${Date.now()}', monthlyVotes='${Number(rows[0].monthlyVotes) + 1}' WHERE userID='${req.vote.user}'`);
                    else bot.db.query(`UPDATE Economy SET balance='${Number(rows[0].balance) + 450}', voteCooldown='${Date.now()}', monthlyVotes='${Number(rows[0].monthlyVotes) + 1}' WHERE userID='${req.vote.user}'`);
                }
            })   
        })
    });

    app.listen(25569);
}

module.exports.initWebhook = initWebhook;