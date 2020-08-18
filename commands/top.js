'use strict'

const { ReactionCollector, MessageEmbed, Util } = require("discord.js")
const { query } = require("express")

module.exports.run = async (bot, message, args, con) => {

  con.query(`SELECT * FROM Levels WHERE guild='${message.guild.id}'`, async (err, rows) => {
    let count
    if (err) throw err
    count = rows.length


    let page = 0
    const pages = Math.ceil(Number(Number(count) / 10)) - 1
    let m = await message.channel.send(bot.lang.levels.top.please_wait)

    m.react('⏮️').then(() => {
      m.react('⬅️').then(() => {
        m.react('➡️').then(() => {
          m.react('⏭️').then(() => {
            m.react('❌').then(async () => {
              await gen(page)

              const filter = (reaction, user) => ['⏮️', '⬅️', '➡️', '⏭️', '❌'].includes(reaction.emoji.name) && user.id === message.author.id
              const reactionCollector = new ReactionCollector(m, filter, { time: 600000 })

              reactionCollector.on('collect', async reaction => {
                switch (reaction.emoji.name) {
                  case '⏮️':
                    page = 0
                    await gen(page)
                    break
                  case '⬅️':
                    page = page - 1
                    if (page < 0) return page = 0
                    else await gen(page)
                    break
                  case '➡️':
                    page = page + 1
                    if (page > pages) return
                    await gen(page)
                    break
                  case '⏭️':
                    page = pages
                    await gen(page)
                    break
                  case '❌':
                    reactionCollector.stop()
                }
              })
              reactionCollector.on('end', () => {
                m.edit(bot.lang.levels.top.closed, { embed: null })
              })
            })
          })
        })
      })
    })

    async function gen(page) {
      con.query(`SELECT * FROM Levels WHERE guild = '${message.guild.id}' ORDER BY level DESC, points DESC LIMIT ${page * 10},10`, async (err, rows) => {
        var output = ""
        for (let i = 0; i < rows.length; i++) {
          const u = message.guild.members.resolve(rows[i].user)

          let currentRank = rows.indexOf(rows[i]) + 1 + page * 10
          let diff = 5 * (rows[i].level ^ 2) + 50 * rows[i].level + 100

          if (u) output += `[${(i + 1) + (page * 10)}] **${Util.escapeMarkdown(u.user.tag)}** - Level ${rows[i].level} | (${rows[i].points}/${diff} XP)\n`
          else output += `[${(i + 1) + (page * 10)}] **????** - Level ${rows[i].level} | (${rows[i].points}/${diff} XP)\n`
        }

        const embed = new MessageEmbed()
          .setColor("RANDOM")
          .setAuthor(`${message.guild.name} - ${bot.lang.levels.top.embed_title}`, message.guild.iconURL())
          .setTitle(`Page ${page + 1}/${pages + 1}`)
          .setDescription(output)
          .setFooter(bot.lang.levels.top.embed_footer)
        await m.edit("", { embed: embed })
      })
    }
  })
}

module.exports.help = {
  name: 'top',
  aliases: ["leaderboard"],
  catégorie: 'Levels',
  helpcaté: 'levels'
}
