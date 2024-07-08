import { ExtendedClient } from "./../structures/Client";
import { Message } from "discord.js";
import { IEvent } from "./../Interfaces/IEvent";
import { Tts, TTSProviders } from "../utils/tts";
import { ICommand } from "../Interfaces/ICommand";

const isMessageToTTS = (firstLetter: string): boolean => {
  return (
    firstLetter === process.env.VOICE_FEMALE_PREFIX ||
    firstLetter === process.env.VOICE_MALE_PREFIX
  );
};

const event: IEvent = {
  name: "messageCreate",
  run: async (client: ExtendedClient, message: Message) => {
    client.logger.setName("MessageCreate");

    if (message.author.bot) return;

    const firstLetter = message.content.charAt(0);

    if (firstLetter === process.env.COMMAND_PREFIX) {
      const args = message.content
        .slice(process.env.COMMAND_PREFIX.length)
        .trim()
        .split(/ +/g);

      const cmd = args.shift()?.toLowerCase();
      if (!cmd) return;
      const command = client.commands.get(cmd) || client.aliases.get(cmd);
      if (command) {
        (command as ICommand).run(client, message, args);
        client.logger.log(
          `command executed ${cmd} with args: ${args.join(", ")}`,
        );
      } else {
        client.logger.warn("Command not found: " + cmd);
        message
          .reply("Comando no encontrado")
          .then((m) => setTimeout(m.delete.bind(m), 5000));
      }
    }

    if (!isMessageToTTS(firstLetter)) return;

    if (message.member.voice.channel !== null) {
      const tts: Tts = new Tts(message);

      const ttsType =
        process.env.VOICE_FEMALE_PREFIX == firstLetter
          ? TTSProviders.gtts
          : TTSProviders.azure;

      tts.speak(ttsType);
    } else {
      client.logger.warn("User not in a voice channel");
      message
        .reply("Ingresa a un canal de voz")
        .then((m) => setTimeout(m.delete.bind(m), 5000));
    }
  },
};

export default event;
