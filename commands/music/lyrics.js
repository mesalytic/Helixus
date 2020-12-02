const {
    MessageEmbed
} = require("discord.js");

const axios = require('axios');
const htmlparser = require("node-html-parser");

const Command = require("../../structures/Command");

module.exports = class LyricsCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'lyrics',
            description: 'Displays the lyrics about specified song.',
            usage: 'lyrics <song>',
            examples: ["lyrics blinding lights", "lyrics blinding lights the weeknd"],
            type: 'music'
        });
    }

    async run(message, args) {

        let search = args.join(" ");

        try {
            axios.get(`https://genius.com/api/search/multi?q=${encodeURIComponent(search).replace(/%20/g, "+")}`, {
                headers: {
                    'referer': 'https://genius.com/search/embed',
                    'x-requested-with': 'XMLHttpRequest'
                }
            }).then(async resp => {
                let lyric = await lyrics(resp.data.response.sections[0].hits[0].result.url)

                let embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(`Lyrics for ${resp.data.response.sections[0].hits[0].result.full_title}`)
                    .setDescription(lyric)
                    .setTimestamp();

                if (embed.description.length >= 2048) embed.description = `${embed.description.substr(0, 2045)}...`;
                return message.channel.send(embed);
            })
        } catch {
            message.reply(`❌ - No lyrics found for **${search}**`)
        }

        async function lyrics(url) {

            return new Promise((resolve, reject) => {
                if (!url) reject('No Track URL');
                axios.get(url)
                    .then(async res => {
                        const DOM = htmlparser.parse(res.data);
                        const lyricsDiv = DOM.querySelector(".lyrics");
                        if (!lyricsDiv || !lyricsDiv.text) reject("No result was found");

                        let lyrics = String(lyricsDiv.text.trim());
                        if (!lyrics) reject("No result was found");

                        resolve(lyrics);
                    })
                    .catch(e => {
                        if (e && e.response && e.response.status && e.response.status == 401) reject("Invalid Genius Token");
                        reject(e);
                    });
            });
        }
    }
}