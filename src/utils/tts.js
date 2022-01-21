const { AZURE_API_KEY_TTS, AZURE_REGION_TTS } = require('./config');
const Gtts = require('gtts');
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const { PassThrough } = require('stream');

const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
} = require('@discordjs/voice');

const famele = (client, msg, options = { lang: 'es' }) => {
	const {
		content,
		author,
		guild: { id, voiceAdapterCreator },
		member: {
			voice: { channel },
		},
	} = msg;

	const text = content.slice(1).trim();

	const gtts = new Gtts(text, options.lang);

	const player = createAudioPlayer();

	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: id,
		adapterCreator: voiceAdapterCreator,
	});

	client.customConnection = connection;

	console.log(`[${author.username}#${author.discriminator}] ${text}`);

	const resource = createAudioResource(gtts.stream());
	player.play(resource);
	connection.subscribe(player);
};

const male = (
	client,
	msg,
	options = {
		lang: 'es-BO',
		voice: 'es-BO-MarceloNeural',
	}
) => {
	const {
		content,
		author,
		guild: { id, voiceAdapterCreator },
		member: {
			voice: { channel },
		},
	} = msg;

	const text = content.slice(1).trim();

	const player = createAudioPlayer();

	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: id,
		adapterCreator: voiceAdapterCreator,
	});

	client.customConnection = connection;

	console.log(`[${author.username}#${author.discriminator}] ${text}`);
	const speechConfig = sdk.SpeechConfig.fromSubscription(
		AZURE_API_KEY_TTS,
		AZURE_REGION_TTS
	);

	speechConfig.speechSynthesisLanguage = options.lang;
	speechConfig.speechSynthesisVoiceName = options.voice;

	const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

	synthesizer.speakTextAsync(
		text,
		(result) => {
			const { audioData } = result;
			synthesizer.close();
			const bufferStream = new PassThrough();
			bufferStream.end(Buffer.from(audioData));
			const resource = createAudioResource(bufferStream);
			player.play(resource);
			connection.subscribe(player);
		},
		(error) => {
			console.log(error);
			synthesizer.close();
		}
	);
};

module.exports = { famele, male };
