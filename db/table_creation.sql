CREATE TABLE IF NOT EXISTS `afk` (
  `userID` varchar(36) DEFAULT NULL,
  `reason` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `autorole` (
  `roleID` varchar(50) DEFAULT NULL,
  `guildID` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `backgrounds` (
  `userID` varchar(50) DEFAULT NULL,
  `activeBg` varchar(3000) DEFAULT NULL,
  `Alive` varchar(10) DEFAULT 'false',
  `Amin` varchar(10) DEFAULT 'false',
  `Argon` varchar(10) DEFAULT 'false',
  `Bighead` varchar(10) DEFAULT 'false',
  `By Design` varchar(10) DEFAULT 'false',
  `Cool Blues` varchar(10) DEFAULT 'false',
  `Cosmic Fusion` varchar(10) DEFAULT 'false',
  `Dark Ocean` varchar(10) DEFAULT 'false',
  `Evening Sunshine` varchar(10) DEFAULT 'false',
  `Flare` varchar(10) DEFAULT 'false',
  `Grade Grey` varchar(10) DEFAULT 'false',
  `Harvey` varchar(10) DEFAULT 'false',
  `JShine` varchar(10) DEFAULT 'false',
  `Kye Meh` varchar(10) DEFAULT 'false',
  `Kyoo Pal` varchar(10) DEFAULT 'false',
  `Magic` varchar(10) DEFAULT 'false',
  `MegaTron` varchar(10) DEFAULT 'false',
  `Memariani` varchar(10) DEFAULT 'false',
  `Moonlit Asteroid` varchar(10) DEFAULT 'true',
  `Neuromancer` varchar(10) DEFAULT 'false',
  `Pink Flavour` varchar(10) DEFAULT 'false',
  `Pure Lust` varchar(10) DEFAULT 'false',
  `Rastafari` varchar(10) DEFAULT 'false',
  `Sin City Red` varchar(10) DEFAULT 'false',
  `Ultra Voilet` varchar(10) DEFAULT 'false',
  `Wedding Day Blues` varchar(10) DEFAULT 'false',
  `Wiretap` varchar(10) DEFAULT 'false',
  `Witching Hour` varchar(10) DEFAULT 'false',
  `Yoda` varchar(10) DEFAULT 'false'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `cooldowns` (
  `userID` varchar(50) DEFAULT NULL,
  `active` varchar(5) DEFAULT NULL,
  `guildID` varchar(50) DEFAULT NULL,
  `type` varchar(50) DEFAULT 'level'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `economy` (
  `userID` varchar(50) DEFAULT NULL,
  `balance` int(11) DEFAULT 0,
  `dailyCooldown` varchar(100) DEFAULT NULL,
  `begCooldown` varchar(100) DEFAULT NULL,
  `weeklyCooldown` varchar(100) DEFAULT NULL,
  `workCooldown` varchar(100) DEFAULT NULL,
  `voteCooldown` varchar(100) DEFAULT NULL,
  `junkFish` int(11) DEFAULT 0,
  `commonFish` int(11) DEFAULT 0,
  `uncommonFish` int(11) DEFAULT 0,
  `rareFish` int(11) DEFAULT 0,
  `monthlyVotes` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `ignorechannels` (
  `guildID` varchar(50) DEFAULT NULL,
  `channelID` varchar(50) DEFAULT NULL,
  `ignored` varchar(5) DEFAULT 'true'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `joinmessages` (
  `guildID` varchar(50) DEFAULT NULL,
  `channelID` varchar(50) DEFAULT NULL,
  `joinmsg` varchar(2000) DEFAULT NULL,
  `activated` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `langs` (
  `guildID` varchar(50) DEFAULT NULL,
  `lang` varchar(5) DEFAULT 'en'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `leavemessages` (
  `guildID` varchar(50) DEFAULT NULL,
  `channelID` varchar(50) DEFAULT NULL,
  `leavemsg` varchar(2000) DEFAULT NULL,
  `activated` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `levels` (
  `user` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guild` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `points` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `levelsconfig` (
  `activated` varchar(5) DEFAULT NULL,
  `guildID` varchar(50) DEFAULT NULL,
  `lvlupChannelID` varchar(50) DEFAULT NULL,
  `lvlupMessage` varchar(1700) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `levelsrewards` (
  `guildID` varchar(50) DEFAULT NULL,
  `roleID` varchar(50) DEFAULT NULL,
  `level` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `logs` (
  `guildID` varchar(50) DEFAULT NULL,
  `channelID` varchar(50) DEFAULT NULL,
  `activated` varchar(5) DEFAULT 'true',
  `channelcreate` varchar(5) DEFAULT 'true',
  `channeldelete` varchar(5) DEFAULT 'true',
  `channelupdate` varchar(5) DEFAULT 'true',
  `emojicreate` varchar(5) DEFAULT 'true',
  `emojidelete` varchar(5) DEFAULT 'true',
  `emojiupdate` varchar(5) DEFAULT 'true',
  `guildbanadd` varchar(5) DEFAULT 'true',
  `guildbanremove` varchar(5) DEFAULT 'true',
  `guildmemberupdate` varchar(5) DEFAULT 'true',
  `guildmemberadd` varchar(5) DEFAULT 'true',
  `guildmemberremove` varchar(5) DEFAULT 'true',
  `messagedelete` varchar(5) DEFAULT 'true',
  `messagedeletebulk` varchar(5) DEFAULT 'true',
  `messageupdate` varchar(5) DEFAULT 'true',
  `rolecreate` varchar(5) DEFAULT 'true',
  `roledelete` varchar(5) DEFAULT 'true',
  `roleupdate` varchar(5) DEFAULT 'true',
  `voicestateupdate` varchar(5) DEFAULT 'true',
  `webhookID` varchar(150) DEFAULT NULL,
  `webhookToken` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `logsignore` (
  `guildID` varchar(50) DEFAULT NULL,
  `channelID` varchar(50) DEFAULT NULL,
  `ignored` varchar(5) DEFAULT 'true'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `muteconfig` (
  `guildID` varchar(50) DEFAULT NULL,
  `muteRoleID` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `muteroles` (
  `roleID` varchar(50) DEFAULT NULL,
  `mutedID` varchar(50) DEFAULT NULL,
  `guildID` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `prefixes` (
  `guildID` varchar(50) DEFAULT NULL,
  `prefix` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `reactionrole` (
  `guildID` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `channelID` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `messageID` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roleID` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emojiID` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `reminders` (
  `userID` varchar(50) DEFAULT NULL,
  `reason` varchar(500) DEFAULT NULL,
  `timestamp` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `warnconfig` (
  `guildID` varchar(50) DEFAULT NULL,
  `kicks` int(11) DEFAULT NULL,
  `bans` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `warns` (
  `guildID` varchar(50) DEFAULT '',
  `memberID` varchar(50) DEFAULT '',
  `reason` varchar(2000) DEFAULT '',
  `date` bigint(20) DEFAULT NULL,
  `moderatorID` varchar(50) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;