const {ShardingManager} = require ('discord.js');
const config = require ('./config.json');

const Manager = new ShardingManager ('./index.js', {
  totalShards: 2,
  token: config.token,
  shardArgs: ['--trace-warnings'],
});
Manager.spawn ();
