import { Client, ClientOptions, Collection } from 'discord.js';
import { glob } from 'glob';
import { promisify } from 'util';
import { ICommand } from '../Interfaces/ICommand';
import { IEvent } from '../Interfaces/IEvent';
import { VoiceConnection } from '@discordjs/voice';

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
	commands: Collection<string, ICommand> = new Collection();
	events: Collection<string, IEvent> = new Collection();
	aliases: Collection<string, ICommand> = new Collection();
	voiceConnection: VoiceConnection;

	constructor(options: ClientOptions) {
		super(options);
	}

	async start() {
		this.registerModules();
		this.login(process.env.DISCORD_TOKEN);
	}

	async importFile(filePath: string) {
		return (await import(filePath))?.default;
	}

	async registerModules() {
		// Commands
		const commandFiles = await globPromise(
			`${__dirname}/../commands/*{.ts,.js}`
		);
		commandFiles.forEach(async (filePath: string) => {
			const command: ICommand = await this.importFile(filePath);

			if (!command?.name) return;
			this.commands.set(command.name, command);

			if (command?.aliases.length !== 0) {
				command.aliases.forEach((alias) => {
					this.aliases.set(alias, command);
				});
			}
		});

		// Events
		const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);

		eventFiles.forEach(async (filePath: string) => {
			const event: IEvent = await this.importFile(filePath);
			this.events.set(event.name, event);

			this.on(event.name, event.run.bind(null, this));
		});
	}
}
