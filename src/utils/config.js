require('dotenv').config();

exports.default = {
	token: process.env.DISCORD_TOKEN,
	prefix: process.env.COMMAND_PREFIX,
};
