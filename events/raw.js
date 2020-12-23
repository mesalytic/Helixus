const {
    base64
} = require("../structures/Utils");

module.exports = async (bot, event) => {

    if (event.t === "MESSAGE_REACTION_ADD") {
        if (event.d.guild_id) {
            if (event.d.emoji.id !== null) {
                let guild = bot.guilds.cache.get(event.d.guild_id);
                let member = guild.members.cache.get(event.d.user_id);
                if (member.user.bot) return;

                bot.db.query(`SELECT * FROM ReactionRole WHERE guildID='${event.d.guild_id}' AND channelID='${event.d.channel_id}' AND emojiID='${event.d.emoji.id}'`, (err, rows) => {
                    if (rows[0]) {
                        let role = guild.roles.cache.get(rows[0].roleID);
                        member.roles.add(role);
                    }
                })
            } else {
                let emoji = base64(event.d.emoji.name, "encode");
                let guild = bot.guilds.cache.get(event.d.guild_id);
                let member = guild.members.cache.get(event.d.user_id);
                if (member.user.bot) return;

                bot.db.query(`SELECT * FROM ReactionRole WHERE guildID='${event.d.guild_id}' AND channelID='${event.d.channel_id}' AND emojiID='${emoji}'`, (err, rows) => {
                    if (rows[0]) {
                        let role = guild.roles.cache.get(rows[0].roleID);
                        member.roles.add(role);
                    }
                })
            }
        }
    } else if (event.t === "MESSAGE_REACTION_REMOVE") {
        if (event.d.guild_id) {
            if (event.d.emoji.id !== null) {
                let guild = bot.guilds.cache.get(event.d.guild_id);
                let member = guild.members.cache.get(event.d.user_id);
                if (member.user.bot) return;
                bot.db.query(`SELECT * FROM ReactionRole WHERE guildID='${event.d.guild_id}' AND channelID='${event.d.channel_id}' AND emojiID='${event.d.emoji.id}'`, (err, rows) => {
                    if (rows[0]) {
                        let role = guild.roles.cache.get(rows[0].roleID);
                        member.roles.remove(role);
                    }
                })
            } else {
                let emoji = base64(event.d.emoji.name, "encode");
                let guild = bot.guilds.cache.get(event.d.guild_id);
                let member = guild.members.cache.get(event.d.user_id);
                if (member.user.bot) return;

                bot.db.query(`SELECT * FROM ReactionRole WHERE guildID='${event.d.guild_id}' AND channelID='${event.d.channel_id}' AND emojiID='${emoji}'`, (err, rows) => {
                    if (rows[0]) {
                        let role = guild.roles.cache.get(rows[0].roleID);
                        member.roles.remove(role);
                    }
                })
            }
        }
    }
}