module.exports = class Command {
	constructor(bot, options) {
		this.validateOptions(bot, options);

		this.bot = bot;

		this.name = options.name;
		this.aliases = options.aliases | null;
		this.usage = options.usage || options.name;
		this.description = options.description || '';
		this.type = options.type || bot.types.MISC;
		this.clientPermissions = options.clientPermissions || ['SEND_MESSAGES', 'EMBED_LINKS'];
		this.userPermissions = options.userPermissions || null;
		this.examples = options.examples || null;
		this.ownerOnly = options.ownerOnly || false;
		this.disabled = options.disabled || false;
		this.errorTypes = ['Invalid Argument', 'Command Failure'];
	}

	run(message, args) {
		throw new Error(`The ${this.name} command has no run() method`);
	}

	validateOptions(bot, options) {
		if (!bot) throw new Error('No DiscordClient found.');
		if (typeof options !== 'object') throw new TypeError('CommandOptions is not an Object.');

		if (typeof options.name !== 'string') throw new TypeError('CommandName is not a String');
	if (options.name !== options.name.toLowerCase()) throw new Error('CommandName is not lowercase');
	
	if (options.aliases) {
		if (!Array.isArray(options.aliases) || options.aliases.some(ali => typeof ali !== 'string'))
		  throw new TypeError('CommandAlias is not an Array of Strings');
  
		if (options.aliases.some(ali => ali !== ali.toLowerCase()))
		  throw new RangeError('CommandAliases are not lowercase');
  
		for (const alias of options.aliases) {
		  if (bot.aliases.get(alias)) throw new Error('CommandAlias already exists');
		}
	  }

	  if (options.usage && typeof options.usage !== 'string') throw new TypeError('CommandUsage is not a String');

    if (options.description && typeof options.description !== 'string') 
      throw new TypeError('CommandDescription is not a String');
    
    if (options.type && typeof options.type !== 'string') throw new TypeError('CommandType is not a String');
    if (options.type && !Object.values(bot.types).includes(options.type))
      throw new Error('CommandType is not valid');
    
    if (options.clientPermissions) {
      if (!Array.isArray(options.clientPermissions))
        throw new TypeError('Command clientPermissions is not an Array of permission key strings');
      
      for (const perm of options.clientPermissions) {
        if (!permissions[perm]) throw new RangeError(`Invalid command clientPermission: ${perm}`);
      }
    }

    if (options.userPermissions) {
      if (!Array.isArray(options.userPermissions))
        throw new TypeError('Command userPermissions is not an Array of permission key strings');

      for (const perm of options.userPermissions) {
        if (!permissions[perm]) throw new RangeError(`Invalid command userPermission: ${perm}`);
      }
    }

	if (options.examples && !Array.isArray(options.examples))
      throw new TypeError('Command examples is not an Array of permission key strings');

    if (options.ownerOnly && typeof options.ownerOnly !== 'boolean') 
      throw new TypeError('Command ownerOnly is not a boolean');

    if (options.disabled && typeof options.disabled !== 'boolean') 
      throw new TypeError('Command disabled is not a boolean');
	}
}