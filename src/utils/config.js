require('dotenv').config();

config = {
	DISCORD_TOKEN: process.env.DISCORD_TOKEN,
	COMMAND_PREFIX: process.env.COMMAND_PREFIX,
	VOICE_FEMALE_PREFIX: process.env.VOICE_FEMALE_PREFIX,
	VOICE_MALE_PREFIX: process.env.VOICE_MALE_PREFIX,
	AZURE_API_KEY_TTS: process.env.AZURE_API_KEY_TTS,
	AZURE_REGION_TTS: process.env.AZURE_REGION_TTS,
};

module.exports = config;
