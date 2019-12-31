const request = require ('request-promise-native');
module.exports.run = async (bot, message, args, con) => {
  try {
    message.channel.startTyping ();
    let string;
    if (args.length < 1) {
      string = message.author.tag;
    } else {
      string = args.join (' ');
    }
    const options = {
      url: `https://robohash.org/${encodeURIComponent (string)}`,
      encoding: null,
    };
    const response = await request (options);
    message.channel
      .send ({
        files: [
          {
            attachment: response,
          },
        ],
      })
      .catch (e => {
        throw e;
      });
    message.channel.stopTyping ();
  } catch (e) {
    if (e.reponse) {
      return bot.emit (
        'error',
        e.response.statusCode,
        e.response.statusMessage,
        message.channel
      );
    }
    console.log (e);
  }
};
module.exports.help = {
  name: 'robot',
  catégorie: 'Images',
  helpcaté: 'images',
};
