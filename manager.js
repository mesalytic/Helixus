const { ShardingManager } = require("discord.js");
const config = require("./config.json");

const Manager = new ShardingManager("./index.js", {
  totalShards: 2,
  token: config.token,
  shardArgs: ["dev", "--trace-warnings"], // remove "dev" for public version, but if present it must be first shardArg
});
Manager.spawn();
