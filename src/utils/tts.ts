import { ExtendedClient } from './../structures/Client';
import { Message, VoiceChannel } from 'discord.js';
import Gtts from 'gtts';
const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	StreamType,
} = require('@discordjs/voice');

import {
	SpeechConfig,
	SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk';
import { PassThrough, Readable } from 'stream';
import { createDiscordJSAdapter } from './adapter';
import { client } from '..';

interface TTSOptions {
	lang?: string;
	voice?: string;
}

export enum TTSProviders {
	gtts = 'gtts',
	azure = 'azure',
}

export class Tts {
	text: string;
	author: string;
	voiceChannel: VoiceChannel;
	client: ExtendedClient;
	player;
	connection;

	constructor(message: Message, text?: string) {
		this.text = text ?? message.content.slice(1).trim();
		this.author = message.author.tag;
		this.voiceChannel = message.member.voice.channel as VoiceChannel;
		this.client = message.client as ExtendedClient;
		this.player = createAudioPlayer();
		this.connection = joinVoiceChannel({
			channelId: this.voiceChannel.id,
			guildId: this.voiceChannel.guild.id,
			adapterCreator: createDiscordJSAdapter(this.voiceChannel),
		});
	}

	speak(provider: TTSProviders, options?: TTSOptions) {
		if (this.text === '') return;

		console.log(`[${this.author}] ${this.text}`);

		if (provider === TTSProviders.gtts) {
			this.speakGtts(options);
		} else if (provider === TTSProviders.azure) {
			this.speakAzure(options);
		}
	}

	private speakAzure(
		options: TTSOptions = {
			lang: 'es-BO',
			voice: 'es-BO-MarceloNeural',
		}
	) {
		const speechConfig = SpeechConfig.fromSubscription(
			process.env.AZURE_API_KEY_TTS,
			process.env.AZURE_REGION_TTS
		);
		speechConfig.speechSynthesisLanguage = options.lang;
		speechConfig.speechSynthesisVoiceName = options.voice;

		const synthesizer = new SpeechSynthesizer(speechConfig);

		synthesizer.speakTextAsync(
			this.text,
			(result) => {
				const { audioData } = result;
				synthesizer.close();
				const bufferStream = new PassThrough();
				bufferStream.end(Buffer.from(audioData));
				this.playAudio(bufferStream);
			},
			(error) => {
				console.log(error);
				synthesizer.close();
			}
		);
	}

	private speakGtts(options: TTSOptions = { lang: 'es' }) {
		const gtts = new Gtts(this.text, options.lang);
		this.playAudio(gtts.stream());
	}

	private playAudio(stream: string | Readable) {
		const resource = createAudioResource(stream, {
			inputType: StreamType.Arbitrary,
		});
		this.player.play(resource);
		client.voiceConnection = this.connection;
		this.connection.subscribe(this.player);
	}
}
