require('dotenv').config();
const Gtts = require('gtts');
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
} = require('@discordjs/voice');

const wTts = new TextToSpeechV1({
	authenticator: new IamAuthenticator({
		apikey: process.env.WATSON_API_KEY,
	}),
	serviceUrl: process.env.WATSON_URL_TTS,
});

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
		typeAccept: 'audio/ogg;codecs=opus',
		voice: 'es-ES_EnriqueV3Voice',
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

	wTts
		.synthesize({
			text: text,
			accept: options.typeAccept,
			voice: options.voice,
		})
		.then((buffer) => {
			const resource = createAudioResource(buffer.result);
			player.play(resource);
			connection.subscribe(player);
		})
		.catch((err) => {
			console.log('error:', err);
		});
};

module.exports = { famele, male };
