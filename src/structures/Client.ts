import { Client, ClientOptions, Collection } from "discord.js";
import { readdir } from "fs/promises";
import { ICommand } from "../Interfaces/ICommand";
import { IEvent } from "../Interfaces/IEvent";
import path from "path";
import { ConsoleLogger } from "../utils/logger";

export class ExtendedClient extends Client {
  commands: Collection<string, ICommand> = new Collection();
  events: Collection<string, IEvent> = new Collection();
  aliases: Collection<string, ICommand> = new Collection();
  voiceConnection: any;

  logger: ConsoleLogger = new ConsoleLogger("NucitaBot", false);

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

  async getFilesList(folder: string): Promise<string[]> {
    let files = await readdir(folder);

    if (!folder.endsWith("/")) folder += "/";

    let result = files.map((file) => path.join(folder, file));

    return result;
  }

  async registerModules() {
    // Commands
    const commandFiles = await this.getFilesList(`${__dirname}/../commands/`);

    this.logger.log("Registering commands...\n", { before: "\n" });

    commandFiles.forEach(async (filePath: string) => {
      const command: ICommand = await this.importFile(filePath);

      if (!command?.name) return;
      this.commands.set(command.name, command);
      this.logger.log(`Command ${command.name} loaded!`);

      if (command?.aliases.length !== 0) {
        command.aliases.forEach((alias) => {
          this.aliases.set(alias, command);
        });
      }
    });

    // Events
    const eventFiles = await this.getFilesList(`${__dirname}/../events`);

    this.logger.log("Registering events...\n", { before: "\n" });

    eventFiles.forEach(async (filePath: string) => {
      const event: IEvent = await this.importFile(filePath);
      this.events.set(event.name, event);

      this.logger.log(`Event ${event.name} loaded!`);

      this.on(event.name, event.run.bind(null, this));
    });
  }
}
