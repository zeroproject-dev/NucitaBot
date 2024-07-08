import { ExtendedClient } from "./../structures/Client";
import { Message, VoiceChannel } from "discord.js";
import Gtts from "gtts";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  StreamType,
} from "@discordjs/voice";

import {
  SpeechConfig,
  SpeechSynthesizer,
} from "microsoft-cognitiveservices-speech-sdk";
import { PassThrough, Readable } from "stream";
import { createDiscordJSAdapter } from "./adapter";
import { client } from "..";
import MultiStream from "multistream";

interface TTSOptions {
  lang?: string;
  voice?: string;
}

export enum TTSProviders {
  gtts = "gtts",
  azure = "azure",
}

export class Tts {
  text: string;
  author: string;
  voiceChannel: VoiceChannel;
  client: ExtendedClient;
  player: any;
  connection: any;

  constructor(message: Message, text?: string) {
    this.text = text ?? message.content.slice(1).trim();
    this.author = message.author.tag;
    this.voiceChannel = message.member.voice.channel as VoiceChannel;
    this.client = message.client as ExtendedClient;
    this.client.logger.setName("TTS");
    this.client.logger.setWithDate(true);
    this.player = createAudioPlayer();
    this.connection = joinVoiceChannel({
      channelId: this.voiceChannel.id,
      guildId: this.voiceChannel.guild.id,
      adapterCreator: createDiscordJSAdapter(this.voiceChannel),
    });
  }

  speak(provider: TTSProviders, options?: TTSOptions) {
    if (this.text === "") return;

    this.client.logger.log(`[${this.author}] ${this.text}`);

    if (provider === TTSProviders.gtts) {
      this.speakGtts(options);
    } else if (provider === TTSProviders.azure) {
      this.speakAzure(options);
    }
  }

  private speakAzure(
    options: TTSOptions = {
      lang: "es-BO",
      voice: "es-BO-MarceloNeural",
    },
  ) {
    const speechConfig = SpeechConfig.fromSubscription(
      process.env.AZURE_API_KEY_TTS,
      process.env.AZURE_REGION_TTS,
    );
    speechConfig.speechSynthesisLanguage = options.lang;
    speechConfig.speechSynthesisVoiceName = options.voice;

    let synthesizer = new SpeechSynthesizer(speechConfig);

    synthesizer.speakTextAsync(
      this.text,
      (result) => {
        const { audioData } = result;
        synthesizer.close();
        const bufferStream = new PassThrough();
        bufferStream.end(Buffer.from(audioData));
        bufferStream.on("data", (data) => {
          this.client.logger.debug(`Data Length: ${data.length} bytes`);
        });

        this.playAudio(bufferStream);
        synthesizer = null;
      },
      (error) => {
        this.client.logger.error(error);
        synthesizer.close();
      },
    );
  }

  private speakGtts(options: TTSOptions = { lang: "es" }) {
    let gtts = new Gtts(
      this.text,
      options.lang,
      process.env.ENVIROMENT === "debug",
    );
    this.playAudio(gtts.stream() as MultiStream);
    gtts = null;
  }

  private playAudio(stream: Readable) {
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });
    this.player.play(resource);
    client.voiceConnection = this.connection;
    this.connection.subscribe(this.player);
  }
}
