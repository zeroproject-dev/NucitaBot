import { ApplicationCommandData } from 'discord.js';
export interface RegisterCommandsOptions {
	guildId?: string;
	commands: ApplicationCommandData[];
}
