module.exports.run = async (bot, message, args, con) => {
  const rand = require("../util/random.js");
  const fetch = require("node-fetch");
  const banned_tags = [
    "child",
    "childs",
    "childporn",
    "children",
    "youngs",
    "young",
    "loli",
    "shota",
    "cub",
  ];
  var url = "https://yande.re/post.json?limit=100&tags=";
  if (!args) {
    url = "https://yande.re/post.json?limit=100";
  } else {
    for (var i = 0; i < args.length; i++) {
      if (banned_tags.indexOf(args[i].toLowerCase()) > -1) {
        return message.reply(bot.lang.nsfw.yandere.banned);
      }
    }
    url += args.join("+");
  }
  fetch(url)
    .then(res => res.json())
    .then(json => {
      if (json.length > 0) {
        var post = json[rand(0, json.length - 1)];
        message.channel.send(
          `${bot.lang.nsfw.yandere.real_size} <${post.file_url}>`,
          {
            files: [post.preview_url],
          },
        );
      } else {
        return message.channel.send(bot.lang.nsfw.yandere.noresults);
      }
    });
};
module.exports.help = {
  name: "yandere",
  catégorie: "NSFW",
  helpcaté: "nsfw",
};
