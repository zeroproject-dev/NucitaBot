import { Client, ClientOptions, Collection } from 'discord.js';
import { readdir } from 'fs/promises';
import { ICommand } from '../Interfaces/ICommand';
import { IEvent } from '../Interfaces/IEvent';
import { VoiceConnection } from '@discordjs/voice';
import path from 'path';

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
		console.log(process.env.COMMAND_PREFIX);
		console.log(process.env.VOICE_FEMALE_PREFIX);
		console.log(process.env.VOICE_MALE_PREFIX);
	}

	async importFile(filePath: string) {
		return (await import(filePath))?.default;
	}

	async getFilesList(folder: string): Promise<string[]> {
		let files = await readdir(folder);

		if (!folder.endsWith('/')) folder += '/';

		let result = files.map((file) => path.join(folder, file));

		return result;
	}

	async registerModules() {
		// Commands
		const commandFiles = await this.getFilesList(`${__dirname}/../commands/`);

		console.log('\n[NucitaBot] Registering commands...');

		commandFiles.forEach(async (filePath: string) => {
			const command: ICommand = await this.importFile(filePath);

			if (!command?.name) return;
			this.commands.set(command.name, command);
			console.log(`Command ${command.name} loaded!`);

			if (command?.aliases.length !== 0) {
				command.aliases.forEach((alias) => {
					this.aliases.set(alias, command);
				});
			}
		});

		// Events
		const eventFiles = await this.getFilesList(`${__dirname}/../events`);

		console.log('\n[NucitaBot] Registering events...');

		eventFiles.forEach(async (filePath: string) => {
			const event: IEvent = await this.importFile(filePath);
			this.events.set(event.name, event);

			console.log(`Event ${event.name} loaded!`);

			this.on(event.name, event.run.bind(null, this));
		});
	}
}
