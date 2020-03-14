CREATE TABLE IF NOT EXISTS `Afk` (
  `userID` varchar(36) DEFAULT NULL,
  `reason` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `Autorole` (
  `roleID` varchar(50) DEFAULT NULL,
  `guildID` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Cases` (
  `guildID` varchar(50) DEFAULT NULL,
  `caseN` int(11) unsigned DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Cooldowns` (
  `userID` varchar(50) DEFAULT NULL,
  `active` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `IgnoreChannels` (
  `guildID` varchar(50) DEFAULT NULL,
  `channelID` varchar(50) DEFAULT NULL,
  `ignored` varchar(5) DEFAULT 'true'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `JoinMessages` (
  `guildID` varchar(50) DEFAULT NULL,
  `channelID` varchar(50) DEFAULT NULL,
  `joinmsg` varchar(2000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Langs` (
  `guildID` varchar(50) DEFAULT NULL,
  `lang` varchar(5) DEFAULT 'en'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `LeaveMessages` (
  `guildID` varchar(50) DEFAULT NULL,
  `channelID` varchar(50) DEFAULT NULL,
  `leavemsg` varchar(2000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Levels` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guild` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `points` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `LevelsConfig` (
  `activated` varchar(5) DEFAULT NULL,
  `guildID` varchar(50) DEFAULT NULL,
  `lvlupChannelID` varchar(50) DEFAULT NULL,
  `lvlupMessage` varchar(1700) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `LevelsRewards` (
  `guildID` varchar(50) DEFAULT NULL,
  `roleID` varchar(50) DEFAULT NULL,
  `level` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `LockdownChannels` (
  `channelID` varchar(50) DEFAULT NULL,
  `time` varchar(50) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Logs` (
  `guildID` varchar(50) DEFAULT NULL,
  `channelID` varchar(50) DEFAULT NULL,
  `activated` varchar(5) DEFAULT 'true',
  `channelcreate` varchar(5) DEFAULT 'true',
  `channeldelete` varchar(5) DEFAULT 'true',
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
  `voicestateupdate` varchar(5) DEFAULT 'true'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `LogsIgnore` (
  `guildID` varchar(50) DEFAULT NULL,
  `channelID` varchar(50) DEFAULT NULL,
  `ignored` varchar(5) DEFAULT 'true'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `ModlogsChannel` (
  `guildID` varchar(50) DEFAULT NULL,
  `channelID` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `MuteRoles` (
  `roleID` varchar(50) DEFAULT NULL,
  `mutedID` varchar(50) DEFAULT NULL,
  `guildID` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Prefixes` (
  `guildID` varchar(50) DEFAULT NULL,
  `prefix` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `WarnConfig` (
  `guildID` varchar(50) DEFAULT NULL,
  `kicks` int(11) DEFAULT NULL,
  `bans` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Warns` (
  `number` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `guildID` varchar(50) DEFAULT '',
  `memberID` varchar(50) DEFAULT '',
  `reason` varchar(2000) DEFAULT '',
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`number`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
