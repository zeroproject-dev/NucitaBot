import { RegisterCommandsOptions } from '../typings/Client';
import {
	ApplicationCommandData,
	Client,
	Collection,
	ClientEvents,
	Intents,
} from 'discord.js';
import { CommandType } from '../typings/Command';
import { glob } from 'glob';
import { promisify } from 'util';
import { Event } from './Event';

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
	commands: Collection<string, CommandType> = new Collection();

	constructor() {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_VOICE_STATES,
			],
		});
	}

	start() {
		this.registerModules();
		console.log(process.env.DISCORD_TOKEN);
		this.login(process.env.DISCORD_TOKEN);
	}

	async importFile(filePath: string) {
		return (await import(filePath))?.default;
	}

	async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
		if (guildId) {
			this.guilds.cache.get(guildId)?.commands.set(commands);
			console.log(
				`Registered ${commands.length} commands for guild ${guildId}`
			);
		} else {
			this.application?.commands.set(commands);
			console.log('Registering global commands');
		}
	}

	async registerModules() {
		// Commands
		const slashCommands: ApplicationCommandData[] = [];
		const commandFiles = await globPromise(
			`${__dirname}/../commands/*{.ts,.js}`
		);
		commandFiles.forEach(async (filePath: string) => {
			const command: CommandType = await this.importFile(filePath);
			if (!command.name) return;
			console.log(command);
			this.commands.set(command.name, command);
			slashCommands.push(command);
		});

		// Events
		const eventFiles = await globPromise(`${__dirname}/../commands/*{.ts,.js}`);

		eventFiles.forEach(async (filePath: string) => {
			const event: Event<keyof ClientEvents> = await this.importFile(filePath);
			this.on(event.event, event.run);
		});
	}
}
