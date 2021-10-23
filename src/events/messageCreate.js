const { join } = require('path');
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
			tts(message);
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

const tts = (msg) => {
	let gtts = new Gtts(msg.content, 'es');
	const file = join(__dirname, '../../tts.mp3');
	const channel = msg.member.voice.channel;
	const player = createAudioPlayer();

	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: msg.guild.id,
		adapterCreator: msg.guild.voiceAdapterCreator,
	});

	gtts.save(file, (err, result) => {
		if (err) throw new Error(err);
		const resource = createAudioResource(file);
		player.play(resource);
		connection.subscribe(player);
	});
};
