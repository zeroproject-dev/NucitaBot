const { prefix } = require('../../config.json');
const Gtts = require('gtts');
const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	NoSubscriberBehavior,
	generateDependencyReport,
} = require('@discordjs/voice');

module.exports = {
	name: 'messageCreate',
	run(client, message) {
		if (message.author.bot) return;
		if (message.content.startsWith('.')) {
			if (!message.member.voice.channel)
				return message.channel.send('Ingresa a un canal de voz');

			tts(client, message);
			return;
		}
		if (!message.content.startsWith(prefix)) return;
		let [cmdname, ...cmdargs] = message.content
			.slice(prefix.length)
			.trim()
			.split(/\s+/);

		const cmd = client.commands.get(cmdname);

		if (!cmd) return;
		cmd.run(client, message, cmdargs);
	},
};

const tts = (client, msg) => {
	let gtts = new Gtts(msg.content.substr(1), 'es');
	const channel = msg.member.voice.channel;
	const player = createAudioPlayer();

	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: msg.guild.id,
		adapterCreator: msg.guild.voiceAdapterCreator,
	});

	client.customConnection = connection;

	console.log(
		`[${msg.author.username}#${msg.author.discriminator}] ${msg.content.substr(
			1
		)}`
	);
	const resource = createAudioResource(gtts.stream());
	player.play(resource);
	connection.subscribe(player);
};
