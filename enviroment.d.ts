declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DISCORD_TOKEN: string;
			COMMAND_PREFIX: string;
			VOICE_FEMALE_PREFIX: string;
			VOICE_MALE_PREFIX: string;
			AZURE_API_KEY_TTS: string;
			AZURE_REGION_TTS: string;
			DISCORD_GUILDID: string;
			ENVIROMENT: 'dev' | 'prod' | 'debug';
		}
	}
}

export {};
