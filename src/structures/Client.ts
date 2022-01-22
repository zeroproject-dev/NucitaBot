import { RegisterCommandsOptions } from '../typings/Client';
import {
	Client,
	Collection,
	ClientEvents,
	Intents,
	ApplicationCommandDataResolvable,
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
			console.log(`Registering ${commands.length} global commands`);
		}
	}

	async registerModules() {
		// Commands
		const slashCommands: ApplicationCommandDataResolvable[] = [];
		const commandFiles = await globPromise(
			`${__dirname}/../commands/*{.ts,.js}`
		);
		commandFiles.forEach(async (filePath: string) => {
			const command: CommandType = await this.importFile(filePath);
			if (!command.name) return;

			this.commands.set(command.name, command);
			slashCommands.push(command);
		});

		// this.on('ready', () => {
		this.registerCommands({
			commands: slashCommands,
			// guildId: process.env.DISCORD_GUILDID,
		});
		// });

		// Events
		const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);

		eventFiles.forEach(async (filePath: string) => {
			const event: Event<keyof ClientEvents> = await this.importFile(filePath);
			this.on(event.event, event.run);
		});
	}
}
